"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

type HeroHeadingProps = {
  text: string;
  className?: string;
};

export const HeroHeading = ({ text, className }: HeroHeadingProps) => {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);

  const animationStarted = useRef(false);
  const animationFinished = useRef(false);

  useEffect(() => {
    let interval: number | null = null;
    const timer = window.setTimeout(() => {
      if (animationStarted.current) return;
      animationStarted.current = true;

      setIsAnimating(true);
      setDisplayText("");
      let index = 0;

      interval = window.setInterval(() => {
        index += 1;
        setDisplayText(text.slice(0, index));

        if (index >= text.length) {
          if (interval) window.clearInterval(interval);
          animationFinished.current = true;
          setIsAnimating(false);
        }
      }, 35);
    }, 80);

    return () => {
      window.clearTimeout(timer);
      if (interval) window.clearInterval(interval);

      if (!animationFinished.current) {
        setIsAnimating(false);
        setDisplayText(text);
      }
    };
  }, [text]);

  return (
    <h1
      className={cn("home-heading", className)}
      aria-label={text}
      suppressHydrationWarning
    >
      {displayText}
      {isAnimating && (
        <span className="hero-heading-caret" aria-hidden="true" />
      )}
    </h1>
  );
};
