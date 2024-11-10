import { STATUS_CODE } from '@/http/http_status.ts';
import { StatusCodeKeyType, StatusCodeType } from '@/http/types.ts';

export const getStatusCode = (key: StatusCodeKeyType): StatusCodeType => {
  return STATUS_CODE[key];
};
