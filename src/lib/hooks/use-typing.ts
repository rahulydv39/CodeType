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

  const wpm = useMemo(() => {
    if (state !== 'run' || !startTime.current) return 0;
    const currentTime = Date.now();
    const elapsedTime = (currentTime - startTime.current) / 1000 / 60; // in minutes
    if (elapsedTime === 0) return 0;
    const grossWPM = (typed.length / 5) / elapsedTime;
    return grossWPM > 0 ? grossWPM : 0;
  }, [typed, state]);

  const accuracy = useMemo(() => {
    if (typed.length === 0) return 100;
    return ((typed.length - errors) / typed.length) * 100;
  }, [typed, errors]);

  const reset = useCallback(() => {
    setState('start');
    setTyped('');
    setErrors(0);
    startTime.current = 0;
    setTotalTime(0);
  }, []);

  useEffect(() => {
    if (isFinished) {
      setState('finish');
      if (startTime.current) {
         setTotalTime((Date.now() - startTime.current) / 1000);
      }
    }
  }, [isFinished]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (state === 'finish') {
        if (e.key === 'Enter') reset();
        return;
      }
      
      if (e.key === 'Escape') {
          reset();
          return;
      }

      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (state === 'start') {
          setState('run');
          startTime.current = Date.now();
        }
        
        if (text[currentPosition] !== e.key) {
          setErrors(prev => prev + 1);
        }
        setTyped(prev => prev + e.key);
      } else if (e.key === 'Backspace') {
        if (typed.length > 0) {
           setTyped(prev => prev.slice(0, -1));
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


  return { state, characters, typed, errors, wpm, accuracy, totalTime, reset };
};
