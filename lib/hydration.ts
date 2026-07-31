export const getHydrationSnapshot = () => true;
export const getServerHydrationSnapshot = () => false;

export function subscribeToHydration(onStoreChange: () => void) {
  const timeout = window.setTimeout(onStoreChange, 0);
  return () => window.clearTimeout(timeout);
}
