import { ValuesOf } from "./types.ts";

const JSON_STATUS = {
  success: "success",
  error: "error",
} as const;

type JSONStatus = ValuesOf<typeof JSON_STATUS>;

interface JSONResponse {
  status: JSONStatus;
  message: string;
  data: unknown | null;
}

export function getResponse(json: JSONResponse, init?: ResponseInit): Response {
  return Response.json(json, init);
}

export function getDataResponse(data: unknown): Response {
  return getResponse({
    "status": "success",
    "message": "Resources were retrieved successfully.",
    data,
  });
}

export function getNotFoundResponse(): Response {
  return getResponse({
    "status": "error",
    "message": "Resource was not found.",
    "data": null,
  }, { status: 404 });
}

export function getEditResponse(): Response {
  return getResponse({
    "status": "success",
    "message": "Resource was edited successfully.",
    "data": null,
  });
}

export function getDeleteResponse(): Response {
  return getResponse({
    "status": "success",
    "message": "Resource was deleted successfully.",
    "data": null,
  });
}
