interface ToggleButtonProps {
  checked: boolean;
  onToggle: (checked: boolean) => void;
  label?: string; // For screen readers (accessibility)
  disabled?: boolean;
}

export default function ToggleButton({
  checked,
  onToggle,
  label = "Toggle setting",
  disabled = false,
}: ToggleButtonProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onToggle(!checked)}
      disabled={disabled}
      className={`
        relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
        transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2  focus:ring-offset-2
        ${checked ? "bg-purple-600 focus:ring-purple-500" : "bg-gray-200 focus:ring-gray-500"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <span className="sr-only">{label}</span>
      <span
        aria-hidden="true"
        className={`
          pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
          transition duration-200 ease-in-out
          ${checked ? "translate-x-5" : "translate-x-0"}
        `}
      />
    </button>
  );
}
