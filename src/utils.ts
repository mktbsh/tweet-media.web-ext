export function newURL(url: string | URL, base?: string | URL): URL {
  return new URL(url, base);
}

type ExtractKeys<T> = T extends ReadonlyArray<infer U> ? U : never;

export function extractURLParams<const T extends ReadonlyArray<string>>(
  urlOrParams: URL | URLSearchParams,
  keys: T
): { [K in ExtractKeys<T>]: string | null } {
  const params =
    urlOrParams instanceof URL ? urlOrParams.searchParams : urlOrParams;
  return keys.reduce((acc, key) => {
    acc[key as ExtractKeys<T>] = params.get(key);
    return acc;
  }, {} as { [K in ExtractKeys<T>]: string | null });
}
