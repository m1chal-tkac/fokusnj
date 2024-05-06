import { useEffect, useRef, useState } from "react";

interface ButtonProps {
  type: "submit" | "button";
  onClick?: () => void;
  text: string;
}

export function FeedbackButton({ type, onClick, text }: ButtonProps) {
  const [feedback, setFeedback] = useState(false);
  const timeout = useRef<any>();

  return (
    <button
      type={type}
      className="border-2 border-blue-500 bg-blue-500 text-white p-2 w-full rounded-md flex justify-center items-center"
      onClick={async () => {
        if (onClick) await onClick();
        setFeedback(true);

        if (timeout.current) clearTimeout(timeout.current);
        timeout.current = setTimeout(() => {
          setFeedback(false);
        }, 2000);
      }}
    >
      {feedback ? (
        <img className="w-5 h-5 mr-2" src="/ikony/feedback.svg" alt="Úspěch" />
      ) : (
        <div className="w-5 h-5 mr-2" />
      )}
      {text}
      <div className="w-5 h-5 ml-2" />
    </button>
  );
}
