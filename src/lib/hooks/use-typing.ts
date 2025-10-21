
"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';

type State = 'start' | 'run' | 'finish';
type CharState = 'correct' | 'incorrect' | 'untyped';

export const useTyping = (text: string) => {
  const [state, setState] = useState<State>('start');
  const [typed, setTyped] = useState<string>('');
  const [errors, setErrors] = useState<number>(0);

  const startTime = useRef<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);

  const characters = useMemo(
    () =>
      text.split('').map((char, index) => {
        let state: CharState = 'untyped';
        if (index < typed.length) {
          state = typed[index] === char ? 'correct' : 'incorrect';
        }
        return { char, state };
      }),
    [text, typed]
  );

  const currentPosition = typed.length;
  const isFinished = currentPosition === text.length;

  const { wpm, cpm } = useMemo(() => {
    if (state !== 'run' || !startTime.current) return { wpm: 0, cpm: 0 };
    const currentTime = Date.now();
    const elapsedTime = (currentTime - startTime.current) / 1000 / 60; // in minutes
    if (elapsedTime === 0) return { wpm: 0, cpm: 0 };
    
    const correctChars = typed.split('').filter((char, index) => char === text[index]).length;
    const grossWPM = (correctChars / 5) / elapsedTime;
    const grossCPM = correctChars / elapsedTime;

    return { 
      wpm: grossWPM > 0 ? grossWPM : 0,
      cpm: grossCPM > 0 ? grossCPM : 0
    };
  }, [typed, text, state]);


  const accuracy = useMemo(() => {
    if (typed.length === 0) return 100;
    const correctChars = typed.split('').filter((char, index) => char === text[index]).length;
    return (correctChars / typed.length) * 100;
  }, [typed, text]);

  const reset = useCallback(() => {
    setState('start');
    setTyped('');
    setErrors(0);
    startTime.current = 0;
    setTotalTime(0);
  }, []);

  const saveProgress = useCallback((wpm: number, cpm: number, accuracy: number, time: number, language: string, chapterTitle: string) => {
    const progress = JSON.parse(localStorage.getItem('typingProgress') || '[]');
    progress.push({
      date: new Date().toISOString(),
      wpm,
      cpm,
      accuracy,
      time,
      language,
      chapter: chapterTitle
    });
    localStorage.setItem('typingProgress', JSON.stringify(progress));
  }, []);
  
  const finalWPM = useMemo(() => {
    if (!isFinished || !totalTime) return 0;
    const durationInMinutes = totalTime / 60;
    const correctChars = typed.split('').filter((char, index) => char === text[index]).length;
    const finalWPMValue = (correctChars / 5) / durationInMinutes;
    return finalWPMValue > 0 ? finalWPMValue : 0;
}, [isFinished, totalTime, typed, text]);

const finalCPM = useMemo(() => {
    if (!isFinished || !totalTime) return 0;
    const durationInMinutes = totalTime / 60;
    const correctChars = typed.split('').filter((char, index) => char === text[index]).length;
    const finalCPMValue = correctChars / durationInMinutes;
    return finalCPMValue > 0 ? finalCPMValue : 0;
}, [isFinished, totalTime, typed, text]);


  useEffect(() => {
    if (isFinished) {
      setState('finish');
      if (startTime.current) {
         const endTime = Date.now();
         const duration = (endTime - startTime.current) / 1000;
         setTotalTime(duration);
      }
    }
  }, [isFinished]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      
      if (state === 'finish') {
        if (e.key === 'Enter') reset();
        return;
      }
      
      const isSpecialKey = e.ctrlKey || e.metaKey || e.altKey;

      if (e.key === 'Escape') {
          e.preventDefault();
          reset();
          return;
      }

      if (state === 'start' && e.key.length === 1 && !isSpecialKey) {
        setState('run');
        startTime.current = Date.now();
      }
      
      if (state === 'run') {
        e.preventDefault();
        
        if (e.key === 'Tab') {
          const spaces = '   ';
          let correct = true;
          for (let i = 0; i < spaces.length; i++) {
              if (currentPosition + i >= text.length || text[currentPosition + i] !== ' ') {
                  correct = false;
                  break;
              }
          }
          if(!correct) setErrors(prev => prev + spaces.length);
          setTyped(prev => prev + spaces);
          return;
        }

        if (e.key === 'Enter') {
          if (text[currentPosition] === '\n') {
            setTyped(prev => prev + '\n');
          } else {
            setErrors(prev => prev + 1);
            setTyped(prev => prev + '\n');
          }
          return;
        }

        if (e.key.length === 1 && !isSpecialKey) {
          if (typed.length < text.length) {
            if (text[currentPosition] !== e.key) {
              setErrors(prev => prev + 1);
            }
            setTyped(prev => prev + e.key);
          }
        } else if (e.key === 'Backspace') {
          if (typed.length > 0) {
            setTyped(prev => prev.slice(0, -1));
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [text, typed, state, reset, currentPosition]);

  useEffect(() => {
    reset();
  }, [text, reset]);


  return { state, characters, typed, errors, wpm: state === 'finish' ? finalWPM : wpm, cpm: state === 'finish' ? finalCPM : cpm, accuracy, totalTime, reset, saveProgress };
};
