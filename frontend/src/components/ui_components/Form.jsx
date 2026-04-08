function Form({ type = "regular", children, className = "", ...props }) {
  const base = "overflow-hidden text-sm sm:text-xs";

  const regular = `
    bg-white border border-gray-100
    rounded-md
    px-16 py-10

    lg:px-12 lg:py-8
    sm:px-8 sm:py-6
    `;

  const modal = `
    w-[80rem] max-w-full

    lg:w-[60rem] lg:px-12 lg:py-8 lg:overflow-y-auto

    sm:w-full sm:px-7 sm:py-6 sm:rounded-sm
    `;

  return (
    <form
      className={`${base} ${type === "regular" ? regular : modal} ${className}`}
      {...props}
    >
      {children}
    </form>
  );
}

export default Form;
