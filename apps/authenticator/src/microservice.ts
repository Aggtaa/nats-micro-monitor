import { Health, HttpRequest } from '@nats-micro-monitor/types';
import { microservice, method, z } from 'nats-micro';

const LoginRequestSchema = z.object({
  username: z.string(),
  password: z.string(),
});
type LoginRequest =
  z.infer<typeof LoginRequestSchema>;

const LoginResponseSchema = z.object({
});
type LoginResponse =
  z.infer<typeof LoginResponseSchema>;

const StatusSchema = z.object({
});
type Status = z.infer<typeof StatusSchema>;

@microservice({
  name: 'authenticator',
  version: '0.1.0',
  description: 'User authentication',
})
export class Authenticator {

  @method({
    metadata: {
      'nats-micro.v1.http.endpoint.path': 'login.json',
    },
  })
  public async login(req: HttpRequest<LoginRequest>): Promise<LoginResponse> {

    const { username, password } = req.body;
    console.dir({ username, password });

    return {};
  }

  public async health(): Promise<Health> {
    return {
      value: 'green',
    };
  }

  @method()
  public async status(): Promise<Status> {
    return {
    };
  }
}
