"use client";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

// PDF styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  shopName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 20,
  },
  table: {
    display: "table",
    width: "100%",
    marginBottom: 30,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#bfbfbf",
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
  },
  tableCell: {
    padding: 8,
    fontSize: 10,
    textAlign: "left",
  },
  col1: { width: "25%" },
  col2: { width: "35%" },
  col3: { width: "20%" },
  col4: { width: "20%" },
  signature: {
    marginTop: 50,
    textAlign: "right",
  },
  totalRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
  },
  totalAmount: {
    fontSize: 12,
    fontWeight: "bold",
  },
});

// PDF Document Component
const SalesReport = ({ data, period }) => {
  const totalAmount = data.reduce(
    (sum, entry) => sum + Number(entry.totalAmount),
    0
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.shopName}>
            Badshah General Store Masakin Branch
          </Text>
          <Text style={styles.title}>Sales Report</Text>
          <Text style={styles.subtitle}>Period: {period}</Text>
          <Text style={styles.subtitle}>
            Date: {new Date().toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, styles.col1]}>Date</Text>
            <Text style={[styles.tableCell, styles.col2]}>Products</Text>
            <Text style={[styles.tableCell, styles.col3]}>Amount</Text>
            <Text style={[styles.tableCell, styles.col4]}>Created At</Text>
          </View>

          {data.map((entry, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.col1]}>
                {new Date(entry.date).toLocaleDateString()}
              </Text>
              <Text style={[styles.tableCell, styles.col2]}>
                {entry.products.join(", ")}
              </Text>
              <Text style={[styles.tableCell, styles.col3]}>
                Rs. {Number(entry.totalAmount).toFixed(2)}
              </Text>
              <Text style={[styles.tableCell, styles.col4]}>
                {new Date(entry.createdAt).toLocaleString()}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount:</Text>
          <Text style={styles.totalAmount}>Rs. {totalAmount.toFixed(2)}</Text>
        </View>

        <View style={styles.signature}>
          <Text>Authorized Signature</Text>
          <Text>_________________</Text>
        </View>
      </Page>
    </Document>
  );
};

const PrintButton = ({
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
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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

const ShareButton = ({ getFilteredSales, dateFilter, getPeriodLabel }) => {
  const [isSharing, setIsSharing] = useState(false);

  const generatePDFAndShare = async () => {
    setIsSharing(true);
    try {
      // Generate PDF blob
      const pdfDoc = (
        <SalesReport
          data={getFilteredSales()}
          period={getPeriodLabel(dateFilter)}
        />
      );
      const blob = await pdf(pdfDoc).toBlob();

      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64data = reader.result;

        // Generate WhatsApp message
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

        // Send to backend API
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

        if (!response.ok) {
          throw new Error("Failed to share report");
        }

        const result = await response.json();
        if (result.success) {
          // Open WhatsApp with the pre-filled message
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
const OnlineSaleForm = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [salesEntries, setSalesEntries] = useState([]);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("today");
  const [showPrintOptions, setShowPrintOptions] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const fetchSales = async () => {
    setIsTableLoading(true);
    try {
      const response = await fetch("/api/sales/online");
      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        setSalesEntries(result.data);
      } else {
        console.error("Invalid response format:", result);
        setError("Failed to load sales data");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load sales data");
    } finally {
      setIsTableLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const getFilteredSales = () => {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));

    return salesEntries.filter((entry) => {
      const entryDate = new Date(entry.date);
      switch (dateFilter) {
        case "today":
          return entryDate >= startOfDay;
        case "week":
          const lastWeek = new Date(now);
          lastWeek.setDate(lastWeek.getDate() - 7);
          return entryDate >= lastWeek;
        case "month":
          const lastMonth = new Date(now);
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          return entryDate >= lastMonth;
        case "3months":
          const last3Months = new Date(now);
          last3Months.setMonth(last3Months.getMonth() - 3);
          return entryDate >= last3Months;
        case "6months":
          const last6Months = new Date(now);
          last6Months.setMonth(last6Months.getMonth() - 6);
          return entryDate >= last6Months;
        case "year":
          const lastYear = new Date(now);
          lastYear.setFullYear(lastYear.getFullYear() - 1);
          return entryDate >= lastYear;
        default:
          return true;
      }
    });
  };

  const getPeriodLabel = (period) => {
    switch (period) {
      case "today":
        return "Today's Report";
      case "week":
        return "This Week's Report";
      case "month":
        return "This Month's Report";
      case "3months":
        return "Past 3 Months Report";
      case "6months":
        return "Past 6 Months Report";
      case "year":
        return "This Year's Report";
      default:
        return "Sales Report";
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const formattedData = {
        ...data,
        products: data.products
          .split(",")
          .map((product) => product.trim())
          .filter(Boolean),
        date: new Date().toISOString(),
      };

      const response = await fetch("/api/sales/online", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess("Sale recorded successfully!");
        reset();
        fetchSales();
      } else {
        setError(result.message || "Failed to record sale");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setError("An error occurred while recording the sale");
    } finally {
      setIsLoading(false);
    }
  };

  const PrintButton = () => (
    <div className="relative">
      <button
        onClick={() => setShowPrintOptions(!showPrintOptions)}
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
      >
        Print Report
      </button>
      {showPrintOptions && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
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
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Form Section */}
        <div className="bg-white shadow-lg rounded-lg px-8 py-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Record Online Sale
          </h2>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Names (Comma Separated)
              </label>
              <textarea
                {...register("products", {
                  required: "Products are required",
                  validate: (value) =>
                    value.trim() !== "" || "Products cannot be empty",
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="e.g., Product 1, Product 2, Product 3"
                rows={3}
              />
              {errors.products && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.products.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Amount
              </label>
              <input
                type="number"
                step="0.01"
                {...register("totalAmount", {
                  required: "Total amount is required",
                  min: {
                    value: 0.01,
                    message: "Amount must be greater than 0",
                  },
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="Enter total amount"
              />
              {errors.totalAmount && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.totalAmount.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-fit bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50"
            >
              {isLoading ? "Recording..." : "Record Sale"}
            </button>
          </form>
        </div>

        {/* Table Section */}
        <div className="bg-white shadow-lg rounded-lg px-8 py-6 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Sales Entries</h3>
            <div className="flex gap-4 items-center">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="3months">Past 3 Months</option>
                <option value="6months">Past 6 Months</option>
                <option value="year">This Year</option>
              </select>
              <PrintButton
                showPrintOptions={showPrintOptions}
                setShowPrintOptions={setShowPrintOptions}
                getFilteredSales={getFilteredSales}
                getPeriodLabel={getPeriodLabel}
              />
              <ShareButton
                getFilteredSales={getFilteredSales}
                dateFilter={dateFilter}
                getPeriodLabel={getPeriodLabel} // Add this line
              />
            </div>
          </div>

          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isTableLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : getFilteredSales().length > 0 ? (
                getFilteredSales().map((entry) => (
                  <tr key={entry._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(entry.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {entry.products.join(", ")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{Number(entry.totalAmount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(entry.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-sm text-gray-500 text-center"
                  >
                    No entries found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OnlineSaleForm;
