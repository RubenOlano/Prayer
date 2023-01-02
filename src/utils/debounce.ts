export const debounce = (fn: () => void, ms: number) => {
  return (() => {
    let timeoutId: number;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(
        () => {
          fn();
        },
        ms,
        true
      );
    };
  })();
};
