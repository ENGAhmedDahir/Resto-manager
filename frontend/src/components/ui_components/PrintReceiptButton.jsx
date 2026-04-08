import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { ReceiptPreview } from "./ReceiptPreview";

export default function PrintReceiptButton() {
  const receiptRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: "Receipt",
    pageStyle: `
      @page {
        size: 80mm auto;
        margin: 0;
      }
      body {
        margin: 0;
      }
    `,
  });

  return (
    <>
      {/* Keep it mounted but hidden */}
      <div style={{ position: "absolute", top: "-9999px" }}>
        <ReceiptPreview ref={receiptRef} />
      </div>

      <Button onClick={handlePrint} variant="outline">
        <Printer className="w-4 h-4 mr-2" />
        Print Receipt
      </Button>
    </>
  );
}
