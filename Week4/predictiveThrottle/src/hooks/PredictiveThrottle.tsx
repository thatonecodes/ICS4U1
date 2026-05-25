import { useRef, useCallback } from "react";

export function usePredictiveThrottle<T extends (...args: any[]) => void>(
    callback: T,
    baseDelay: number,
    jitter: number,
    customDelayAlgorithm: (baseDelay: number, jitter: number) => number
) {
    const timeoutRef = useRef<number | null>(null);
    const lastCallRef = useRef<number>(0);

    const throttledFunction = useCallback(
        (...args: Parameters<T>) => {
            const now = Date.now();
            const delay = customDelayAlgorithm(baseDelay, jitter);

            if (!timeoutRef.current && now - lastCallRef.current >= delay) {
                callback(...args);
                lastCallRef.current = now;
            } else {
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
                timeoutRef.current = window.setTimeout(() => {
                    callback(...args);
                    lastCallRef.current = Date.now();
                    timeoutRef.current = null;
                }, delay);
            }
        },
        [callback, baseDelay, jitter, customDelayAlgorithm]
    );

    return throttledFunction;
}