export function formatHex(num: number) {
  return `${num.toString(16).toUpperCase().padStart(2, "0")}`;
}
