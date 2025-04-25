import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema/types/index.js';
import { resolvers } from './schema/resolvers/index.js';
import dotenv from 'dotenv';
import { verifyToken } from './utils/auth.js';

dotenv.config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== 'production',
});

const { url } = await startStandaloneServer(server, {
  listen: { port: Number(process.env.PORT) || 4000 },
  context: async ({ req }: { req: any }) => {
    const op = req.body?.operationName;
    const query = req.body?.query || '';
  
    const isLoginMutation = query.includes('mutation') && query.includes('login');
  
    const isPublic = op === 'IntrospectionQuery' || op === 'login' || isLoginMutation;
  
    if (isPublic) {
      return {};
    }
  
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new Error('Authorization header missing');
  
    const token = authHeader.replace('Bearer ', '');
    const user = verifyToken(token);
  
    return { user };
  }
  
});

console.log(`🚀 Server ready at ${url}`);
