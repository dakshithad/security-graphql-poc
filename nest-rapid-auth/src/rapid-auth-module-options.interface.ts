import { ModuleMetadata, Type } from '@nestjs/common';

export interface AuthHeaderConfigOptions {
  username?: string;
  email?: string;
  name?: string;
  token?: string;
  roles?: string;
}

export interface RapidAuthModuleOptions {
  federation: string;
  authHeaders?: AuthHeaderConfigOptions;
}

export interface RapidAuthOptionsFactory {
  createRapidAuthOptions():
    | Promise<RapidAuthModuleOptions>
    | RapidAuthModuleOptions;
}

export interface RapidAuthModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<RapidAuthOptionsFactory>;
  useClass?: Type<RapidAuthOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<RapidAuthModuleOptions> | RapidAuthModuleOptions;
  inject?: any[];
}
