import { Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function CheckboxField({ className, disabled, control, name, label }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex items-center gap-3">
          <Checkbox
            disabled={disabled}
            checked={field.value}
            onCheckedChange={(val) => field.onChange(Boolean(val))}
            className={`scale-125 ${className}`} // 👈 BIGGER
          />
          <Label className="cursor-pointer font-light text-sidebar-foreground text-lg">
            {label}
          </Label>
        </div>
      )}
    />
  );
}
