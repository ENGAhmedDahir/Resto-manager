import { Button } from "@/components/ui/button";
import { exportReportsToExcel } from "@/utils/excelExport";
import { Download } from "lucide-react";

function ReportsExportButton({ reports }) {
  return (
    <Button variant="outline" onClick={() => exportReportsToExcel(reports)}>
      <Download className="h-4 w-4 mr-2" />
      Export Report
    </Button>
  );
}

export default ReportsExportButton;
