import { IController, Path } from '@/controller/mod.ts';
import { IResponse } from '@/response/mod.ts';
import { UserService } from './UserService.ts';

@Path('/users/:id')
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
