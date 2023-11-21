import { promises as fs } from 'fs';
import yaml from 'js-yaml';

export type Feature = {
  feature: string;
  settings?: Record<string, unknown>;
};

export type Features = {
  [x: string]: Feature;
};

export class FeatureWatcher {

  private features: Features = {};

  public async readConfigFromFile(path: string): Promise<void> {

    const configStr = (await fs.readFile(path)).toString();
    const { features } = yaml.load(configStr) as { features: Features; };
    this.features = features;

    await this.update();
  }

  public async update(): Promise<void> {
    // TODO
  }
}
