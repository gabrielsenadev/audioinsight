export function debounce(timeInMS = 300) {
  let timeoutId: any = null;
  
  return (callback: () => void) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(callback, timeInMS);
  }
}
