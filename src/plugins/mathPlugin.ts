import { Plugin } from './pluginTypes';

export const mathPlugin: Plugin = {
  name: 'math',
  description: 'Evaluate a math expression',
  async execute(query: string) {
    // Very basic and safe math evaluator
    try {
      if (!/^[-+*/()\d\s.]+$/.test(query)) return 'Invalid expression.';
      // eslint-disable-next-line no-eval
      const result = eval(query);
      return `Result: ${result}`;
    } catch {
      return 'Error evaluating expression.';
    }
  },
};