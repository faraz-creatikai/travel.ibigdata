interface PageHeaderProps {
    title: string;
    subtitles?: string[];
}

export default function PageHeader({ title, subtitles = [] }: PageHeaderProps) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-1 h-7 rounded-full bg-[var(--color-primary)]" />
            <h1 className="text-xl font-semibold text-slate-800 tracking-tight">
                {title}
                {subtitles.map((sub, index) => (
                    <span key={sub + index} className="text-[var(--color-primary)]/60 font-normal text-sm ml-2">
                        / {sub}
                    </span>
                ))}
            </h1>
        </div>
    );
}