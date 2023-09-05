import { useCallback, useRef } from "react";

export function sleep({ ms }: { ms: number }): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type CallbackType<A extends any[], R> = (...args: A) => R;
export const useEvent = <A extends any[], R>(
  callback: CallbackType<A, R>
): CallbackType<A, R> => {
  const fn = useRef(callback);

  fn.current = callback;

  return useCallback((...args) => {
    return fn.current(...args);
  }, []);
};
