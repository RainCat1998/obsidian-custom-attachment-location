import { showError } from "./Error.ts";

export type MaybePromise<T> = T | Promise<T>;

export type RetryOptions = {
  timeoutInMilliseconds: number;
  retryDelayInMilliseconds: number;
};

export async function retryWithTimeout(asyncFn: () => Promise<boolean>, retryOptions: Partial<RetryOptions> = {}): Promise<void> {
  const DEFAULT_RETRY_OPTIONS: RetryOptions = {
    timeoutInMilliseconds: 5000,
    retryDelayInMilliseconds: 100
  };
  const overriddenOptions: RetryOptions = { ...DEFAULT_RETRY_OPTIONS, ...retryOptions };
  await runWithTimeout(overriddenOptions.timeoutInMilliseconds, async () => {
    let attempt = 0;
    while (true) {
      attempt++;
      if (await asyncFn()) {
        if (attempt > 1) {
          console.debug(`Retry completed successfully after ${attempt} attempts`);
        }
        return;
      }

      console.debug(`Retry attempt ${attempt} completed unsuccessfully. Trying again in ${overriddenOptions.retryDelayInMilliseconds} milliseconds`);
      console.debug(asyncFn);
      await sleep(overriddenOptions.retryDelayInMilliseconds);
    }
  });
}

async function runWithTimeout<R>(timeoutInMilliseconds: number, asyncFn: () => Promise<R>): Promise<R> {
  return await Promise.race([asyncFn(), timeout(timeoutInMilliseconds)]);
}

async function timeout(timeoutInMilliseconds: number): Promise<never> {
  await sleep(timeoutInMilliseconds);
  throw new Error(`Timed out in ${timeoutInMilliseconds} milliseconds`);
}

export function invokeAsyncSafely(promise: Promise<unknown>): void {
  promise.catch(showError);
}

export function convertAsyncToSync<Args extends unknown[], R>(asyncFunc: (...args: Args) => Promise<R>): (...args: Args) => void {
  return (...args: Args): void => invokeAsyncSafely(asyncFunc(...args));
}
