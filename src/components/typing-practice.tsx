"use client";

import { useTyping } from "@/lib/hooks/use-typing";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import TypingResults from "./typing-results";
import CodeOutput from "./code-output";
import React, { useEffect, useState } from "react";

type CharacterProps = {
  char: string;
  state: "correct" | "incorrect" | "untyped";
};

function Character({ char, state }: CharacterProps) {
  if (char === "\n") {
    return <br />;
  }
  return (
    <span
      className={cn({
        "text-foreground": state === "correct",
        "text-red-500": state === "incorrect",
        "text-muted-foreground": state === "untyped",
      })}
    >
      {char}
    </span>
  );
}

function Cursor() {
  return (
    <span className="animate-blink bg-primary w-[2px] h-5 sm:h-6 inline-block -mb-1 sm:-mb-1.5" />
  );
}

export default function TypingPractice({ code, language }: { code: string, language: string }) {
  const { state, characters, typed, errors, wpm, accuracy, totalTime, reset } = useTyping(code);
  const [showResults, setShowResults] = useState(false);
  const isFinished = state === "finish";

  useEffect(() => {
    if (isFinished) {
      setShowResults(true);
    }
  }, [isFinished]);

  return (
    <div className="w-full max-w-4xl flex flex-col items-center gap-8">
      <Card className="w-full relative">
        <CardContent className="p-6 sm:p-8">
          <div className="font-code text-lg sm:text-xl leading-relaxed tracking-wider relative">
            <p className="whitespace-pre-wrap" aria-label={code}>
              {characters.map((char, index) => (
                <React.Fragment key={index}>
                  {typed.length === index && <Cursor />}
                  <Character char={char.char} state={char.state} />
                </React.Fragment>
              ))}
              {typed.length === code.length && isFinished && <Cursor />}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="grid grid-cols-3 gap-4 text-center w-full sm:w-auto">
          <div className="p-3 bg-card rounded-lg">
            <p className="text-sm text-muted-foreground">WPM</p>
            <p className="text-2xl font-bold font-headline text-primary">
              {Math.round(wpm)}
            </p>
          </div>
          <div className="p-3 bg-card rounded-lg">
            <p className="text-sm text-muted-foreground">Accuracy</p>
            <p className="text-2xl font-bold font-headline">
              {accuracy.toFixed(0)}%
            </p>
          </div>
          <div className="p-3 bg-card rounded-lg">
            <p className="text-sm text-muted-foreground">Errors</p>
            <p className="text-2xl font-bold font-headline text-destructive">{errors}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {isFinished && (
            <>
              <TypingResults open={showResults} onOpenChange={setShowResults} wpm={wpm} accuracy={accuracy} errors={errors} time={totalTime} />
              {language !== 'typing' && <CodeOutput code={code} language={language} />}
            </>
          )}
          <Button onClick={reset} variant="outline" size="icon" aria-label="Restart Practice">
            <RefreshCw />
          </Button>
        </div>
      </div>
    </div>
  );
}
