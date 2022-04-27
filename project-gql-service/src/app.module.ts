import { Module } from '@nestjs/common';
import { ProjectModule } from './project/project.module';
import { GraphQLFederationModule, GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    ProjectModule,
    GraphQLFederationModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/graphql-schema.gql'),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'nairobi',
      password: '1qazxsw2#',
      database: 'project-fed-db',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
