// pages/sales/index.js
"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import DashboardLayout from "@/components/layout";
import { SalesTable } from "./components/sales-report/SalesTable";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import TotalSalesCard from "./components/sales-report/SaleAmount";

const OnlineSaleForm = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [salesEntries, setSalesEntries] = useState([]);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("today");
  const [showPrintOptions, setShowPrintOptions] = useState(false);
  const { control, handleSubmit, reset } = useForm();

  const fetchSales = async () => {
    setIsTableLoading(true);
    try {
      let url = "/api/daily-sales";
      const params = new URLSearchParams();

      if (dateFilter === "yesterday") {
        params.append("yesterday", "true");
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
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
        case "yesterday":
          const yesterdayStart = new Date(now);
          yesterdayStart.setDate(yesterdayStart.getDate() - 1);
          yesterdayStart.setHours(0, 0, 0, 0);
          const yesterdayEnd = new Date(now);
          yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);
          yesterdayEnd.setHours(23, 59, 59, 999);
          return entryDate >= yesterdayStart && entryDate <= yesterdayEnd;
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
      case "yesterday":
        return "Yesterday's Report";
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

      const response = await fetch("/api/daily-sales", {
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

  return (
    <DashboardLayout pageHeading={"Daily Sales"}>
      <section className="w-full bg-primary h-full lg:h-[100vh] lg:overflow-y-scroll rounded-md p-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-md">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
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
                <div className="">
                  <Input
                    type="textarea"
                    name="products"
                    label="Enter Products"
                    placeholder={"Use Comma to add multiple products"}
                    control={control}
                    rows={5}
                    maxRows={8}
                    minRows={2}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="select"
                      name="paymentType"
                      label="Payment Type"
                      control={control}
                      required
                      options={[
                        { value: "cash", label: "Cash" },
                        { value: "online", label: "online" },
                      ]}
                      placeholder="Choose Payment Type"
                      dark={true}
                    />
                    <Input
                      control={control}
                      name={"totalAmount"}
                      placeholder={"Total Amount"}
                      required
                      type="text"
                      label={"Enter Total Amount"}
                      autoComplete={"totalAmount"}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className={
                    "transition-colors duration-200 disabled:opacity-50"
                  }
                >
                  {isLoading ? "Recording..." : "Record Sale"}
                </Button>
              </form>
            </div>
            <TotalSalesCard
              salesEntries={salesEntries}
              dateFilter={dateFilter}
            />
          </div>
          <SalesTable
            isTableLoading={isTableLoading}
            getFilteredSales={getFilteredSales}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            showPrintOptions={showPrintOptions}
            setShowPrintOptions={setShowPrintOptions}
            getPeriodLabel={getPeriodLabel}
          />
        </div>
      </section>
    </DashboardLayout>
  );
};

export default OnlineSaleForm;
