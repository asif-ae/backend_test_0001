import nodes from '../../data/node.json';
import triggers from '../../data/trigger.json';
import actions from '../../data/action.json';
import responses from '../../data/response.json';
import resourceTemplates from '../../data/resourceTemplate.json';

export const resolvers = {
  Query: {
    node: (_: any, { nodeId }: { nodeId: string }) => {
      console.log(`Querying node with ID: ${nodeId}`);
      const node = nodes.find((n) => n._id === nodeId);
      return node || null;
    },
  },
  NodeObject: {
    parents: (parent: any) => {
      console.log(`Resolving parents for node: ${parent._id}, parentIds: ${JSON.stringify(parent.parentIds)}`);
      if (!parent.parentIds || !Array.isArray(parent.parentIds)) return [];
      return parent.parentIds.map((parentId: string) => {
        const node = nodes.find((n) => n._id === parentId);
        return node || null;
      }).filter((n: any) => n !== null);
    },
    parentIds: (parent: any) => {
      console.log(`Resolving parentIds for node: ${parent._id}, parentIds: ${JSON.stringify(parent.parentIds)}`);
      return parent.parentIds || [];
    },
    trigger: (parent: any) => {
      console.log(`Resolving trigger for node: ${parent._id}, triggerId: ${parent.triggerId}`);
      if (!parent.triggerId) return null;
      return triggers.find((t) => t._id === parent.triggerId) || null;
    },
    triggerId: (parent: any) => {
      console.log(`Resolving triggerId for node: ${parent._id}, triggerId: ${parent.triggerId}`);
      return parent.triggerId || null;
    },
    responses: (parent: any) => {
      console.log(`Resolving responses for node: ${parent._id}, responseIds: ${JSON.stringify(parent.responseIds)}`);
      if (!parent.responseIds || !Array.isArray(parent.responseIds)) {
        console.log(`Returning null for responses as responseIds is invalid: ${JSON.stringify(parent.responseIds)}`);
        return null;
      }
      return parent.responseIds.map((responseId: string) => {
        const response = responses.find((r) => r._id === responseId);
        if (!response) {
          console.log(`Response not found for ID: ${responseId}`);
        }
        return response || null;
      }).filter((r: any) => r !== null);
    },
    responseIds: (parent: any) => {
      console.log(`Resolving responseIds for node: ${parent._id}, responseIds: ${JSON.stringify(parent.responseIds)}`);
      return parent.responseIds || null;
    },
    actions: (parent: any) => {
      console.log(`Resolving actions for node: ${parent._id}, actionIds: ${JSON.stringify(parent.actionIds)}`);
      if (!parent.actionIds || !Array.isArray(parent.actionIds)) return null;
      return parent.actionIds.map((actionId: string) => {
        const action = actions.find((a) => a._id === actionId);
        return action || null;
      }).filter((a: any) => a !== null);
    },
    actionIds: (parent: any) => {
      console.log(`Resolving actionIds for node: ${parent._id}, actionIds: ${JSON.stringify(parent.actionIds)}`);
      return parent.actionIds || null;
    },
    postActions: (parent: any) => {
      console.log(`Resolving postActions for node: ${parent._id}, postActionIds: ${JSON.stringify(parent.postActionIds)}`);
      if (!parent.postActionIds || !Array.isArray(parent.postActionIds)) return null;
      return parent.postActionIds.map((actionId: string) => {
        const action = actions.find((a) => a._id === actionId);
        return action || null;
      }).filter((a: any) => a !== null);
    },
    redirect: (parent: any) => {
      console.log(`Resolving redirect for node: ${parent._id}, redirect: ${JSON.stringify(parent.redirect)}`);
      return parent.redirect || null;
    },
  },
  Action: {
    resourceTemplate: (parent: any) => {
      console.log(`Resolving resourceTemplate for action: ${parent._id}, resourceTemplateId: ${parent.resourceTemplateId}`);
      if (!parent.resourceTemplateId) return null;
      return resourceTemplates.find((rt) => rt._id === parent.resourceTemplateId) || null;
    },
  },
  Trigger: {
    resourceTemplate: (parent: any) => {
      console.log(`Resolving resourceTemplate for trigger: ${parent._id}, resourceTemplateId: ${parent.resourceTemplateId}`);
      if (!parent.resourceTemplateId) return null;
      return resourceTemplates.find((rt) => rt._id === parent.resourceTemplateId) || null;
    },
  },
};
