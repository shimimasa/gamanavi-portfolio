const memoryStore = globalThis.__ratingsMemoryStore ?? new Map();
const memoryRateLimits = globalThis.__ratingsRateLimit ?? new Map();

if (!globalThis.__ratingsMemoryStore) {
  globalThis.__ratingsMemoryStore = memoryStore;
}

if (!globalThis.__ratingsRateLimit) {
  globalThis.__ratingsRateLimit = memoryRateLimits;
}

const choices = ["fun", "ok", "hard"];
const kvUrl = process.env.KV_REST_API_URL;
const kvToken = process.env.KV_REST_API_TOKEN;
const isKvConfigured = Boolean(kvUrl && kvToken);

function getKey(slug, choice) {
  return `ratings:${slug}:${choice}`;
}

function getTotalKey(slug) {
  return `ratings:${slug}:total`;
}

function getRateLimitKey(slug, ip) {
  return `ratings:rate:${slug}:${ip}`;
}

function getMemoryValue(key) {
  const value = memoryStore.get(key);
  return typeof value === "number" ? value : 0;
}

async function kvRequest(path) {
  if (!kvUrl || !kvToken) return null;
  try {
    const response = await fetch(`${kvUrl}${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${kvToken}`,
      },
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data?.result ?? null;
  } catch {
    return null;
  }
}

export function kvStatus() {
  return {
    configured: isKvConfigured,
    source: isKvConfigured ? "kv" : "memory",
  };
}

export async function incrementRating(slug, choice) {
  const totalKey = getTotalKey(slug);

  if (isKvConfigured) {
    const choiceKey = getKey(slug, choice);
    const choiceResult = await kvRequest(`/incr/${encodeURIComponent(choiceKey)}`);
    const totalResult = await kvRequest(`/incr/${encodeURIComponent(totalKey)}`);
    if (choiceResult !== null && totalResult !== null) {
      return;
    }
  }

  const choiceKey = getKey(slug, choice);
  memoryStore.set(choiceKey, getMemoryValue(choiceKey) + 1);
  memoryStore.set(totalKey, getMemoryValue(totalKey) + 1);
}

export async function getRatingSummary(slug) {
  if (isKvConfigured) {
    const keys = choices.map((choice) => getKey(slug, choice));
    keys.push(getTotalKey(slug));
    const path = `/mget/${keys.map((key) => encodeURIComponent(key)).join("/")}`;
    const result = await kvRequest(path);
    if (Array.isArray(result)) {
      const [fun, ok, hard, total] = result;
      return {
        fun: Number(fun ?? 0),
        ok: Number(ok ?? 0),
        hard: Number(hard ?? 0),
        total: Number(total ?? 0),
        source: "kv",
      };
    }
  }

  return {
    fun: getMemoryValue(getKey(slug, "fun")),
    ok: getMemoryValue(getKey(slug, "ok")),
    hard: getMemoryValue(getKey(slug, "hard")),
    total: getMemoryValue(getTotalKey(slug)),
    source: "memory",
  };
}

export async function checkRateLimit(ip, slug, ttlSeconds = 30) {
  const key = getRateLimitKey(slug, ip);

  if (isKvConfigured) {
    const path = `/set/${encodeURIComponent(key)}/1?nx=true&ex=${ttlSeconds}`;
    const response = await kvRequest(path);
    if (response !== null) {
      return response === "OK";
    }
  }

  const now = Date.now();
  const nextAllowed = memoryRateLimits.get(key);
  if (typeof nextAllowed === "number" && nextAllowed > now) {
    return false;
  }

  memoryRateLimits.set(key, now + ttlSeconds * 1000);
  return true;
}
