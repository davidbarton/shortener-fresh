import { FreshContext, Handlers } from "$fresh/server.ts";
import { removeLocation } from "../../../modules/shortener/model.ts";
import { validateId } from "../../../modules/shortener/validation.ts";

export const handler: Handlers = {
  async POST(req: Request, ctx: FreshContext): Promise<Response> {
    const id = ctx.params.id;
    const validationResult = validateId(id);

    if (validationResult) {
      throw new Deno.errors.NotFound();
    }

    const form = await req.formData();
    const url = form.get("url")?.toString();

    if (!url) {
      await removeLocation("davidbarton", [id]);
      const headers = new Headers({ "Location": "/tools/shortener" });
      return new Response(null, { status: 307, headers });
    }

    return new Response("Not implemented yet", {
      status: 501,
      statusText: "Not Implemented",
    });
  },
};
