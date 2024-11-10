import type { StatusCodeType } from "@ooneex/http";
import type { ScalarType } from "@ooneex/types";

export class NotFoundResponse {
  public readonly data: Record<string, ScalarType>;
  public readonly message: string;
  public status: StatusCodeType;

  constructor(
    message: string,
    data?: Record<string, ScalarType>,
    status?: StatusCodeType,
  ) {
    this.message = message;
    this.data = data ?? {};
    this.status = status ?? 404;
  }
}
