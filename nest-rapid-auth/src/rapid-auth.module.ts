import { DynamicModule, Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import {
  RAPID_AUTH_HEADER_EMAIL,
  RAPID_AUTH_HEADER_NAME,
  RAPID_AUTH_HEADER_ROLES,
  RAPID_AUTH_HEADER_TOKEN,
  RAPID_AUTH_HEADER_USERNAME,
  RAPID_AUTH_MODULE_OPTIONS,
} from './rapid-auth.constants';
import {
  RapidAuthModuleOptions,
  RapidAuthModuleAsyncOptions,
} from './rapid-auth-module-options.interface';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Global()
@Module({})
export class RapidAuthModule {
  private static imports = [];

  public static register(options: RapidAuthModuleOptions): DynamicModule {
    return {
      module: RapidAuthModule,
      global: true,
      imports: RapidAuthModule.imports,
      providers: [
        {
          provide: RAPID_AUTH_MODULE_OPTIONS,
          useValue: RapidAuthModule.createRapidAuthModuleOptions(options),
        },
        {
          provide: APP_GUARD,
          useClass: AuthGuard,
        },
        {
          provide: APP_GUARD,
          useClass: RolesGuard,
        },
      ],
      exports: [RAPID_AUTH_MODULE_OPTIONS],
    };
  }

  public static registerAsync(
    asyncOptions: RapidAuthModuleAsyncOptions,
  ): DynamicModule {
    return {
      module: RapidAuthModule,
      global: true,
      imports: [...RapidAuthModule.imports, ...(asyncOptions.imports || [])],
      providers: [
        RapidAuthModule.createOptionsProvider(asyncOptions),
        {
          provide: APP_GUARD,
          useClass: AuthGuard,
        },
        {
          provide: APP_GUARD,
          useClass: RolesGuard,
        },
      ],
      exports: [RAPID_AUTH_MODULE_OPTIONS],
    };
  }

  private static createOptionsProvider(
    asyncOptions: RapidAuthModuleAsyncOptions,
  ) {
    if (!asyncOptions.useFactory) {
      throw new Error("registerAsync must have 'useFactory'");
    }
    return {
      inject: asyncOptions.inject || [],
      provide: RAPID_AUTH_MODULE_OPTIONS,
      useFactory: asyncOptions.useFactory,
    };
  }

  private static createRapidAuthModuleOptions(
    options?: RapidAuthModuleOptions,
  ): RapidAuthModuleOptions {
    return {
      federation: options?.federation,
      authHeaders: {
        username: RAPID_AUTH_HEADER_USERNAME,
        email: RAPID_AUTH_HEADER_EMAIL,
        name: RAPID_AUTH_HEADER_NAME,
        roles: RAPID_AUTH_HEADER_ROLES,
        token: RAPID_AUTH_HEADER_TOKEN,
        ...options?.authHeaders,
      },
    } as RapidAuthModuleOptions;
  }
}
