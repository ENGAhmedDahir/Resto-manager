import { useTheme } from "next-themes";

function MainLogo() {
  const { theme } = useTheme();
  const src = theme === "dark" ? "/restoLogo-dark.png" : "/restoLogo.png";
  return (
    <div className="flex flex-col items-center text-center space-y-2">
      <img
        src={src}
        alt="ResTo Manager Logo"
        className="w-[250px] h-[200px] object-contain"
      />
    </div>
  );
}

export default MainLogo;
