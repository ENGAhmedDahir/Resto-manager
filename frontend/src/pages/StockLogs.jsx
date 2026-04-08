import Heading from "@/components/ui_components/Heading";
import StockLogTable from "@/features/inventory/StockLogTable";

export default function StockLogs() {
    return (
        <div className="space-y-6">
            <Heading
                title="Stock Logs"
                subtitle="Track all inventory movements and transactions"
            />
            <StockLogTable />
        </div>
    );
}
