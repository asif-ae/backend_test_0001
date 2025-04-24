import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";
import { resolvers } from "./resolvers.js";
import dotenv from "dotenv";

dotenv.config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (token !== process.env.AUTH_TOKEN) {
      throw new Error("Unauthorized");
    }
    return {};
  },
});

console.log(`🚀 Server ready at ${url}`);
console.log(`🚀 Auth token: ${process.env.AUTH_TOKEN}`);
