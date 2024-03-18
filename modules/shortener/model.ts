import {
  getKey,
  getKeyPrefix,
  kv,
  NAMESPACE,
  setIfNotExist,
} from "../database/denoKv.ts";
import { NonEmptyArray } from "../common/types.ts";
import { LocationRecord } from "./types.ts";
import { consumeIterator } from "../common/consumeIterator.ts";

export async function addLocation(
  user: string,
  path: NonEmptyArray<string>,
  value: LocationRecord,
): Promise<Deno.KvCommitResult | Deno.KvCommitError> {
  const key = getKey(NAMESPACE.shortener, user, path);
  return await setIfNotExist(key, value);
}

export async function editLocation(
  user: string,
  path: NonEmptyArray<string>,
  value: LocationRecord,
): Promise<void> {
  const key = getKey(NAMESPACE.shortener, user, path);
  await kv.set(key, value);
}

export async function removeLocation(
  user: string,
  path: NonEmptyArray<string>,
): Promise<void> {
  const key = getKey(NAMESPACE.shortener, user, path);
  await kv.delete(key);
}

export async function getLocation(
  user: string,
  path: NonEmptyArray<string>,
): Promise<LocationRecord | null> {
  const key = getKey(NAMESPACE.shortener, user, path);
  const result = await kv.get<LocationRecord>(key);
  return result.value;
}

export async function getLocationList(user: string): Promise<LocationRecord[]> {
  const prefix = getKeyPrefix(NAMESPACE.shortener, user);
  const iterator: Deno.KvListIterator<LocationRecord> = kv.list<LocationRecord>(
    { prefix },
  );

  const items = await consumeIterator(iterator);
  return items.map(({ value }) => value);
}
