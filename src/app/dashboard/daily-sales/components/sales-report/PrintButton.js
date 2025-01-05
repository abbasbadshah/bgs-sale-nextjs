import { PDFDownloadLink } from "@react-pdf/renderer";
import { SalesReport } from "./PDFReport";

export const PrintButton = ({
  showPrintOptions,
  setShowPrintOptions,
  getFilteredSales,
  getPeriodLabel,
}) => (
  <div className="relative">
    <button
      onClick={() => setShowPrintOptions(!showPrintOptions)}
      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
    >
      Print Report
    </button>
    {showPrintOptions && (
      <div className="fixed right-4 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
        <div className="py-1">
          {["today", "week", "month", "3months", "6months", "year"].map(
            (period) => (
              <PDFDownloadLink
                key={period}
                document={
                  <SalesReport
                    data={getFilteredSales()}
                    period={getPeriodLabel(period)}
                  />
                }
                fileName={`sales_report_${period}_${
                  new Date().toISOString().split("T")[0]
                }.pdf`}
                className="block w-full text-left px-4 py-2 text-sm text-gray-100 hover:bg-gray-100"
              >
                {({ loading }) =>
                  loading ? "Loading..." : getPeriodLabel(period)
                }
              </PDFDownloadLink>
            )
          )}
        </div>
      </div>
    )}
  </div>
);
