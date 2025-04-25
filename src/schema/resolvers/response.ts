export const ResponseResolver = {
  ResponsePlatform: {
    localeGroups: (platform: any) => platform.localeGroups || [],
  },
  ResponseLocaleGroup: {
    variations: (group: any) => group.variations || [],
  },
  ResponseVariation: {
    responses: (variation: any) => variation.responses || [],
  },
};
