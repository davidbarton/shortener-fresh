const ID_MAX_LENGTH = 200;
const ID_ALLOWED_CHARACTERS = "a-zA-Z0-9";

interface ValidationError {
  message: string;
}

export function validateId(id: string): ValidationError | null {
  if (!id || id.length > ID_MAX_LENGTH || !id.match(ID_ALLOWED_CHARACTERS)) {
    return { message: "Invalid id" };
  }

  return null;
}
