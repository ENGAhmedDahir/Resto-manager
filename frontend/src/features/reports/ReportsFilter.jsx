import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Heading from "@/components/ui_components/Heading";
import { Download } from "lucide-react";
import ReportsExportButton from "./ReportsExportButton";

function ReportsFilter({ reports, period, setPeriod }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between">
      <Heading title="Reports" subtitle=" Analytics and business insights" />

      <div className="flex gap-2">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Time period" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="thisWeek">This Week</SelectItem>
            <SelectItem value="thisMonth">This Month</SelectItem>
            <SelectItem value="thisYear">This Year</SelectItem>
          </SelectContent>
        </Select>

        {/* <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button> */}
        <ReportsExportButton reports={reports} />
      </div>
    </div>
  );
}

export default ReportsFilter;
