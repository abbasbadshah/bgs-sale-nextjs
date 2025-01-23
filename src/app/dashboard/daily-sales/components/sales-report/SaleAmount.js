import { useMemo } from "react";

const TotalSalesCard = ({ salesEntries, dateFilter }) => {
  const filteredStats = useMemo(() => {
    const now = new Date();
    let filteredSales = salesEntries;

    // Apply date filtering
    switch (dateFilter) {
      case "today":
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        filteredSales = filteredSales.filter((sale) => {
          const saleDate = new Date(sale.date);
          return saleDate >= today;
        });
        break;
      case "yesterday":
        const yesterdayStart = new Date(now);
        yesterdayStart.setDate(yesterdayStart.getDate() - 1);
        yesterdayStart.setHours(0, 0, 0, 0);
        const yesterdayEnd = new Date(now);
        yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);
        yesterdayEnd.setHours(23, 59, 59, 999);
        filteredSales = filteredSales.filter((sale) => {
          const saleDate = new Date(sale.date);
          return saleDate >= yesterdayStart && saleDate <= yesterdayEnd;
        });
        break;
      case "week":
        const lastWeek = new Date(now);
        lastWeek.setDate(lastWeek.getDate() - 7);
        filteredSales = filteredSales.filter((sale) => {
          const saleDate = new Date(sale.date);
          return saleDate >= lastWeek;
        });
        break;
      case "month":
        const lastMonth = new Date(now);
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        filteredSales = filteredSales.filter((sale) => {
          const saleDate = new Date(sale.date);
          return saleDate >= lastMonth;
        });
        break;
      case "3months":
        const last3Months = new Date(now);
        last3Months.setMonth(last3Months.getMonth() - 3);
        filteredSales = filteredSales.filter((sale) => {
          const saleDate = new Date(sale.date);
          return saleDate >= last3Months;
        });
        break;
      case "6months":
        const last6Months = new Date(now);
        last6Months.setMonth(last6Months.getMonth() - 6);
        filteredSales = filteredSales.filter((sale) => {
          const saleDate = new Date(sale.date);
          return saleDate >= last6Months;
        });
        break;
      case "year":
        const lastYear = new Date(now);
        lastYear.setFullYear(lastYear.getFullYear() - 1);
        filteredSales = filteredSales.filter((sale) => {
          const saleDate = new Date(sale.date);
          return saleDate >= lastYear;
        });
        break;
    }

    // Calculate statistics
    const totalAmount = filteredSales.reduce(
      (sum, sale) => sum + parseFloat(sale.totalAmount),
      0
    );

    const onlineSales = filteredSales.filter(
      (sale) => sale.paymentType === "online"
    );

    const cashSales = filteredSales.filter(
      (sale) => sale.paymentType === "cash"
    );

    const onlineSalesAmount = onlineSales.reduce(
      (sum, sale) => sum + parseFloat(sale.totalAmount),
      0
    );

    const cashSalesAmount = cashSales.reduce(
      (sum, sale) => sum + parseFloat(sale.totalAmount),
      0
    );

    return {
      totalAmount,
      totalSales: filteredSales.length,
      onlineSales: onlineSales.length,
      cashSales: cashSales.length,
      onlineSalesAmount,
      cashSalesAmount,
    };
  }, [salesEntries, dateFilter]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {dateFilter === "today"
            ? "Today's"
            : dateFilter === "yesterday"
            ? "Yesterday's"
            : dateFilter.charAt(0).toUpperCase() + dateFilter.slice(1) + "'s"}
          {' '}Sales Overview
        </h2>
        <svg
          className="w-6 h-6 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-3xl font-bold text-green-600">
            ₹
            {filteredStats.totalAmount.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </p>
          <p className="text-sm text-gray-500">Total Revenue</p>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <p className="text-2xl font-bold text-blue-600">
              {filteredStats.totalSales}
            </p>
          </div>
          <p className="text-sm text-gray-500">Total Transactions</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-200">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <p className="text-sm font-medium text-gray-700">Online Sales</p>
          </div>
          <p className="text-xl font-semibold text-gray-800">
            {filteredStats.onlineSales}
          </p>
          <p className="text-lg font-medium text-purple-600 mt-1">
            ₹
            {filteredStats.onlineSalesAmount.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <p className="text-sm font-medium text-gray-700">Cash Sales</p>
          </div>
          <p className="text-xl font-semibold text-gray-800">
            {filteredStats.cashSales}
          </p>
          <p className="text-lg font-medium text-orange-600 mt-1">
            ₹
            {filteredStats.cashSalesAmount.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TotalSalesCard;
