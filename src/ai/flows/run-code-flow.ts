'use server';
/**
 * @fileOverview A flow to execute code snippets.
 *
 * - runCode - A function that executes a code snippet.
 * - RunCodeInput - The input type for the runCode function.
 * - RunCodeOutput - The return type for the runCode function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const RunCodeInputSchema = z.object({
  code: z.string().describe('The code snippet to execute.'),
  language: z.string().describe('The programming language of the code.'),
});
export type RunCodeInput = z.infer<typeof RunCodeInputSchema>;

const RunCodeOutputSchema = z.object({
  output: z.string().optional().describe('The stdout of the code execution.'),
  error: z.string().optional().describe('The stderr of the code execution.'),
});
export type RunCodeOutput = z.infer<typeof RunCodeOutputSchema>;


const runCodeTool = ai.defineTool(
    {
      name: 'runCode',
      description: 'Runs a code snippet and returns the output.',
      inputSchema: RunCodeInputSchema,
      outputSchema: RunCodeOutputSchema,
    },
    async (input) => {
      // This is a placeholder. In a real environment, you would use a secure code execution sandbox.
      console.log(`Executing ${input.language} code:`, input.code);
      try {
        if (input.language === 'javascript') {
            let output = '';
            const oldLog = console.log;
            console.log = (...args) => {
                output += args.map(arg => typeof arg === 'string' ? arg : JSON.stringify(arg, null, 2)).join(' ') + '\n';
            }
            eval(input.code);
            console.log = oldLog;
            return { output };
        }
        return { error: `Execution for ${input.language} is not implemented.` };
      } catch (e: any) {
        return { error: e.message };
      }
    }
  );

const runCodeFlow = ai.defineFlow(
  {
    name: 'runCodeFlow',
    inputSchema: RunCodeInputSchema,
    outputSchema: RunCodeOutputSchema,
    tools: [runCodeTool]
  },
  async (input) => {
    const result = await runCodeTool(input);
    return result;
  }
);


export async function runCode(input: RunCodeInput): Promise<RunCodeOutput> {
    return await runCodeFlow(input);
}
