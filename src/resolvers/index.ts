import { Application } from 'express';
import { ApolloServer, gql, IResolvers } from 'apollo-server-express';
import { latestPilets, convertDependencies } from '../pilets';

const typeDefs = gql`
  type PiletMetadata {
    name: ID!
    version: String
    author: PiletAuthor
    hash: String
    link: String
    dependencies: [PiletDependency]
  }

  type PiletDependency {
    name: String
    link: String
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
      return pilets.map(p => ({
        name: p.name,
        version: p.version,
        author: p.author,
        hash: p.hash,
        link: p.link,
        dependencies: convertDependencies(p.dependencies || {}),
      }));
    },
    async piletLicense(_parent: any, args: any, _context: any) {
      const { pilet: id } = args;
      const pilets = await latestPilets();
      const [pilet] = pilets.filter(m => m.name === id);

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
};

export function withGql(app: Application) {
  const server = new ApolloServer({ typeDefs, resolvers });
  server.applyMiddleware({ app, path: '/' });
  return app;
}
