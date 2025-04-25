import gql from "graphql-tag";

export const UserTypeDefs = gql`
  type AuthPayload {
    token: String!
  }

  type Query {
    me: String! # 🔐 Protected query
  }

  type Mutation {
    login(username: String!, password: String!): AuthPayload!
  }
`;
