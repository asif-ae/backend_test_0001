import { gql } from 'graphql-tag';

export const ResourceTemplateType = gql`
  type ResourceTemplate {
    _id: ID!
    createdAt: Long!
    updatedAt: Long
    name: String!
    description: String
    schema: JSON
    integrationId: ID
    functionString: String
    key: String
  }
`;
