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

@microservice()
export class FlickerMicroservice {
  public microservice: Microservice | undefined;

  private timesFlicked: number = 0;
  private currentHealth: Health['value'] = 'green';
  private flickTimer: NodeJS.Timer;
  private deathTimer: NodeJS.Timer;

  public constructor(
    interval: number = 5, // seconds
    lifeSpan: number = 300, // seconds
  ) {
    this.flickTimer = setInterval(this.do.bind(this), interval * 1000);
    this.deathTimer = setTimeout(this.die.bind(this), lifeSpan * 1000);
  }

  public async stop(): Promise<void> {
    clearInterval(this.flickTimer);
    clearTimeout(this.deathTimer);

    if (this.microservice)
      await this.microservice.stop();
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

  @method()
  public async health(): Promise<Health> {
    return {
      value: this.currentHealth,
      reason: this.currentHealth === 'red' ? 'Ouch!' : undefined,
    };
  }

  @method()
  public async status(): Promise<FlickerMicroserviceStatus> {
    return {
      timesFlicked: this.timesFlicked,
      randomString: String(Math.random()).substring(2),
    };
  }
}
