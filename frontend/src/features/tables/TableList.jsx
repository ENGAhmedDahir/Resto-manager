import LoadingSpinner from "@/components/ui_components/LoadingSpinner";
import Menus from "@/components/ui_components/Menus";
import Modal from "@/components/ui_components/Modal";
import TableCard from "./TableCard";
import { useTables } from "./useTables";
import { useSearchParams } from "react-router-dom";

function TableList() {
  const { tables = [], isLoading } = useTables();
  const [searchParams] = useSearchParams();

  if (isLoading) return <LoadingSpinner message="Loading tables..." />;

  // 1. Filter
  const filterValue = searchParams.get("search")?.toLowerCase() || "";

  const filteredTables = tables.filter((table) =>
    String(table.tableNumber).toLowerCase().includes(filterValue),
  );

  // 2. Sort
  const sortBy = searchParams.get("sortBy") || "tableNumber-asc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;

  const sortedTables = filteredTables.sort((a, b) => {
    // Handle numeric comparison for tableNumber and capacity
    if (field === "tableNumber" || field === "capacity") {
      return (items) => (a[field] - b[field]) * modifier;
    }
    // Fallback for strings if needed (though tableNumber is likely number)
    return String(a[field]).localeCompare(String(b[field])) * modifier;
  });

  // Correct sorting logic for numbers directly
  const finalSortedTables = filteredTables.sort((a, b) => {
    let aValue = a[field];
    let bValue = b[field];

    // Assuming tableNumber is numeric or string-numeric
    if (field === "tableNumber") {
      // Try to parse as Int for correct "1, 2, 10" sorting instead of "1, 10, 2"
      const aNum = parseInt(aValue, 10);
      const bNum = parseInt(bValue, 10);
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return (aNum - bNum) * modifier;
      }
    }

    if (field === "capacity") {
      return (aValue - bValue) * modifier;
    }

    // Default string compare
    if (aValue > bValue) return 1 * modifier;
    if (aValue < bValue) return -1 * modifier;
    return 0;
  });

  return (
    <Menus>
      <Modal>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-6">
          {finalSortedTables.map((table) => (
            <TableCard key={table._id} table={table} />
          ))}
        </div>
      </Modal>
    </Menus>
  );
}

export default TableList;
