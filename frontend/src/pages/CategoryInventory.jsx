import Heading from "@/components/ui_components/Heading";
import CategoryTable from "@/features/inventory/CategoryTable";

export default function CategoryInventory() {
    return (
        <div className="space-y-6">
            <Heading
                title="Category Inventory"
                subtitle="Manage and organize your inventory categories"
            />
            <CategoryTable />
        </div>
    );
}
