const TextareaField: React.FC<{
  className?: string;
  label: string;
  name: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}> = ({ className, label, name, value, onChange, error }) => (
  <div className={`relative w-full ${className ?? ""}`}>

    {/* Label above — matching SingleSelect/ObjectSelect style */}
    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 max-sm:dark:text-slate-500 mb-1.5 ml-0.5 select-none">
      {label}
    </p>

    {/* Textarea wrapper */}
    <div className={`
      relative
      border-l-4 rounded-lg
      transition-all duration-200
      ${error
        ? "border-l-red-400 bg-red-50 max-sm:dark:bg-red-900/10"
        : value
          ? "border-l-[var(--color-primary)] bg-[var(--color-primary-lighter)] max-sm:dark:bg-[var(--color-primary)]/10"
          : "border-l-slate-200 max-sm:dark:border-l-slate-700 bg-slate-50 max-sm:dark:bg-[var(--color-childbgdark)]"
      }
      focus-within:border-l-[var(--color-primary)]
      focus-within:bg-[var(--color-primary-lighter)] max-sm:dark:focus-within:bg-[var(--color-primary)]/10
      focus-within:shadow-md focus-within:shadow-[var(--color-primary)]/10
    `}>
      {/* Dot indicator */}
      {value && !error && (
        <span className="absolute top-3.5 left-3 w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] shrink-0 pointer-events-none" />
      )}

      <textarea
        name={name}
        value={value ?? ""}
        onChange={onChange}
        placeholder={`Enter ${label}…`}
        className={`
          w-full min-h-[100px] bg-transparent outline-none resize-y
          text-[13px] placeholder:text-slate-400 max-sm:dark:placeholder:text-slate-600
          text-slate-800 max-sm:dark:text-slate-200
          py-3 pr-4 rounded-lg
          transition-all duration-200
          custom-scrollbar
          ${value && !error ? "pl-7 font-semibold" : "pl-4"}
        `}
      />
    </div>

    {error && (
      <p className="text-red-500 text-[11px] mt-1.5 ml-0.5 flex items-center gap-1">
        <span className="w-1 h-1 rounded-full bg-red-500 inline-block" />
        {error}
      </p>
    )}
  </div>
);

export default TextareaField;