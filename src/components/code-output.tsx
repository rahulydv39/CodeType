"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { runCode } from "@/ai/flows/run-code-flow";

type CodeOutputProps = {
  code: string;
  language: string;
};

export default function CodeOutput({ code, language }: CodeOutputProps) {
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleExecute = async () => {
    setIsLoading(true);
    setError(null);
    setOutput(null);
    setIsOpen(true);
    try {
      const result = await runCode({ code, language });
      setOutput(result.output);
      setError(result.error);
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={handleExecute}>
          <Play className="mr-2" />
          Execute Code
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Code Output</DialogTitle>
        </DialogHeader>
        <div className="mt-4 bg-muted rounded-lg p-4 font-code text-sm max-h-[60vh] overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-24">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <pre className="whitespace-pre-wrap">
              {error && <code className="text-red-500">{error}</code>}
              {output && <code>{output}</code>}
              {!error && !output && <code>No output.</code>}
            </pre>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
