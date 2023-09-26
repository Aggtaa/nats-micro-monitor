import { Health } from '@nats-micro-monitor/types';
import {
  microservice, method, z, Microservice,
} from 'nats-micro';
import { clearInterval } from 'timers';

const flickerMicroserviceStatusSchema = z.object({
  timesFlicked: z.number(),
  randomString: z.string(),
});

type FlickerMicroserviceStatus = z.infer<typeof flickerMicroserviceStatusSchema>;

@microservice({
  name: 'flicker',
  version: '1.0.0',
  description: 'Just flicks its status and health every few seconds',
})
export class FlickerMicroservice {
  public microservice: Microservice | undefined;

  private timesFlicked: number = 0;
  private currentHealth: Health['value'] = 'green';
  private flickTimer: NodeJS.Timer;
  private deathTimer: NodeJS.Timer | undefined;

  public constructor(
    interval: number = 5, // seconds
    lifeSpan: number = -1, // seconds
  ) {
    this.flickTimer = setInterval(this.do.bind(this), interval * 1000);
    if (lifeSpan > 0)
      this.deathTimer = setTimeout(this.die.bind(this), lifeSpan * 1000);
  }

  private do(): void {
    if (this.currentHealth === 'green')
      this.currentHealth = 'yellow';
    else if (this.currentHealth === 'yellow')
      this.currentHealth = 'red';
    else
      this.currentHealth = 'green';

    this.timesFlicked++;
  }

  private die(): void {
    this.stop();
  }

  public async stop(): Promise<void> {
    clearInterval(this.flickTimer);
    if (this.deathTimer)
      clearTimeout(this.deathTimer);

    if (this.microservice)
      await this.microservice.stop();
  }

  @method()
  public async status(): Promise<FlickerMicroserviceStatus> {
    return {
      timesFlicked: this.timesFlicked,
      randomString: String(Math.random()).substring(2),
    };
  }
}
