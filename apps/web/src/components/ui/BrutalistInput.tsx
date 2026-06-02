import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../lib/utils';

interface BrutalistInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

/**
 * Input com estética brutalist: borda fina, foco amarelo, toggle de senha.
 *
 * @example
 * <BrutalistInput type="email" icon={<Mail size={18} />} placeholder="email" />
 * <BrutalistInput type="password" icon={<Lock size={18} />} />
 */
export function BrutalistInput({ className, icon, type, ...props }: BrutalistInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="relative group">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-it-muted group-focus-within:text-it-accent-fg transition-colors z-10">
          {icon}
        </div>
      )}
      <input
        type={inputType}
        className={cn(
          'w-full bg-it-input border border-it-border text-it-text rounded-none py-3 px-4 font-mono text-sm outline-none transition-all duration-200 placeholder:text-it-muted focus:border-it-accent-border focus:bg-it-surface',
          icon && 'pl-11',
          isPassword && 'pr-11',
          className,
        )}
        {...props}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-0 top-0 h-full px-3 text-it-muted hover:text-it-accent-fg hover:bg-it-border/30 transition-colors focus:outline-none z-10 border-l border-transparent group-focus-within:border-it-border"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
}
