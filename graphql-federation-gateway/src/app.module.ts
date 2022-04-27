import { ApolloGateway } from '@apollo/gateway';
import { Module } from '@nestjs/common';
import { GATEWAY_BUILD_SERVICE, GraphQLGatewayModule } from '@nestjs/graphql';
import { AuthModule } from './auth/auth.module';
import { BuildServiceModule } from './build-service.module';
import { AuthenticatedDataSource } from './auth/authenticated.datasource';

const gateway = new ApolloGateway({
  buildService: ({ url }) => new AuthenticatedDataSource({ url }),
  serviceList: [
    { name: 'employees', url: 'http://localhost:3000/graphql' },
    { name: 'projects', url: 'http://localhost:3001/graphql' },
    { name: 'locations', url: 'http://localhost:3002/graphql' },
  ],
});

@Module({
  imports: [
    AuthModule,
    GraphQLGatewayModule.forRootAsync({
      useFactory: async () => ({
        server: {
          cors: true,
          context: ({ req, res }) => ({ req, res }),
        },
        gateway: {
          serviceList: [
            { name: 'employees', url: 'http://localhost:3000/graphql' },
            { name: 'projects', url: 'http://localhost:3001/graphql' },
            { name: 'locations', url: 'http://localhost:3002/graphql' },
          ],
        },
      }),
      imports: [BuildServiceModule],
      inject: [GATEWAY_BUILD_SERVICE],
    }),
  ],
  controllers: [],
})
export class AppModule {}
