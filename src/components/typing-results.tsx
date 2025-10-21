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
import { BarChart2 } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, XAxis, YAxis, CartesianGrid, BarChart as RechartsBarChart } from "recharts";

type TypingResultsProps = {
  wpm: number;
  cpm: number;
  accuracy: number;
  errors: number;
  time: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function TypingResults({ wpm, cpm, accuracy, errors, time, open, onOpenChange }: TypingResultsProps) {
  const chartData = [
    { name: "WPM", value: Math.round(wpm), fill: "hsl(var(--primary))" },
    { name: "CPM", value: Math.round(cpm), fill: "hsl(var(--primary))" },
    { name: "Accuracy", value: Math.round(accuracy), fill: "hsl(var(--accent))" },
    { name: "Errors", value: errors, fill: "hsl(var(--destructive))" },
  ];

  const chartConfig = {
    value: {
      label: "Value",
    },
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <BarChart2 className="mr-2" />
          Detailed Analysis
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Typing Results</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
            <span className="text-muted-foreground">Words Per Minute (WPM)</span>
            <span className="text-xl font-bold font-headline text-primary">{Math.round(wpm)}</span>
          </div>
           <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
            <span className="text-muted-foreground">Chars Per Minute (CPM)</span>
            <span className="text-xl font-bold font-headline text-primary">{Math.round(cpm)}</span>
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
          <div className="mt-4">
            <ChartContainer config={chartConfig} className="w-full h-[200px]">
              <RechartsBarChart data={chartData} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="value" radius={5} />
              </RechartsBarChart>
            </ChartContainer>
          </div>
        </div>
        <DialogFooter>
          <p className="text-sm text-muted-foreground">Great job! Keep practicing to improve your speed and accuracy.</p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
