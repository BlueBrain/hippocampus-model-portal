import * as React from "react";
import JSON5 from "json5";

/**
 * State variable that can be stored in session storage.
 * @param defaultValue Default value for initialization.
 * @param storageKey Key where to store it in session storage.
 * @param initialTransform If defined, it is used to transform the value read from storage.
 */
export function useSessionStorageState<T>(
  defaultValue: T,
  storageKey: string,
  initialTransform?: (value: T) => T
): [value: T, setValue: (value: T) => void] {
  const [value, setValue] = React.useState<T>(defaultValue);
  React.useEffect(() => {
    setValue(get(storageKey, defaultValue));
  }, [defaultValue, storageKey]);
  return [
    value,
    (newValue: T) => {
      setValue(newValue);
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(storageKey, JSON5.stringify(newValue));
      }
    },
  ];
}

function get<T>(
  key: string,
  defaultValue: T,
  initialTransform?: (value: T) => T
): T {
  if (typeof window === "undefined") return defaultValue;

  const text = window.sessionStorage.getItem(key);
  if (text === null) return defaultValue;

  try {
    const value: T = JSON5.parse(text);
    return initialTransform ? initialTransform(value) : value;
  } catch (ex) {
    console.error(`Unexpected value in session storage "${key}":`, ex);
    return initialTransform ? initialTransform(defaultValue) : defaultValue;
  }
}
