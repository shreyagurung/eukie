type RuntimeErrorContext = Record<string, unknown>;

export function reportRuntimeError(error: unknown, context: RuntimeErrorContext = {}) {
  if (typeof window === "undefined") {
    console.error(error, context);
    return;
  }

  console.error(error, context);

  if (typeof window.dispatchEvent === "function") {
    window.dispatchEvent(
      new CustomEvent("app:error", {
        detail: { error, context },
      }),
    );
  }
}
