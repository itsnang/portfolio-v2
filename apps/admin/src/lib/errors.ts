/** A requested record doesn't exist (or isn't public). */
export class NotFoundError extends Error {
  constructor() {
    super("Resource not found");
    this.name = "NotFoundError";
  }
}
