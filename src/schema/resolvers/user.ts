import { generateToken } from "../../utils/auth";

export const UserResolver = {
  Query: {
    me: (_: any, __: any, context: any) => {
      if (!context.user) throw new Error('Unauthorized');
      return `Welcome, ${context.user.username}`;
    },
  },
  Mutation: {
    login: async (_: any, args: { username: string; password: string }) => {
      const { username } = args;

      const token = generateToken({ id: 'mock-user-id', username });

      return { token };
    },
  },
};
