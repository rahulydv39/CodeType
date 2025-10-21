
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, XAxis, YAxis, CartesianGrid, BarChart as RechartsBarChart } from "recharts";
import { codeSnippets } from "@/lib/code-snippets";

type ProgressData = {
  date: string;
  wpm: number;
  cpm: number;
  accuracy: number;
  time: number;
  language: string;
  chapter: string;
};

export default function ProgressView() {
  const [progress, setProgress] = useState<ProgressData[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const storedProgress = JSON.parse(localStorage.getItem('typingProgress') || '[]');
      setProgress(storedProgress);
    }
  }, [isOpen]);

  const chartData = progress.map(p => ({
    name: `${codeSnippets[p.language]?.name.slice(0,3)} - ${p.chapter.slice(0,10)}...`,
    wpm: p.wpm,
  }));
  
  const chartConfig = {
    wpm: { label: "WPM", color: "hsl(var(--primary))" },
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <History className="mr-2" />
          View Progress
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Overall Progress</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          <div>
            <h3 className="font-headline text-lg mb-2">Recent Sessions</h3>
            <ScrollArea className="h-96">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Language</TableHead>
                    <TableHead>Chapter</TableHead>
                    <TableHead className="text-right">WPM</TableHead>
                    <TableHead className="text-right">CPM</TableHead>
                    <TableHead className="text-right">Accuracy</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {progress.length > 0 ? (
                    progress.slice().reverse().map((p, i) => (
                      <TableRow key={i}>
                        <TableCell>{codeSnippets[p.language]?.name || p.language}</TableCell>
                        <TableCell>{p.chapter}</TableCell>
                        <TableCell className="text-right">{Math.round(p.wpm)}</TableCell>
                        <TableCell className="text-right">{Math.round(p.cpm)}</TableCell>
                        <TableCell className="text-right">{p.accuracy.toFixed(1)}%</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">No progress yet. Complete a chapter to see your results!</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
          <div>
            <h3 className="font-headline text-lg mb-2">WPM Over Time</h3>
            {progress.length > 0 ? (
              <ChartContainer config={chartConfig} className="w-full h-96">
                  <RechartsBarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" dataKey="wpm" />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={100} interval={0} />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                      />
                      <Bar dataKey="wpm" fill="var(--color-wpm)" radius={4} />
                  </RechartsBarChart>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-96 bg-muted rounded-lg">
                <p className="text-muted-foreground">Chart will be displayed here.</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
