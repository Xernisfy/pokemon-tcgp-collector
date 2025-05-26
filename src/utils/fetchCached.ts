export async function fetchCached(
  request: RequestInfo | URL,
  options?: CacheQueryOptions,
): Promise<Response> {
  const cache = await caches.open("v1");
  const cachedResponse = await cache.match(request, options);
  if (cachedResponse) return cachedResponse;
  const response = await fetch(request);
  await cache.put(request, response.clone());
  return response;
}
