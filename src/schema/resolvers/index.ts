import { scalarResolvers } from "./scalars";
import { NodeObjectResolver } from "./nodeObject";
import { ActionResolver } from "./action";
import { TriggerResolver } from "./trigger";
import { ResponseResolver } from "./response";
import { ResourceTemplateResolver } from "./resourceTemplate";
import { UserResolver } from "./user";

export const resolvers = {
  Query: {
    ...NodeObjectResolver.Query,
    ...UserResolver.Query,
  },
  Mutation: {
    ...UserResolver.Mutation,
  },
  NodeObject: {
    ...NodeObjectResolver.NodeObject,
  },
  Action: {
    ...ActionResolver.Action,
  },
  Trigger: {
    ...TriggerResolver.Trigger,
  },
  ResponsePlatform: {
    ...ResponseResolver.ResponsePlatform,
  },
  ResponseLocaleGroup: {
    ...ResponseResolver.ResponseLocaleGroup,
  },
  ResponseVariation: {
    ...ResponseResolver.ResponseVariation,
  },
  ...scalarResolvers,
};
