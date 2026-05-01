// Persisted user preference for which Ollama model the chat assistant
// should use. Stored in localStorage so it survives reloads but stays
// per-browser (no backend state to manage).
//
// `null` means "use whatever the server defaults to" (OLLAMA_MODEL env var).

const KEY = "kpv:selected-model";

export const getSelectedModel = (): string | null => {
  try {
    const v = localStorage.getItem(KEY);
    return v && v.length > 0 ? v : null;
  } catch {
    return null;
  }
};

export const setSelectedModel = (model: string | null): void => {
  try {
    if (model) {
      localStorage.setItem(KEY, model);
    } else {
      localStorage.removeItem(KEY);
    }
  } catch {
    // Quota exceeded or storage disabled — preference just won't persist.
  }
};
