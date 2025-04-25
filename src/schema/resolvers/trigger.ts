import { dataStore } from '../../data/loaders.js';

export const TriggerResolver = {
  Trigger: {
    resourceTemplate: (trigger: any) =>
      dataStore.resourceTemplates.find(r => r._id === trigger.resourceTemplateId),
  },
};
