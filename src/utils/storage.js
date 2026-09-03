const getStorage = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

export const storage = {
  get(key, fallback = null) {
    const storageRef = getStorage();
    if (!storageRef) {
      return fallback;
    }

    try {
      const value = storageRef.getItem(key);
      return value === null ? fallback : value;
    } catch {
      return fallback;
    }
  },

  set(key, value) {
    const storageRef = getStorage();
    if (!storageRef) {
      return false;
    }

    try {
      storageRef.setItem(key, String(value));
      return true;
    } catch {
      return false;
    }
  },

  remove(key) {
    const storageRef = getStorage();
    if (!storageRef) {
      return false;
    }

    try {
      storageRef.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },
};

export const getStoredBoolean = (key, fallback = false) => {
  const value = storage.get(key, String(fallback));
  return value === "true" || value === true;
};
