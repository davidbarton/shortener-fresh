import { FreshContext, Handlers } from "$fresh/server.ts";
import {
  getDataResponse,
  getDeleteResponse,
  getEditResponse,
  getNotFoundResponse,
} from "../../../modules/common/jsonResponse.ts";
import { editLocation } from "../../../modules/shortener/model.ts";
import {
  getLocation,
  removeLocation,
} from "../../../modules/shortener/model.ts";

export const handler: Handlers = {
  async GET(_req: Request, ctx: FreshContext): Promise<Response> {
    const id = ctx.params.id;
    // validateId(id);
    if (!id) {
      return getNotFoundResponse();
    }
    const item = await getLocation("davidbarton", [id]);
    if (!item) {
      return getNotFoundResponse();
    }
    return getDataResponse(item);
  },

  async PUT(req: Request, ctx: FreshContext): Promise<Response> {
    const id = ctx.params.id;
    // validateId(id);
    if (!id) {
      return getNotFoundResponse();
    }
    const data = await req.json();
    // validateData(data);
    await editLocation("davidbarton", [id], data);
    // if (!id) {
    //   return getNotFoundResponse();
    // }
    return getEditResponse();
  },

  async DELETE(_req: Request, ctx: FreshContext): Promise<Response> {
    const id = ctx.params.id;
    // validateId(id);
    if (!id) {
      return getNotFoundResponse();
    }
    await removeLocation("davidbarton", [id]);
    // if (!id) {
    //   return getNotFoundResponse();
    // }
    return getDeleteResponse();
  },
};
