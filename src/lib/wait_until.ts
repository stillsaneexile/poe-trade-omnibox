// Checks the condition this frequently.
const CHECK_INTERVAL_MS = 100;

/**
 * Wait until something occurs, like they would in WebDriver or DOM tests.
 *
 * Resolves anyways after maxWaitMs.
 *
 * Adapted from:
 * https://stackoverflow.com/a/64947598/892168
 */
const waitUntil = async (
  condition: () => boolean,
  maxWaitMs: number = 1000
) => {
  let timeWaitedMs = 0;
  return new Promise<void>((resolve) => {
    let interval = setInterval(() => {
      if (!condition() && timeWaitedMs < maxWaitMs) {
        timeWaitedMs += CHECK_INTERVAL_MS;
        console.log("waiting");
        return;
      }

      clearInterval(interval);
      resolve();
    }, CHECK_INTERVAL_MS);
  });
};

export default waitUntil;
