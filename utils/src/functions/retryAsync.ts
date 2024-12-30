export const INFINITE = 100;
export async function retryAsync<Type = any>(
  operation: () => Promise<Type>,
  retries: number = 3,
  interval: number = 100,
  maxInterval: number = 500,
  retryOperation?: () => Promise<any>
): Promise<Type> {
  try {
    return await operation();
  } catch (err) {
    if (retries === 1) throw err;
    await new Promise((resolve) => setTimeout(resolve, interval));
    await retryOperation?.();
    const delay: number = Math.min(interval, maxInterval * 2); // back off delay
    return retryAsync(operation, retries - 1, delay, maxInterval, retryOperation);
  }
}
