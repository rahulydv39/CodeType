"use client";

import { useState } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarInset,
  SidebarTrigger,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { codeSnippets } from "@/lib/code-snippets";
import SidebarNav from "./sidebar-nav";
import TypingPractice from "./typing-practice";
import { Code, Bot } from "lucide-react";

export default function MainLayout() {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);

  const handleSelectChapter = (language: string, chapterIndex: number) => {
    setSelectedLanguage(language);
    setSelectedChapterIndex(chapterIndex);
  };

  const currentSnippet =
    codeSnippets[selectedLanguage]?.chapters[selectedChapterIndex];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Bot className="size-8 text-primary" />
            <h1 className="text-xl font-headline font-semibold">CodeType</h1>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-0">
          <SidebarNav
            selectedLanguage={selectedLanguage}
            selectedChapterIndex={selectedChapterIndex}
            onSelectChapter={handleSelectChapter}
          />
        </SidebarContent>
        <SidebarFooter>
          <p className="text-xs text-muted-foreground">
            Press <kbd className="px-1.5 py-0.5 border rounded bg-muted">Ctrl+B</kbd> to toggle sidebar
          </p>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <header className="flex items-center justify-between p-4 border-b">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <Code className="size-5" />
            <h2 className="text-lg font-headline font-medium">
              {currentSnippet?.title || "Typing Practice"}
            </h2>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 flex items-center justify-center">
            {currentSnippet ? (
              <TypingPractice 
                key={`${selectedLanguage}-${selectedChapterIndex}`}
                code={currentSnippet.code} 
              />
            ) : (
              <p>Select a chapter to begin.</p>
            )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
