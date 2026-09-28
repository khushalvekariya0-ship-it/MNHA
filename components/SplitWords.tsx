import { Fragment } from "react";

export default function SplitWords({
  text,
  accent = [],
  trigger = "view",
  baseDelay = 0,
  className = "text-gradient",
  accentClassName = "text-gradient-green",
  accentClassNames,
}: {
  text: string;
  accent?: string[];
  trigger?: "view" | "load";
  baseDelay?: number;
  className?: string;
  accentClassName?: string;
  /** one class per accent word, in order; overrides accentClassName */
  accentClassNames?: string[];
}) {
  const words = text.split(" ");
  const accents = accent.map((word) => word.toLowerCase());
  let accentIndex = 0;

  return (
    <span className={trigger === "load" ? "split-load" : undefined}>
      {words.map((word, i) => {
        const isAccent = accents.includes(
          word.toLowerCase().replace(/[^a-z0-9]/g, "")
        );
        const accentClass = accentClassNames?.length
          ? accentClassNames[accentIndex % accentClassNames.length]
          : accentClassName;
        if (isAccent) accentIndex++;
        return (
          <Fragment key={i}>
            <span className="word-mask">
              <span
                className={isAccent ? accentClass : className}
                style={
                  { "--i": i, "--base": `${baseDelay}ms` } as React.CSSProperties
                }
              >
                {word}
              </span>
            </span>
            {i < words.length - 1 ? " " : null}
          </Fragment>
        );
      })}
    </span>
  );
}
