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
import fs from 'fs';
import path from 'path';
import os from 'os';


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
      console.log(`Executing ${input.language} code...`);
      
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
        });
      };

      const tempDir = os.tmpdir();
      const tempId = `code-${Date.now()}`;

      try {
        if (input.language === 'javascript') {
            const filePath = path.join(tempDir, `${tempId}.js`);
            fs.writeFileSync(filePath, input.code);
            return await execute('node', [filePath]);
        }
        if (input.language === 'python') {
            const filePath = path.join(tempDir, `${tempId}.py`);
            fs.writeFileSync(filePath, input.code);
            return await execute('python', [filePath]);
        }
        if (input.language === 'typescript') {
            const filePath = path.join(tempDir, `${tempId}.ts`);
            fs.writeFileSync(filePath, input.code);
            // ts-node is not installed, so this won't work out of the box.
            // Assuming it's available in the execution environment.
            // To make this work, one would need to `npm install -g ts-node`
            // or have it as a dev dependency.
            return await execute('ts-node', [filePath]);
        }
        if (input.language === 'c') {
            const sourcePath = path.join(tempDir, `${tempId}.c`);
            const exePath = path.join(tempDir, tempId);
            fs.writeFileSync(sourcePath, input.code);
            const compileResult = await execute('gcc', [sourcePath, '-o', exePath]);
            if (compileResult.error) {
                return { error: `Compilation failed: ${compileResult.error}`};
            }
            return await execute(exePath, []);
        }
        if (input.language === 'cpp') {
            const sourcePath = path.join(tempDir, `${tempId}.cpp`);
            const exePath = path.join(tempDir, tempId);
fs.writeFileSync(sourcePath, input.code);
            const compileResult = await execute('g++', [sourcePath, '-o', exePath]);
            if (compileResult.error) {
                return { error: `Compilation failed: ${compileResult.error}`};
            }
            return await execute(exePath, []);
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
