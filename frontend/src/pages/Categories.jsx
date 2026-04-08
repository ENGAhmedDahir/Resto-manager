import Heading from "@/components/ui_components/Heading";
import AddCategory from "@/features/categories/AddCategory";
import CategoryTable from "@/features/categories/CategoryTable";

export default function Categories() {
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title="Categories"
          subtitle="Organize your  of menu category "
        />

        <AddCategory />
      </div>

      <CategoryTable />
    </>
  );
}
