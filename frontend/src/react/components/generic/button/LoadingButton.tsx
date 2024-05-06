interface ButtonProps {
  type: "submit" | "button";
  onClick?: () => void;
  text: string;
  loading: boolean;
}

export function LoadingButton({ type, onClick, text, loading }: ButtonProps) {
  return (
    <button
      type={type}
      className="border-2 border-blue-500 bg-blue-500 text-white p-2 w-full rounded-md flex justify-center items-center"
      onClick={onClick}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 rounded-full border-blue-400 border-t-white animate-spin mr-2" />
      ) : (
        <div className="w-4 h-4 mr-2" />
      )}
      {text}
      <div className="w-4 h-4 ml-2" />
    </button>
  );
}
