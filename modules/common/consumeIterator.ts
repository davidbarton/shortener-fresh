export async function consumeIterator<T>(
  iterator: AsyncIterableIterator<T>,
): Promise<T[]> {
  const items = [];

  for await (const item of iterator) {
    items.push(item);
  }

  return items;
}
