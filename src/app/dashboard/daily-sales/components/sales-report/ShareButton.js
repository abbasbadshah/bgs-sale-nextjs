import { useState } from "react";
import { pdf } from "@react-pdf/renderer";

export const ShareButton = ({
  getFilteredSales,
  dateFilter,
  getPeriodLabel,
}) => {
  const [isSharing, setIsSharing] = useState(false);

  const generatePDFAndShare = async () => {
    setIsSharing(true);
    try {
      const pdfDoc = (
        <SalesReport
          data={getFilteredSales()}
          period={getPeriodLabel(dateFilter)}
        />
      );
      const blob = await pdf(pdfDoc).toBlob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = reader.result;
        const filteredData = getFilteredSales();
        const totalAmount = filteredData.reduce(
          (sum, entry) => sum + Number(entry.totalAmount),
          0
        );

        const message =
          `*Badshah General Store Masakin Branch - Sales Report*%0a%0a` +
          `Period: ${getPeriodLabel(dateFilter)}%0a` +
          `Total Sales: Rs. ${totalAmount.toFixed(2)}%0a` +
          `Number of Transactions: ${filteredData.length}%0a%0a` +
          `Generated on: ${new Date().toLocaleString()}`;

        const response = await fetch("/api/share-report", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            pdfData: base64data,
            phoneNumber: "919926051954",
            fileName: `sales_report_${dateFilter}_${
              new Date().toISOString().split("T")[0]
            }.pdf`,
          }),
        });

        if (!response.ok) throw new Error("Failed to share report");

        const result = await response.json();
        if (result.success) {
          window.open(result.whatsappUrl, "_blank");
        } else {
          throw new Error(result.message || "Failed to share report");
        }
      };
    } catch (error) {
      console.error("Error sharing report:", error);
      alert("Failed to share report. Please try again.");
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <button
      onClick={generatePDFAndShare}
      disabled={isSharing}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50"
    >
      {isSharing ? "Sending..." : "Send Report to Owner"}
    </button>
  );
};
