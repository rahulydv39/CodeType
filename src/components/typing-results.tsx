"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BarChart } from "lucide-react";

type TypingResultsProps = {
  wpm: number;
  accuracy: number;
  errors: number;
  time: number;
};

export default function TypingResults({ wpm, accuracy, errors, time }: TypingResultsProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <BarChart className="mr-2" />
          Detailed Analysis
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Typing Results</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
            <span className="text-muted-foreground">Words Per Minute (WPM)</span>
            <span className="text-xl font-bold font-headline text-primary">{Math.round(wpm)}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
            <span className="text-muted-foreground">Accuracy</span>
            <span className="text-xl font-bold font-headline">{accuracy.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
            <span className="text-muted-foreground">Errors</span>
            <span className="text-xl font-bold font-headline text-destructive">{errors}</span>
          </div>
           <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
            <span className="text-muted-foreground">Time Taken</span>
            <span className="text-xl font-bold font-headline">{time.toFixed(1)}s</span>
          </div>
        </div>
        <DialogFooter>
          <p className="text-sm text-muted-foreground">Great job! Keep practicing to improve your speed and accuracy.</p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
