
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
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';


function Cursor() {
  return (
    <span className="animate-blink bg-primary w-0.5 h-5 sm:h-6 inline-block -mb-1 sm:-mb-1.5" />
  );
}

export default function TypingPractice({ code, language, chapterIndex }: { code: string, language: string, chapterIndex: number }) {
  const { state, characters, typed, errors, wpm, cpm, accuracy, totalTime, reset, saveProgress } = useTyping(code);
  const [showResults, setShowResults] = useState(false);
  const isFinished = state === "finish";

  useEffect(() => {
    if (isFinished) {
      setShowResults(true);
      const chapterTitle = codeSnippets[language].chapters[chapterIndex].title;
      saveProgress(wpm, cpm, accuracy, totalTime, language, chapterTitle);
    }
  }, [isFinished, saveProgress, wpm, cpm, accuracy, totalTime, language, chapterIndex]);
  
  const customStyle = {
    ...vscDarkPlus,
    'pre[class*="language-"]': {
      ...vscDarkPlus['pre[class*="language-"]'],
      backgroundColor: 'transparent',
      padding: 0,
      margin: 0,
    },
  };

  const renderer = ({ rows, stylesheet, useInlineStyles }: any) => {
    return rows.map((row: any, i: number) => {
      let rowIndex = 0;
      if (i > 0) {
        for (let j = 0; j < i; j++) {
          rowIndex += rows[j].children.length + 1; // +1 for newline
        }
      } else {
        rowIndex = 0;
      }

      return (
        <div key={`row-${i}`}>
          {row.children.map((item: any, j: number) => {
            const charIndex = rowIndex + j;
            const isTyped = charIndex < typed.length;
            const isCorrect = isTyped && typed[charIndex] === item.children[0].value;
            const isCurrent = charIndex === typed.length;

            return (
              <span
                key={`char-${i}-${j}`}
                className={cn(
                  item.properties.className,
                   !isTyped && "text-muted-foreground/50",
                   isTyped && !isCorrect && "text-red-500 bg-red-500/20",
                )}
                style={{color: isTyped && !isCorrect ? '' : item.properties.style.color}}
              >
                {isCurrent && <Cursor />}
                {item.children[0].value}
              </span>
            );
          })}
          {i < rows.length - 1 && <span>{typed.length === rowIndex + row.children.length && <Cursor />}
          <br/></span>}
        </div>
      );
    });
  };

  return (
    <div className="w-full max-w-4xl flex flex-col items-center gap-8">
      <Card className="w-full relative">
        <CardContent className="p-6 sm:p-8">
          <div className="font-code text-lg sm:text-xl leading-relaxed tracking-wider relative">
            <SyntaxHighlighter
              language={language === 'c' ? 'cpp' : language}
              style={customStyle}
              renderer={renderer}
              wrapLines={true}
              wrapLongLines={true}
            >
              {code}
            </SyntaxHighlighter>
            {typed.length === code.length && isFinished && <Cursor />}
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
