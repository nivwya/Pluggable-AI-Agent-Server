export interface Plugin {
  name: string;
  description: string;
  execute(query: string): Promise<string>;
}