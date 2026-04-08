import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function FilterAndSort() {
  const [searchParams, setSearchParams] = useSearchParams();

  function handleSearch(e) {
    searchParams.set("search", e.target.value);
    setSearchParams(searchParams);
  }

  function handleSort(value) {
    searchParams.set("sortBy", value);
    setSearchParams(searchParams);
  }

  const currentFilter = searchParams.get("search") || "";
  const currentSort = searchParams.get("sortBy") || "tableNumber-asc";

  return (
    <div className="flex items-center gap-3 justify-end">
      <Input
        placeholder="Search by table #..."
        value={currentFilter}
        onChange={handleSearch}
        className="h-9 w-[150px] lg:w-[250px]"
      />

      <Select value={currentSort} onValueChange={handleSort}>
        <SelectTrigger className="h-9 w-[180px]">
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="tableNumber-asc">Sort by Table # (A-Z)</SelectItem>
          <SelectItem value="tableNumber-desc">
            Sort by Table # (Z-A)
          </SelectItem>
          <SelectItem value="capacity-desc">
            Sort by Capacity (High-Low)
          </SelectItem>
          <SelectItem value="capacity-asc">
            Sort by Capacity (Low-High)
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default FilterAndSort;
