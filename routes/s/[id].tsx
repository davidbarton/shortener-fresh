import { FreshContext } from "$fresh/server.ts";
import { getLocation } from "../../modules/shortener/model.ts";
import { validateId } from "../../modules/shortener/validation.ts";

export async function handler(
  _req: Request,
  ctx: FreshContext,
): Promise<Response> {
  const id = ctx.params.id;
  const validationResult = validateId(id);

  if (validationResult) {
    throw new Deno.errors.NotFound();
  }

  const location = await getLocation("davidbarton", [id]);

  if (!location) {
    throw new Deno.errors.NotFound();
  }

  const headers = new Headers({ "Location": location.url });
  return new Response(null, { status: 307, headers });
}
