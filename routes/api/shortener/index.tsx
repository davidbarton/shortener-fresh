import { FreshContext, Handlers } from "$fresh/server.ts";
import {
  getDataResponse,
  getDeleteResponse,
  getEditResponse,
  getNotFoundResponse,
} from "../../../modules/common/jsonResponse.ts";
import {
  addLocation,
  editLocation,
  getLocationList,
} from "../../../modules/shortener/model.ts";
import {
  getLocation,
  removeLocation,
} from "../../../modules/shortener/model.ts";

export const handler: Handlers = {
  async GET(_req: Request, ctx: FreshContext): Promise<Response> {
    const locationList = await getLocationList("davidbarton");
    return getDataResponse(locationList);
  },

  async POST(req: Request, ctx: FreshContext): Promise<Response> {
    const data = await req.json();
    // validateData(data);
    const result = await addLocation("davidbarton", data.id, data);

    if (!result.ok) {
      return await ctx.render({ error: "Shortened link already exists" });
    }

    return await ctx.render();
  },
};
