import type { IUrl } from '@/url';

export type ControllerActionParamType = {
  url: IUrl;
};

export type ControllerActionType = (
  param: ControllerActionParamType,
) => Promise<void> | void;
