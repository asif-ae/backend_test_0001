import { gql } from "graphql-tag";
import { ActionType } from "./action";
import { NodeObjectType } from "./nodeObject";
import { ResourceTemplateType } from "./resourceTemplate";
import { ResponseType } from "./response";
import { TriggerType } from "./trigger";
import { UserTypeDefs } from "./user";

export const typeDefs = gql`
  scalar JSON
  scalar Long

  ${ActionType}
  ${TriggerType}
  ${ResponseType}
  ${ResourceTemplateType}
  ${NodeObjectType}
  ${UserTypeDefs}

  type Query {
    node(nodeId: ID!): NodeObject
  }
`;
