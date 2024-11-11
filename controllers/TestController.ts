import { Get, IController } from '@/controller/mod.ts';
import { HttpResponse, IResponse } from '@/response/mod.ts';

@Get()
export class TestController implements IController {
  public action(request: Request): IResponse {
    const response = new HttpResponse();

    // console.log(request);

    return response.text('Hello, world!');
  }
}
