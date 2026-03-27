import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface SectionHeaderProps {
  title: string;
  id?: string;
  className?: string;
  children?: ReactNode;
}

export function SectionHeader({ title, id, className, children }: SectionHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-5', className)}>
      <h2 id={id} className="text-xl md:text-2xl font-bold text-screen-100 flex items-center gap-3">
        <span className="w-1 h-6 bg-reel-500 rounded-full inline-block" aria-hidden />
        {title}
      </h2>
      {children}
    </div>
  );
}
