let loggingOut = false;

const listeners = new Set<() => void>();

export function isLoggingOut() {
  return loggingOut;
}

export function setLoggingOut(value: boolean) {
  loggingOut = value;
  listeners.forEach((listener) => listener());
}

export function subscribeLogout(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
