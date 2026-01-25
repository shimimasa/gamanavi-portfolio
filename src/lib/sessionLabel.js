export function formatSessionLabel(sessionId) {
  const trimmed = typeof sessionId === "string" ? sessionId.trim() : "";
  const resolved = trimmed.length > 0 ? trimmed : "default";

  if (resolved === "default") {
    return {
      id: "default",
      label: "未分類（仮）",
      sub: "(内部ID: default)",
    };
  }

  return {
    id: resolved,
    label: resolved,
    sub: `(内部ID: ${resolved})`,
  };
}
