import { gql } from 'graphql-tag';

export const ResponseType = gql`
  type Response {
    _id: ID!
    createdAt: Long!
    updatedAt: Long
    name: String!
    description: String
    platforms: [ResponsePlatform!]
  }

  type ResponsePlatform {
    integrationId: ID!
    build: Int
    localeGroups: [ResponseLocaleGroup!]
  }

  type ResponseLocaleGroup {
    localeGroupId: ID!
    variations: [ResponseVariation!]
  }

  type ResponseVariation {
    name: String!
    responses: JSON
  }
`;
