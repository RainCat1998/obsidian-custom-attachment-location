import { showError } from "./Error.ts";

export type MaybePromise<T> = T | Promise<T>;

export async function retryWithTimeout(
  asyncFn: () => Promise<boolean>,
  {
    timeoutInMilliseconds = 5000,
    retryDelayInMilliseconds = 100,
  }: {
    timeoutInMilliseconds?: number,
    retryDelayInMilliseconds?: number,
  } = {}
): Promise<void> {
  await runWithTimeout(timeoutInMilliseconds, async () => {
    let attempt = 0;
    while (true) {
      attempt++;
      if (await asyncFn()) {
        if (attempt > 1) {
          console.debug(`Retry completed successfully after ${attempt} attempts`);
        }
        return;
      }

      console.debug(`Retry attempt ${attempt} completed unsuccessfully. Trying again in ${retryDelayInMilliseconds} milliseconds`);
      console.debug(asyncFn);
      await sleep(retryDelayInMilliseconds);
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
