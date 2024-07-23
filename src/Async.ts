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
    let failedBefore = false;
    while (true) {
      if (await asyncFn()) {
        if (failedBefore) {
          console.debug("Retry completed successfully");
        }
        return;
      }

      failedBefore = true;
      console.debug(`Retry completed unsuccessfully. Trying again in ${retryDelayInMilliseconds} milliseconds`);
      await sleep(retryDelayInMilliseconds);
    }
  });
}

async function runWithTimeout<R>(timeoutInMilliseconds: number, asyncFn: () => Promise<R>): Promise<R> {
  return await Promise.race([asyncFn(), timeout()]);

  async function timeout(): Promise<never> {
    await sleep(timeoutInMilliseconds);
    throw new Error(`Timed out in ${timeoutInMilliseconds} milliseconds`);
  }
}

export function invokeAsyncSafely(promise: Promise<unknown>): void {
  promise.catch(showError);
}

export function convertAsyncToSync<Args extends unknown[], R>(asyncFunc: (...args: Args) => Promise<R>): (...args: Args) => void {
  return (...args: Args): void => invokeAsyncSafely(asyncFunc(...args));
}
