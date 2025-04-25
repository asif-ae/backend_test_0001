import { dataStore } from '../../data/loaders.js';

export const ActionResolver = {
  Action: {
    resourceTemplate: (action: any) =>
      dataStore.resourceTemplates.find(r => r._id === action.resourceTemplateId),
  },
};
