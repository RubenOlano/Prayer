export const debounce = (fn: () => void, ms: number) => {
    let timeoutId: NodeJS.Timeout;
    return () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            fn();
        }, ms);
    };
};