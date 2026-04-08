function Heading({ title, subtitle }) {
  return (
    <div className="flex flex-col gap-1 mb-2">
      <h1 className="text-3xl font-bold tracking-tight ">{title}</h1>
      <p className="text-sm text-popover-foreground">{subtitle}</p>
    </div>
  );
}

export default Heading;
