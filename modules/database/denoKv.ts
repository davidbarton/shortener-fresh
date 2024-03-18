import { NonEmptyArray, ValuesOf } from "../common/types.ts";

async function getKv() {
  return await Deno.openKv();
}

export const kv = await getKv();

export const NAMESPACE: Record<string, Deno.KvKeyPart> = {
  shortener: "shortener",
} as const;

type KeyNamespace = ValuesOf<typeof NAMESPACE>;

export async function setIfNotExist(
  key: Deno.KvKey,
  value: unknown,
  options?: { expireIn?: number },
): Promise<Deno.KvCommitResult | Deno.KvCommitError> {
  return await kv.atomic().check({ key, versionstamp: null }).set(
    key,
    value,
    options,
  ).commit();
}

export function getKeyPrefix(
  namespace: KeyNamespace,
  user: Deno.KvKeyPart,
  path: Array<Deno.KvKeyPart> = [],
): Deno.KvKey {
  return [namespace, user, ...path];
}

export function getKey(
  namespace: KeyNamespace,
  user: Deno.KvKeyPart,
  path: NonEmptyArray<Deno.KvKeyPart>,
): Deno.KvKey {
  return getKeyPrefix(namespace, user, path);
}
