import { Plugin } from './pluginTypes';
import { weatherPlugin } from './weatherPlugin';
import { mathPlugin } from './mathPlugin';

const plugins: Plugin[] = [weatherPlugin, mathPlugin];

// Detect plugin intent and extract query
export async function runPluginsIfNeeded(message: string): Promise<{ pluginName?: string, output?: string }> {
  // Weather intent
  const weatherMatch = message.match(/weather in ([\w\s]+)/i);
  if (weatherMatch) {
    const location = weatherMatch[1];
    const output = await weatherPlugin.execute(location);
    return { pluginName: weatherPlugin.name, output };
  }
  // Math intent (e.g. 'what is 2 + 2 * 5')
  const mathMatch = message.match(/(?:what is|calculate|solve) ([\d\s+\-*/().]+)/i);
  if (mathMatch) {
    const expr = mathMatch[1];
    const output = await mathPlugin.execute(expr);
    return { pluginName: mathPlugin.name, output };
  }
  return {};
}