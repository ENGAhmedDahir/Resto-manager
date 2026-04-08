export function ImageUploader({ label, value, onChange, id = "image-upload" }) {
  return (
    <div className="flex items-center gap-10">
      {/* Label */}
      <label
        htmlFor={id}
        className="min-w-[120px] text-sm font-medium text-foreground"
      >
        {label}
      </label>

      {/* Upload Button */}
      <div className="flex items-center gap-3">
        <label
          htmlFor={id}
          className="cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Choose Image
        </label>

        <span className="text-sm text-muted-foreground">
          {value ? value.name : "No file chosen"}
        </span>

        <input
          id={id}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0])}
        />
      </div>
    </div>
  );
}
