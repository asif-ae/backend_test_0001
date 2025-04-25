import { gql } from 'graphql-tag';

export const NodeObjectType = gql`
  type NodeObject {
    _id: ID!
    createdAt: Long!
    updatedAt: Long
    name: String!
    description: String
    parentIds: [ID!]
    parents: [NodeObject!]
    triggerId: ID
    trigger: Trigger
    responseIds: [ID!]
    responses: [Response!]
    actionIds: [ID!]
    actions: [Action!]
    root: Boolean
    priority: Int
    compositeId: String
    global: Boolean
    colour: String
  }
`;
