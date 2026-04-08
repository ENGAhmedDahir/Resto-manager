import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function TextField({
  control,
  disabled,
  type = "text",
  name,
  label,
  placeholder,
  width = "400px", // 👈 customizable
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex items-center gap-19">
          <Label className="min-w-[90px] text-sm font-medium">{label}</Label>

          <Input
            {...field}
            type={type}
            disabled={disabled}
            placeholder={placeholder}
            style={{ width }} // 👈 fixed width
            className="rounded-sm"
          />
        </div>
      )}
    />
  );
}
