import type { StatusCodeType } from "@ooneex/http";

export class RedirectResponse {
  public readonly url: string | URL;
  public readonly status: StatusCodeType;

  constructor(url: string | URL, status?: StatusCodeType) {
    this.url = url;
    this.status = status ?? 307;
  }
}
