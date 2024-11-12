import { IController, NotFound } from '@/controller/mod.ts';
import { IResponse } from '@/response/mod.ts';

@NotFound()
export class NotFoundController implements IController {
  public action(
    response: IResponse,
  ): IResponse {
    return response.text('Not Found', 404);
  }
}
