interface ButtonProps {
  type: "submit" | "button";
  onClick?: () => void;
  text: string;
}

export function OutlineButton({ type, onClick, text }: ButtonProps) {
  return (
    <button
      type={type}
      className="border-2 border-blue-500 text-blue-500 p-2 w-full rounded-md"
      onClick={onClick}
    >
      {text}
    </button>
  );
}
