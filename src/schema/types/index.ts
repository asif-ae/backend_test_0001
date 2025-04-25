import { gql } from "graphql-tag";
import { ActionType } from "./action";
import { NodeObjectType } from "./nodeObject";
import { ResourceTemplateType } from "./resourceTemplate";
import { ResponseType } from "./response";
import { TriggerType } from "./trigger";

export const typeDefs = gql`
  scalar JSON
  scalar Long

  ${ActionType}
  ${TriggerType}
  ${ResponseType}
  ${ResourceTemplateType}
  ${NodeObjectType}

  type Query {
    node(nodeId: ID!): NodeObject
  }
`;
