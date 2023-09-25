import { exec, spawn } from 'child_process';
import { promises as fs } from 'fs';
import yaml from 'js-yaml';
import json5 from 'json5';
import { Broker, MessageMaybeReplyTo } from 'nats-micro';
import { dirname, join, resolve } from 'path';
import { promisify } from 'util';

import { debug } from './debug.js';
import { FakeMicroservice } from './fakeMicroservice.js';
import { PartialBy } from './types.js';

export type ModuleConfigFileFormat = 'yaml' | 'json';

export const CONFIG_FILE_NAMES: Record<string, ModuleConfigFileFormat> = {
  'service.yaml': 'yaml',
  'service.yml': 'yaml',
  'service.json': 'json',
};

export type ServiceConfig = {
  name: string;
  description?: string;
  version?: string;
  workDir: string;
  environment?: Record<string, string>;
  start: string;
  // stop: string;
}

export type ModuleConfig = {
  services: Record<string, PartialBy<ServiceConfig, 'name' | 'workDir'>>;
}

export type ServiceAtDir = ServiceConfig & {
  dir: string;
}

export class Coordinator {

  public readonly services: ServiceAtDir[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public readonly fakeInstances: FakeMicroservice<any>[] = [];

  constructor(
    public readonly node: string,
    private readonly broker: Broker,
  ) {
  }

  private expandEnvVars(value: string): string {
    return value.replace(/(?<!\\)\$(.+)/g, (m, match) => process.env[match] ?? '');
  }

  public async addService(dir: string, config: PartialBy<ServiceConfig, 'workDir'>): Promise<void> {
    debug.info(`Loading service "${config.name}" from ${dir}`);

    const environment = { ...config.environment };
    if (environment) {
      for (const [name, value] of Array.from(Object.entries(environment))) {
        try {
          environment[name] = this.expandEnvVars(String(value));
        }
        catch (err) {
          console.error(err);
        }
      }
    }

    this.services.push({
      dir,
      workDir: '.',
      ...config,
      environment,
    });

    const microservice = new FakeMicroservice(
      this.broker,
      this.node,
      config.name,
      config.description ?? `Coordinator on ${this.node} - This service can be started`,
      config.version ?? '99.99.99',
      (
        { data: params }: MessageMaybeReplyTo<Record<string, unknown>>,
      ) =>
        this.startByName(config.name, params),
    );

    this.fakeInstances.push(microservice);

    await microservice.start();
  }

  public async addModule(dir: string, config: ModuleConfig): Promise<void> {
    debug.info(`Loading module from ${dir}`);
    for (const [name, service] of Object.entries(config.services))
      await this.addService(dir, { name, ...service });
  }

  public async addModuleFromFile(path: string, format: ModuleConfigFileFormat): Promise<void> {
    const configStr = (await fs.readFile(path)).toString();

    let config: ModuleConfig;
    if (format === 'yaml')
      config = yaml.load(configStr) as ModuleConfig;
    else if (format === 'json')
      config = json5.parse(configStr);
    else
      throw new Error('Unknown config file format');

    return this.addModule(dirname(path), config);
  }

  public async addModuleFromDir(dir: string): Promise<void> {
    for (const [configFileName, format] of Object.entries(CONFIG_FILE_NAMES)) {
      try {
        const path = join(dir, configFileName);
        return await this.addModuleFromFile(path, format as ModuleConfigFileFormat);
      }
      catch { /* empty */ }
    }
    throw new Error('Failed to load any known config file format');
  }

  public async discoverModulesInDir(dir: string, nestDepth: number = 1): Promise<void> {
    if (nestDepth <= 0)
      return;

    debug.info(`Looking for modules in ${dir}`);
    try {
      await this.addModuleFromDir(dir);
    }
    catch { /* empty */ }

    for (const name of await fs.readdir(dir)) {
      try {
        const subdir = join(dir, name);
        if ((await fs.stat(subdir)).isDirectory())
          await this.discoverModulesInDir(subdir, nestDepth - 1);
      }
      catch { /* empty */ }
    }
  }

  public async startByName(name: string, params: Record<string, unknown>): Promise<void> {
    const service = this.services.find((svc) => svc.name === name);
    if (!service)
      throw new Error('Service not found');

    await promisify(exec)(
      service.start,
      {
        cwd: resolve(service.dir, service.workDir),
        env: {
          ...service.environment,
          ...params,
          MICROSERVICE_NODE_NAME: this.node,
        },
      },
    );

    // const child = spawn(
    //   '/usr/bin/sh',
    //   ['-c', service.start],
    //   {
    //     stdio: 'inherit',
    //     cwd: resolve(service.dir, service.workDir),
    //     env: service.environment,
    //   },
    // );

    // child.unref();
  }
}
