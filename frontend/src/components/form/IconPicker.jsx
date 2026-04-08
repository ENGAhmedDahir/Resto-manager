import { cn } from "@/lib/utils";

export function IconPicker({ icons, value, onChange }) {
  return (
    <div className="grid grid-cols-10 gap-2">
      {icons.map((icon) => {
        const active = value === icon;
        return (
          <button
            key={icon}
            type="button"
            onClick={() => onChange(active ? null : icon)}
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-md border-2 text-xl transition hover:scale-105 hover:bg-muted",
              active
                ? "border-[hsl(var(--primary))] ring-2 ring-[hsl(var(--primary)/.3)] scale-105"
                : "border-[hsl(var(--border))]"
            )}
          >
            {icon}
          </button>
        );
      })}
    </div>
  );
}
