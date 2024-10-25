export function withFatalErrorOnNull<T>(message: string) {
  return (callback: () => T | null) => {
    const result = callback();
    if (result === null) {
      console.error(message);
      process.exit(1);
    }
    return result;
  };
}
