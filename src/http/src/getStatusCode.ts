import { STATUS_CODE } from "./http_status";
import type { StatusCodeKeyType, StatusCodeType } from "./types";

/**
 * Retrieves the status code value associated with the given key.
 */
export const getStatusCode = (key: StatusCodeKeyType): StatusCodeType => {
  return STATUS_CODE[key];
};
