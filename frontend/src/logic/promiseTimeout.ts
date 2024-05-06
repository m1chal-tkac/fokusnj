export function promiseTimeout<T>(
  min: number,
  max: number,
  promise: Promise<T>,
  genericError?: boolean
) {
  return new Promise(async (resolve, reject) => {
    setTimeout(() => {
      reject(new Error("Akce trvala moc dlouho"));
    }, max);
    const start = Date.now();
    try {
      const data = await promise;

      setTimeout(() => {
        resolve(data);
      }, Math.max(0, min - (+Date.now() - +start)));
    } catch (e) {
      setTimeout(() => {
        reject(genericError ? new Error("Akce se nezdařila") : e);
      }, Math.max(0, min - (+Date.now() - +start)));
    }
  }) as Promise<T>;
}
