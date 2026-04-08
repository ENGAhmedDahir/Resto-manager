import TableList from "../features/tables/TableList";
import TableOperations from "../features/tables/TableOperations";
import FilterAndSort from "../features/tables/FilterAndSort";
import Heading from "../components/ui_components/Heading";

function Tables() {
  return (
    <>
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex items-center justify-between">
          <Heading title="Tables" subtitle="Manage restaurant tables" />
          <TableOperations />
        </div>

        <FilterAndSort />
      </div>

      <TableList />
    </>
  );
}

export default Tables;
