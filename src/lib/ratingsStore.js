const memoryStore = globalThis.__ratingsMemoryStore ?? new Map();
const memoryRateLimits = globalThis.__ratingsRateLimit ?? new Map();
const memoryDailyRatings = globalThis.__ratingsDailyDevice ?? new Map();
const memorySessionMemos = globalThis.__ratingsSessionMemo ?? new Map();
const memoryTeacherComments = globalThis.__ratingsTeacherComments ?? new Map();

if (!globalThis.__ratingsMemoryStore) {
  globalThis.__ratingsMemoryStore = memoryStore;
}

if (!globalThis.__ratingsRateLimit) {
  globalThis.__ratingsRateLimit = memoryRateLimits;
}

if (!globalThis.__ratingsDailyDevice) {
  globalThis.__ratingsDailyDevice = memoryDailyRatings;
}

if (!globalThis.__ratingsSessionMemo) {
  globalThis.__ratingsSessionMemo = memorySessionMemos;
}

if (!globalThis.__ratingsTeacherComments) {
  globalThis.__ratingsTeacherComments = memoryTeacherComments;
}

const choices = ["fun", "ok", "hard"];
const defaultSessionId = "default";
const kvUrl = process.env.KV_REST_API_URL;
const kvToken = process.env.KV_REST_API_TOKEN;
const isKvConfigured = Boolean(kvUrl && kvToken);

function normalizeSessionId(sessionId) {
  if (typeof sessionId === "string" && sessionId.trim().length > 0) {
    return sessionId.trim();
  }
  return defaultSessionId;
}

function getKey(sessionId, slug, choice) {
  return `ratings:${sessionId}:${slug}:${choice}`;
}

function getLegacyKey(slug, choice) {
  return `ratings:${slug}:${choice}`;
}

function getTotalKey(sessionId, slug) {
  return `ratings:${sessionId}:${slug}:total`;
}

function getLegacyTotalKey(slug) {
  return `ratings:${slug}:total`;
}

function getRateLimitKey(slug, ip) {
  return `ratings:rate:${slug}:${ip}`;
}

function getDailyDeviceKey(sessionId, slug, dateKey, deviceId) {
  return `rated:${sessionId}:${slug}:${dateKey}:${deviceId}`;
}

function getLegacyDailyDeviceKey(slug, dateKey, deviceId) {
  return `rated:${slug}:${dateKey}:${deviceId}`;
}

function getSessionMemoKey(sessionId) {
  return `session:memo:${sessionId}`;
}

