interface FilterRowProps {
    label: string;
    children: React.ReactNode;
}

export function FilterRow({ label, children }: FilterRowProps) {
    return (
        <div className="flex items-start gap-3">
            <span className="text-cinema-500 text-xs font-medium w-14 shrink-0 pt-1.5 uppercase tracking-wide">
                {label}
            </span>
            <div className="flex flex-wrap gap-1.5">{children}</div>
        </div>
    );
}
