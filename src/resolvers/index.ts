import { GraphQLJSON } from 'graphql-type-json';
import { Application } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { IResolvers } from '@graphql-tools/utils';
import { gql } from 'graphql-tag';
import { latestPilets } from '../pilets';

const typeDefs = gql`
  scalar JSON

  type PiletMetadata {
    name: ID!
    description: String
    version: String
    author: PiletAuthor
    hash: String
    content: String
    link: String
    custom: JSON
    integrity: String
    requireRef: String
  }

  type PiletLicense {
    pilet: ID!
    author: PiletAuthor
    type: String
    text: String
  }

  type PiletAuthor {
    name: String
    email: String
  }

  type Query {
    pilets: [PiletMetadata]

    piletLicense(pilet: ID!): PiletLicense
  }
`;

const resolvers: IResolvers = {
  Query: {
    async pilets(_parent: any, _args: any, _context: any) {
      const pilets = await latestPilets();
      return pilets;
    },
    async piletLicense(_parent: any, args: any, _context: any) {
      const { pilet: id } = args;
      const pilets = await latestPilets();
      const [pilet] = pilets.filter((m) => m.name === id);

      if (pilet) {
        return {
          pilet: pilet.name,
          author: pilet.author,
          type: pilet.license.type,
          text: pilet.license.text,
        };
      }

      return undefined;
    },
  },
  JSON: GraphQLJSON,
};

export async function withGql(app: Application) {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  app.use('/', expressMiddleware(server));
}