function getTeacherCommentKey(sessionId, slug) {
  return `session:teacher-comment:${sessionId}:${slug}`;
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

export async function incrementRating(slug, choice, sessionId) {
  const resolvedSessionId = normalizeSessionId(sessionId);
  const totalKey = getTotalKey(resolvedSessionId, slug);

  if (isKvConfigured) {
    const choiceKey = getKey(resolvedSessionId, slug, choice);
    const choiceResult = await kvRequest(`/incr/${encodeURIComponent(choiceKey)}`);
    const totalResult = await kvRequest(`/incr/${encodeURIComponent(totalKey)}`);
    if (choiceResult !== null && totalResult !== null) {
      return;
    }
  }

  const choiceKey = getKey(resolvedSessionId, slug, choice);
  memoryStore.set(choiceKey, getMemoryValue(choiceKey) + 1);
  memoryStore.set(totalKey, getMemoryValue(totalKey) + 1);
}

export async function getRatingSummary(slug, sessionId) {
  const resolvedSessionId = normalizeSessionId(sessionId);
  const isDefault = resolvedSessionId === defaultSessionId;

  if (isKvConfigured) {
    const keys = choices.map((choice) => getKey(resolvedSessionId, slug, choice));
    keys.push(getTotalKey(resolvedSessionId, slug));
    if (isDefault) {
      choices.forEach((choice) => keys.push(getLegacyKey(slug, choice)));
      keys.push(getLegacyTotalKey(slug));
    }
    const path = `/mget/${keys.map((key) => encodeURIComponent(key)).join("/")}`;
    const result = await kvRequest(path);
    if (Array.isArray(result)) {
      const [fun, ok, hard, total, legacyFun, legacyOk, legacyHard, legacyTotal] = result;
      return {
        fun: Number(fun ?? 0) + Number(legacyFun ?? 0),
        ok: Number(ok ?? 0) + Number(legacyOk ?? 0),
        hard: Number(hard ?? 0) + Number(legacyHard ?? 0),
        total: Number(total ?? 0) + Number(legacyTotal ?? 0),
        source: "kv",
      };
    }
  }

  return {
    fun:
      getMemoryValue(getKey(resolvedSessionId, slug, "fun")) +
      (isDefault ? getMemoryValue(getLegacyKey(slug, "fun")) : 0),
    ok:
      getMemoryValue(getKey(resolvedSessionId, slug, "ok")) +
      (isDefault ? getMemoryValue(getLegacyKey(slug, "ok")) : 0),
    hard:
      getMemoryValue(getKey(resolvedSessionId, slug, "hard")) +
      (isDefault ? getMemoryValue(getLegacyKey(slug, "hard")) : 0),
    total:
      getMemoryValue(getTotalKey(resolvedSessionId, slug)) +
      (isDefault ? getMemoryValue(getLegacyTotalKey(slug)) : 0),
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

export async function registerDailyDeviceRating(slug, deviceId, dateKey, sessionId) {
  const resolvedSessionId = normalizeSessionId(sessionId);
  const isDefault = resolvedSessionId === defaultSessionId;
  const keyDate = dateKey ?? new Date().toISOString().slice(0, 10);
  const key = getDailyDeviceKey(resolvedSessionId, slug, keyDate, deviceId);
  const legacyKey = isDefault ? getLegacyDailyDeviceKey(slug, keyDate, deviceId) : null;

  if (isKvConfigured) {
    if (legacyKey) {
      const legacyExisting = await kvRequest(`/get/${encodeURIComponent(legacyKey)}`);
      if (legacyExisting !== null) {
        return { alreadyRated: true, source: "kv" };
      }
    }

    const path = `/set/${encodeURIComponent(key)}/1?nx=true`;
    const response = await kvRequest(path);
    if (response !== null) {
      return {
        alreadyRated: response !== "OK",
        source: "kv",
      };
    }

    const existing = await kvRequest(`/get/${encodeURIComponent(key)}`);
    if (existing !== null) {
      return { alreadyRated: true, source: "kv" };
    }
  }

  if (memoryDailyRatings.has(key)) {
    return { alreadyRated: true, source: "memory" };
  }

  if (legacyKey && memoryDailyRatings.has(legacyKey)) {
    return { alreadyRated: true, source: "memory" };
  }

  memoryDailyRatings.set(key, true);
  return { alreadyRated: false, source: "memory" };
}

export async function getSessionMemo(sessionId) {
  const resolvedSessionId = normalizeSessionId(sessionId);
  const key = getSessionMemoKey(resolvedSessionId);

  if (isKvConfigured) {
    const memo = await kvRequest(`/get/${encodeURIComponent(key)}`);
    if (memo !== null) {
      return typeof memo === "string" ? memo : String(memo ?? "");
    }
  }

  const value = memorySessionMemos.get(key);
  return typeof value === "string" ? value : "";
}

export async function setSessionMemo(sessionId, memo) {
  const resolvedSessionId = normalizeSessionId(sessionId);
  const key = getSessionMemoKey(resolvedSessionId);
  const memoValue = typeof memo === "string" ? memo : String(memo ?? "");

  if (isKvConfigured) {
    const response = await kvRequest(
      `/set/${encodeURIComponent(key)}/${encodeURIComponent(memoValue)}`
    );
    if (response !== null) {
      return { ok: response === "OK", source: "kv" };
    }
  }

  memorySessionMemos.set(key, memoValue);
  return { ok: true, source: "memory" };
}

export async function getTeacherComment(sessionId, slug) {
  const resolvedSessionId = normalizeSessionId(sessionId);
  const resolvedSlug = typeof slug === "string" ? slug.trim() : "";
  if (!resolvedSlug) return "";
  const key = getTeacherCommentKey(resolvedSessionId, resolvedSlug);

  if (isKvConfigured) {
    const memo = await kvRequest(`/get/${encodeURIComponent(key)}`);
    if (memo !== null) {
      return typeof memo === "string" ? memo : String(memo ?? "");
    }
  }

  const value = memoryTeacherComments.get(key);
  return typeof value === "string" ? value : "";
}

export async function setTeacherComment(sessionId, slug, comment) {
  const resolvedSessionId = normalizeSessionId(sessionId);
  const resolvedSlug = typeof slug === "string" ? slug.trim() : "";
  if (!resolvedSlug) return { ok: false, source: "memory" };
  const key = getTeacherCommentKey(resolvedSessionId, resolvedSlug);
  const commentValue = typeof comment === "string" ? comment : String(comment ?? "");

  if (isKvConfigured) {
    const response = await kvRequest(
      `/set/${encodeURIComponent(key)}/${encodeURIComponent(commentValue)}`
    );
    if (response !== null) {
      return { ok: response === "OK", source: "kv" };
    }
  }

  memoryTeacherComments.set(key, commentValue);
  return { ok: true, source: "memory" };
}
