import { IController, Post } from '@/controller/mod.ts';
import { HttpResponse, IResponse } from '@/response/mod.ts';

@Post('/')
export class HomeController implements IController {
  public action(): IResponse {
    const response = new HttpResponse();

    return response.text('Hello, world!');
  }
}
