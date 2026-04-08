import { DataTable } from "@/components/pos/DataTable";
import { useCurrentUser } from "../authentication/useCurrentUser";
import { Badge } from "@/components/ui/badge";

import { useCategories } from "./useCategories";
import EditCategory from "./EditCategory";
import DeleteCategory from "./DeleteCategory";
import LoadingSpinner from "@/components/ui_components/LoadingSpinner";

function CategoryTable() {
  const { categories, isLoading } = useCategories();

  const { user } = useCurrentUser();
  const isAdminOrManager = user && ["admin", "manager"].includes(user.role);

  if (isLoading) return <LoadingSpinner message="Loading Categories..." />;
  const filters = [
    {
      key: "isActive",
      label: "Status",
      options: [
        { value: "true", label: "Active" },
        { value: "false", label: "Inactive" },
      ],
    },
  ];

  const columns = [
    {
      key: "image",
      header: "Icon",
      render: (value) => {
        if (typeof value === "string" && value.length <= 2) {
          return (
            <div className="flex items-center justify-center w-10 h-10 text-2xl">
              {value}
            </div>
          );
        }

        if (value) {
          return (
            <div className="flex items-center justify-center w-10 h-10">
              <img
                src={
                  value.startsWith("http")
                    ? value
                    : `https://res.cloudinary.com/dhn3v9kqn/image/upload/${value}`
                }
                alt="Category"
                className="w-10 h-10 object-cover rounded-md"
              />
            </div>
          );
        }

        return "—";
      },
    },
    {
      key: "name",
      header: "Category Name",
      sortable: true,
    },
    {
      key: "description",
      header: "Description",
    },
    {
      key: "isActive",
      header: "Status",
      render: (value) => (
        <Badge variant={value ? "success" : "secondary"}>
          {value ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "_id",
      header: "",
      render: (value, row) => (
        <div className="flex gap-1">
          {isAdminOrManager && (
            <>
              <EditCategory category={row} />
              <DeleteCategory categoryId={row._id} categoryName={row.name} />
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={categories}
      columns={columns}
      searchKeys={["name"]}
      isLoading={isLoading}
      filters={filters}
    />
  );
}

export default CategoryTable;
