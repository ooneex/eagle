import { Get, IController } from '@/controller/mod.ts';
import { HttpResponse, IHttpResponse } from '@/response/mod.ts';

@Get()
export class TestController implements IController {
  // private readonly name: string = 'coucou';

  constructor() {}

  public action(request: Request): IHttpResponse {
    console.log(request);
    const response = new HttpResponse();

    return response.text('Hello, world!');
  }
}
