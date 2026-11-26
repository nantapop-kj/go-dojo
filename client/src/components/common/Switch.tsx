import type { ChangeEvent, JSX } from 'react';
import '@/components/common/Switch.css';

interface SwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const Switch = ({ label, checked, onChange }: SwitchProps): JSX.Element => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange(event.target.checked);
  };

  return (
    <label className="switch-row">
      <span>{label}</span>
      <span className="switch">
        <input type="checkbox" checked={checked} onChange={handleChange} />
        <span className="track" />
        <span className="knob" />
      </span>
    </label>
  );
};
