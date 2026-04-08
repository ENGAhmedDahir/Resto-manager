import { DataTable } from "@/components/pos/DataTable";
import { useQuery } from "@tanstack/react-query";
import { getCategoryInventories } from "../../services/apiCategoryInventory";
import { HiPencil, HiTrash, HiMiniPlus } from "react-icons/hi2";
import Menus from "@/components/ui_components/Menus";
import Modal from "@/components/ui_components/Modal";
import { Button } from "@/components/ui/button";
import DeleteCategory from "./DeleteCategory";
import AddCategoryForm from "./AddCategoryForm";
import LoadingSpinner from "@/components/ui_components/LoadingSpinner";
// import Empty from "@/components/ui_components/Empty";

function CategoryTable() {
    const {
        isLoading,
        data: categories = [],
        error,
    } = useQuery({
        queryKey: ["categoryInventory"],
        queryFn: getCategoryInventories,
    });

    const columns = [
        {
            key: "name",
            header: "Name",
            sortable: true,
            className: "font-medium",
        },
        { key: "description", header: "Description", sortable: true },
        {
            key: "actions",
            header: "",
            render: (_, row) => (
                <Menus.Menu>
                    <Menus.Toggle id={row._id} />
                    <Menus.List id={row._id}>
                        <Modal.Open opens={`edit-category-${row._id}`}>
                            <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
                        </Modal.Open>

                        <Modal.Open opens={`delete-category-${row._id}`}>
                            <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
                        </Modal.Open>
                    </Menus.List>

                    <Modal.Window name={`edit-category-${row._id}`}>
                        <AddCategoryForm categoryToEdit={row} />
                    </Modal.Window>

                    <Modal.Window name={`delete-category-${row._id}`}>
                        <DeleteCategory id={row._id} />
                    </Modal.Window>
                </Menus.Menu>
            ),
        },
    ];

    if (isLoading) return <LoadingSpinner message="Loading categories..." />;
    // if (error) return <Empty resourceName="categories" />;

    return (
        <div className="space-y-4">
            <Menus>
                <Modal>
                    <div className="flex justify-end">
                        <Modal.Open opens="category-form">
                            <Button>
                                <HiMiniPlus className="mr-2 h-4 w-4" />
                                Add Category
                            </Button>
                        </Modal.Open>
                        <Modal.Window name="category-form" title="Add Category">
                            <AddCategoryForm />
                        </Modal.Window>
                    </div>

                    <DataTable
                        data={categories}
                        columns={columns}
                        searchKeys={["name"]}
                        searchPlaceholder="Search categories..."
                    />
                </Modal>
            </Menus>
        </div>
    );
}

export default CategoryTable;
