import { IController, ServerException } from '@/controller/mod.ts';
import { IResponse } from '@/response/mod.ts';

@ServerException()
export class ServerExceptionController implements IController {
  public action(
    response: IResponse,
  ): IResponse {
    return response.exception('Internal Server Error', {
      name: 'ServerException',
      date: new Date(),
    });
  }
}
