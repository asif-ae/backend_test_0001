import { GraphQLScalarType, Kind } from 'graphql';

export const LongScalar = {
  Long: new GraphQLScalarType({
    name: 'Long',
    description: '64-bit integer as string',
    serialize(value: unknown) {
      return typeof value === 'bigint' ? value.toString() : value;
    },
    parseValue(value: unknown) {
      return typeof value === 'string' ? BigInt(value) : value;
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.STRING) return BigInt(ast.value);
      return null;
    },
  }),
};
