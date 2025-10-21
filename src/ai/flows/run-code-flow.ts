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
import { spawn } from 'child_process';


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
      console.log(`Executing ${input.language} code:`, input.code);
      
      const execute = (command: string, args: string[]): Promise<{ output: string, error?: string }> => {
        return new Promise((resolve) => {
          const process = spawn(command, args);
          let output = '';
          let error = '';

          process.stdout.on('data', (data) => {
            output += data.toString();
          });

          process.stderr.on('data', (data) => {
            error += data.toString();
          });
          
          process.on('close', (code) => {
            if (code !== 0) {
              resolve({ output, error: error || `Process exited with code ${code}` });
            } else {
              resolve({ output, error: error || undefined });
            }
          });

          process.on('error', (err) => {
            resolve({ output: '', error: err.message });
          });

          if (command === 'node' || command === 'python') {
            process.stdin.write(input.code);
            process.stdin.end();
          }
        });
      };

      try {
        if (input.language === 'javascript') {
            return await execute('node', ['-e', input.code]);
        }
        if (input.language === 'python') {
            return await execute('python', ['-c', input.code]);
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
    // This is a simple implementation. In a real world scenario you might want to ask an LLM to execute the code.
    const result = await runCodeTool(input);
    return result;
  }
);


export async function runCode(input: RunCodeInput): Promise<RunCodeOutput> {
    return await runCodeFlow(input);
}
