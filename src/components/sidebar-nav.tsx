"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { codeSnippets } from "@/lib/code-snippets";
import { CppIcon, HtmlIcon, JavaScriptIcon, PythonIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Keyboard, Lock, Type } from "lucide-react";

type SidebarNavProps = {
  selectedLanguage: string;
  selectedChapterIndex: number;
  onSelectChapter: (language: string, chapterIndex: number) => void;
};

const languageIcons: Record<string, React.ReactNode> = {
  typing: <Keyboard className="size-5" />,
  python: <PythonIcon className="size-5" />,
  cpp: <CppIcon className="size-5" />,
  html: <HtmlIcon className="size-5" />,
  javascript: <JavaScriptIcon className="size-5" />,
  typescript: <Type className="size-5" />,
  c: <span className="font-bold text-lg w-5 text-center">C</span>,
};

export default function SidebarNav({
  selectedLanguage,
  selectedChapterIndex,
  onSelectChapter,
}: SidebarNavProps) {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full px-2"
      defaultValue={`item-${selectedLanguage}`}
    >
      {Object.entries(codeSnippets).map(([langKey, langData]) => (
        <AccordionItem key={langKey} value={`item-${langKey}`}>
          <AccordionTrigger
            className="hover:no-underline"
            onClick={() => {
              if (selectedLanguage !== langKey) {
                onSelectChapter(langKey, 0);
              }
            }}
          >
            <div className="flex items-center gap-3">
              {languageIcons[langKey]}
              <span className="font-headline text-base">{langData.name}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-1">
              {langData.chapters.map((chapter, index) => (
                <li key={chapter.title}>
                  <button
                    onClick={() => onSelectChapter(langKey, index)}
                    disabled={!chapter.code}
                    className={cn(
                      "w-full text-left px-3 py-1.5 text-sm rounded-md flex items-center justify-between gap-2",
                      "transition-colors duration-150",
                      selectedLanguage === langKey && selectedChapterIndex === index
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                      !chapter.code && "text-muted-foreground cursor-not-allowed opacity-50"
                    )}
                  >
                    <span>{chapter.title}</span>
                    {!chapter.code && <Lock className="size-3" />}
                  </button>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
