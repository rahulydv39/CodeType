
"use client";

import { useTyping } from "@/lib/hooks/use-typing";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import TypingResults from "./typing-results";
import CodeOutput from "./code-output";
import React, { useEffect, useState } from "react";
import { codeSnippets } from "@/lib/code-snippets";

function Character({ char, state }: { char: string; state: string }) {
  const isCorrect = state === 'correct';
  const isIncorrect = state === 'incorrect';
  const isUntyped = state === 'untyped';
  
  return (
    <span
      className={cn({
        "text-foreground": isCorrect,
        "text-red-500 bg-red-500/20": isIncorrect,
        "text-muted-foreground/50": isUntyped,
      })}
    >
      {char}
    </span>
  );
}

function Cursor() {
  return (
    <span className="animate-blink bg-primary w-0.5 h-5 sm:h-6 inline-block -mb-1 sm:-mb-1.5" />
  );
}

export default function TypingPractice({ code, language, chapterIndex }: { code: string, language: string, chapterIndex: number }) {
  const { state, characters, typed, errors, wpm, cpm, accuracy, totalTime, reset, saveProgress } = useTyping(code, language);
  const [showResults, setShowResults] = useState(false);
  const isFinished = state === "finish";

  useEffect(() => {
    if (isFinished) {
      setShowResults(true);
      const chapterTitle = codeSnippets[language]?.chapters[chapterIndex].title;
      if (chapterTitle) {
        saveProgress(wpm, cpm, accuracy, totalTime, language, chapterTitle);
      }
    } else {
      setShowResults(false);
    }
  }, [isFinished, saveProgress, wpm, cpm, accuracy, totalTime, language, chapterIndex]);
  

  return (
    <div className="w-full max-w-4xl flex flex-col items-center gap-8">
      <Card className="w-full relative shadow-md shadow-primary/20">
        <CardContent className="p-6 sm:p-8">
          <div className="font-code text-lg sm:text-xl leading-relaxed tracking-wider relative">
            <pre className="whitespace-pre-wrap">
              {characters.map((char, index) => (
                <React.Fragment key={index}>
                  {index === typed.length && <Cursor />}
                  <Character char={char.char} state={char.state} />
                </React.Fragment>
              ))}
              {typed.length === code.length && isFinished && <Cursor />}
            </pre>
          </div>
        </CardContent>
      </Card>

      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="grid grid-cols-4 gap-4 text-center w-full sm:w-auto">
          <div className="p-3 bg-card rounded-lg">
            <p className="text-sm text-muted-foreground">WPM</p>
            <p className="text-2xl font-bold font-headline text-primary">
              {Math.round(wpm)}
            </p>
          </div>
           <div className="p-3 bg-card rounded-lg">
            <p className="text-sm text-muted-foreground">CPM</p>
            <p className="text-2xl font-bold font-headline text-primary">
              {Math.round(cpm)}
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
              <TypingResults open={showResults} onOpenChange={setShowResults} wpm={wpm} cpm={cpm} accuracy={accuracy} errors={errors} time={totalTime} />
              {language !== 'typing' && <CodeOutput code={code} language={language} />}
            </>
          )}
          <Button onClick={() => {
              reset();
              setShowResults(false);
            }} variant="outline" size="icon" aria-label="Restart Practice">
            <RefreshCw />
          </Button>
        </div>
      </div>
    </div>
  );
}
