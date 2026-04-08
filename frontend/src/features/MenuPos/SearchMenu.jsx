import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

function SearchMenu({ search, setSearch }) {
  return (
    <div className="relative flex-1 max-w-md ">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search menu items..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pl-9"
      />
    </div>
  );
}

export default SearchMenu;
