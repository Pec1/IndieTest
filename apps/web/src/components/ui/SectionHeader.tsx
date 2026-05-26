import { cn } from '../../lib/utils';
import { TechnicalLabel } from './TechnicalLabel';

interface SectionHeaderProps {
  title: string;
  code: string;
  icon: React.ElementType;
  iconColor?: string;
  className?: string;
}

/**
 * Cabeçalho de seção dentro de formulários e painéis internos.
 * Exibe título com ícone e uma TechnicalLabel de referência de requisito.
 *
 * @example
 * <SectionHeader title="DADOS DO SOFTWARE" code="RF03" icon={Terminal} />
 * <SectionHeader title="AMBIENTE" code="RF_TEST" icon={Monitor} iconColor="text-[#D4FF00]" />
 */
export function SectionHeader({ title, code, icon: Icon, iconColor = 'text-[#4A3AFF]', className }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between border-b border-[#2C2D35] pb-2 mb-6 mt-10 first:mt-0", className)}>
      <h2 className="text-xl font-display font-black tracking-tight text-white uppercase flex items-center gap-2">
        <Icon className={cn(iconColor)} size={20} strokeWidth={2} /> {title}
      </h2>
      <TechnicalLabel className="text-[#4A3AFF] bg-[#4A3AFF]/10 border-[#4A3AFF]/30">{code}</TechnicalLabel>
    </div>
  );
}
