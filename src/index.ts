import { ApolloServer, BaseContext } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from 'fs';
import { join } from 'path';
import { resolvers } from './resolvers';
import { GraphQLError } from 'graphql';

// Load GraphQL schema with error handling
const schemaPath = join(__dirname, '../src/schema/typeDefs.graphql');
console.log('Attempting to load schema from:', schemaPath);
let typeDefs: string;
try {
  typeDefs = readFileSync(schemaPath, 'utf8');
  console.log('Schema loaded successfully');
} catch (error) {
  console.error('Failed to load schema:', error);
  throw error;
}

// Authentication context
const VALID_TOKEN = 'test-token';

interface AuthContext extends BaseContext {
  token?: string;
}

const context = async ({ req }: { req: any }): Promise<AuthContext> => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  
  if (!token || token !== VALID_TOKEN) {
    throw new GraphQLError('Invalid or missing Bearer token', {
      extensions: {
        code: 'UNAUTHENTICATED',
        http: { status: 401 },
      },
    });
  }

  return { token };
};

// Initialize Apollo Server
console.log('Initializing Apollo Server with introspection enabled...');
const server = new ApolloServer<AuthContext>({
  typeDefs,
  resolvers,
  plugins: [],
  introspection: true,
});

// Start the server
async function startServer(): Promise<void> {
  console.log('Starting standalone server...');
  try {
    const { url } = await startStandaloneServer(server, {
      context: async ({ req }) => context({ req }),
      listen: { port: 4000 },
    });
    console.log(`🚀 Server ready at ${url}`);
    console.log(`Use Bearer token: ${VALID_TOKEN}`);
  } catch (error) {
    console.error('Server startup failed:', error);
    throw error;
  }
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
