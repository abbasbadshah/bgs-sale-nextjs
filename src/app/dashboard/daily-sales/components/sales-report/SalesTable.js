import { PrintButton } from "./PrintButton";
import { ShareButton } from "./ShareButton";

export const SalesTable = ({
  isTableLoading,
  getFilteredSales,
  dateFilter,
  setDateFilter,
  showPrintOptions,
  setShowPrintOptions,
  getPeriodLabel,
}) => {
  // Helper function to check if text needs truncation
  const needsTruncation = (text) => text.length > 50; // You can adjust this length

  return (
    <div className="bg-white rounded-md max-h-[74vh] overflow-y-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-md shadow-lg px-8 py-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-900">Sales Entries</h3>
        <div className="flex gap-4 items-center">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
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
            getPeriodLabel={getPeriodLabel}
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
              Payment Type
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
                  {needsTruncation(entry.products.join(", ")) ? (
                    <div className="relative group">
                      <div className="truncate max-w-xs cursor-pointer">
                        {entry.products.join(", ")}
                      </div>
                      <div className="hidden group-hover:block absolute z-10 bg-white border border-gray-200 rounded-md shadow-lg p-4 max-w-md whitespace-normal left-0 mt-1">
                        {entry.products.join(", ")}
                      </div>
                    </div>
                  ) : (
                    entry.products.join(", ")
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                  {entry.paymentType}
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
  );
};
