import { Eagle } from "@/Eagle.ts";
import { Get } from "@/controller/decorators.ts";
import type { IController } from "@/controller/types.ts";

@Get()
export class TestController implements IController {
  public exec() {
    return new Response("Hello, world!");
  }
}

const app = new Eagle();
app.listen();
