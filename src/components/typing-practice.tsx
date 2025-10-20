"use client";

import { useTyping } from "@/lib/hooks/use-typing";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import TypingResults from "./typing-results";

type CharacterProps = {
  char: string;
  state: "correct" | "incorrect" | "untyped";
};

function Character({ char, state }: CharacterProps) {
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
    <span className="animate-pulse text-primary font-bold text-lg -ml-[0.2em] -mr-[0.2em]">|</span>
  );
}

export default function TypingPractice({ code }: { code: string }) {
  const { state, characters, typed, errors, wpm, accuracy, totalTime, reset } = useTyping(code);

  const isFinished = state === "finish";

  return (
    <div className="w-full max-w-4xl flex flex-col items-center gap-8">
      <Card className="w-full relative">
        <CardContent className="p-6 sm:p-8">
          <div className="font-code text-lg sm:text-xl leading-relaxed tracking-wider relative">
            <p className="whitespace-pre-wrap" aria-label={code}>
              {characters.map((char, index) => (
                <Character key={index} char={char.char} state={char.state} />
              ))}
              {state !== "finish" && <Cursor />}
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
             <TypingResults wpm={wpm} accuracy={accuracy} errors={errors} time={totalTime} />
          )}
          <Button onClick={reset} variant="outline" size="icon" aria-label="Restart Practice">
            <RefreshCw />
          </Button>
        </div>
      </div>
    </div>
  );
}
