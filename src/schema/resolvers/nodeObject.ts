import { dataStore } from "../../data/loaders";

export const NodeObjectResolver = {
  Query: {
    node: (_: any, { nodeId }: { nodeId: string }) => {
      const found = dataStore.nodes.find(n => n._id === nodeId);
      return found || null;
    },
  },
  NodeObject: {
    parentIds: (node: any) => node.parents || [],
    parents: (node: any) => {
      return node.parents?.map((pid: string) =>
        dataStore.nodes.find(n => n._id === pid)
      ) || [];
    },
    triggerId: (node: any) => node.trigger,
    trigger: (node: any) => {
      return dataStore.triggers.find(t => t._id === node.trigger);
    },
    responseIds: (node: any) => node.responses || [],
    responses: (node: any) => {
      return (node.responses || []).map((rid: string) =>
        dataStore.responses.find(r => r._id === rid)
      );
    },
    actionIds: (node: any) =>
      (node.actions || node.preActions || node.postActions || []).flat(),
    actions: (node: any) => {
      const ids = (node.actions || [])
        .concat(node.preActions || [])
        .concat(node.postActions || []);
      return ids.map((aid: string) =>
        dataStore.actions.find(a => a._id === aid)
      );
    },
    colour: () => null,     // Add missing fields
    priority: () => null,
  },
};
