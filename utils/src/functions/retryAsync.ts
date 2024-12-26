export const INFINITE = 100;
export async function retryAsync<Type = any>(
  operation: () => Promise<Type>,
  retries: number = 3,
  interval: number = 500,
  maxInterval: number = 2000,
  retryOperation?: () => Promise<any>
) {
  try {
    return await operation();
  } catch (err) {
    if (retries === 1) return err;
    await new Promise((resolve) => setTimeout(resolve, interval));
    await retryOperation?.();
    const delay: number = Math.min(interval, maxInterval * 2); // back off delay
    return retryAsync(operation, retries - 1, delay, maxInterval, retryOperation);
  }
}
