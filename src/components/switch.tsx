/** A labelled on/off switch backed by a real checkbox, so it works in plain forms. */
export function Switch({ name, defaultChecked, checked, onChange, children, className = "" }: {
  name: string;
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (on: boolean) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`swl ${className}`}>
      <input type="checkbox" role="switch" name={name} className="sr"
        {...(checked === undefined ? { defaultChecked } : { checked, onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e.target.checked) })} />
      <span className="sw" aria-hidden="true" />{children}
    </label>
  );
}
