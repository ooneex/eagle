import { Eagle } from '@/app/mod.ts';
import './controllers/HomeController.ts';
import './controllers/NotFoundController.ts';
import './controllers/ServerExceptionController.ts';
import './controllers/UserController.ts';
import './controllers/UserService.ts';

const app = new Eagle();
app.listen({
  hostname: '127.0.0.1',
  port: 3000,
});
