import { Plugin } from './pluginTypes';

export const weatherPlugin: Plugin = {
  name: 'weather',
  description: 'Get current weather for a location',
  async execute(query: string) {
    // Mocked response for demo
    if (/bangalore/i.test(query)) {
      return 'The weather in Bangalore is 28°C, partly cloudy.';
    }
    return `Weather for '${query}': 25°C, sunny.`;
  },
};