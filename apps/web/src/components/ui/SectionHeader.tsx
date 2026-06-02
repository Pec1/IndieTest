import { cn } from '../../lib/utils';

interface SectionHeaderProps {
  title: string;
  icon: React.ElementType;
  iconColor?: string;
  className?: string;
}

export function SectionHeader({ title, icon: Icon, iconColor = 'text-[#4A3AFF]', className }: SectionHeaderProps) {
  return (
    <div className={cn('flex items-center border-b border-it-border pb-2 mb-6 mt-10 first:mt-0', className)}>
      <h2 className="text-xl font-display font-black tracking-tight text-it-text uppercase flex items-center gap-2">
        <Icon className={cn(iconColor)} size={20} strokeWidth={2} /> {title}
      </h2>
    </div>
  );
}
