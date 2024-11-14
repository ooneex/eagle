import { Get, IController } from '@/controller/mod.ts';
import { IResponse } from '@/response/mod.ts';
import { UserService } from './UserService.ts';

@Get('/users/:id')
export class UserController implements IController {
  constructor(
    private readonly userService: UserService,
  ) {}

  public action(
    response: IResponse,
  ): IResponse {
    console.log(this.userService);

    return response.text('Hello, world!', 404);
  }
}
