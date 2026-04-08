import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";

export function TextAreaField({
  control,
  disabled,
  name,
  label,
  placeholder,
  width = "400px", // customizable
  rows = 4, // number of rows
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex items-center gap-12">
          <Label className="min-w-[90px] text-sm font-medium">{label}</Label>

          <textarea
            {...field}
            disabled={disabled}
            placeholder={placeholder}
            rows={rows}
            style={{ width }}
            className="rounded-sm border border-border bg-card text-card-foreground p-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      )}
    />
  );
}
