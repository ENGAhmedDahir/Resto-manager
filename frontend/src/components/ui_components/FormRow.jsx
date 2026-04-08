function FormRow({ label, error, children }) {
  return (
    <div
      className="
        grid gap-3 
        sm:grid-cols-1
        md:grid-cols-[14rem_1fr]
        lg:grid-cols-[18rem_1fr]
        items-start
      "
    >
      {label && <label className="font-medium text-sm md:pt-2">{label}</label>}

      <div className="flex flex-col gap-1">
        {children}

        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
    </div>
  );
}

export default FormRow;
