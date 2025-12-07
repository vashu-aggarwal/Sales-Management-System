import React from "react";
import { Copy } from "lucide-react";

export default function TransactionsTable({ rows = [] }) {
  if (!rows || rows.length === 0)
    return (
      <div className="p-8 text-center text-gray-500">No results found.</div>
    );

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(String(text));
  };

  const mapId = (r) => r.transaction_id || r.id || r.transactionId || "";
  const format = (val) =>
    val === null || val === undefined ? "" : String(val);
  const formatDate = (date) => {
    if (!date) return "";
    try {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch (e) {
      return String(date);
    }
  };
  const formatCurrency = (val) => {
    if (!val) return "₹0";
    const num = parseInt(val);
    return `₹${num.toLocaleString("en-IN")}`;
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto -mx-2 sm:mx-0 px-2 sm:px-0 md:overflow-x-visible">
        <table className="w-full text-left text-xs min-w-max lg:min-w-full">
          <thead>
            <tr className="text-xs font-semibold text-gray-700 border-b border-gray-200 bg-gray-50 ">
              <th className="py-2 px-3 whitespace-normal sm:whitespace-nowrap">
                Transaction ID
              </th>
              <th className="py-2 px-3 whitespace-normal sm:whitespace-nowrap">
                Date
              </th>
              <th className="py-2 px-3 whitespace-normal sm:whitespace-nowrap">
                Customer ID
              </th>
              <th className="py-2 px-3 whitespace-normal sm:whitespace-nowrap">
                Customer name
              </th>
              <th className="py-2 px-3 whitespace-normal sm:whitespace-nowrap">
                Phone Number
              </th>
              <th className="py-2 px-3 whitespace-normal sm:whitespace-nowrap">
                Gender
              </th>
              <th className="py-2 px-3 whitespace-normal sm:whitespace-nowrap">
                Age
              </th>
              <th className="py-2 px-3 whitespace-normal sm:whitespace-nowrap">
                Product Category
              </th>
              <th className="py-2 px-3 whitespace-normal sm:whitespace-nowrap">
                Quantity
              </th>
              <th className="py-2 px-3 whitespace-normal sm:whitespace-nowrap">
                Total Amount
              </th>
              <th className="py-2 px-3 whitespace-normal sm:whitespace-nowrap">
                Customer Region
              </th>
              <th className="py-2 px-3 whitespace-normal sm:whitespace-nowrap hidden lg:table-cell">
                Product ID
              </th>
              <th className="py-2 px-3  whitespace-normal sm:whitespace-nowrap">
                Employee Name
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr
                key={`${mapId(r)}_${idx}`}
                className="border-b border-gray-200 hover:bg-gray-50 transition text-xs"
              >
                <td className="py-2 px-3 whitespace-normal sm:whitespace-nowrap text-gray-900 font-medium">
                  {mapId(r)}
                </td>
                <td className="py-2 px-3 whitespace-normal sm:whitespace-nowrap text-gray-600">
                  {formatDate(r.date)}
                </td>
                <td className="py-2 px-3 whitespace-normal sm:whitespace-nowrap text-gray-600">
                  {format(r.customer_id || r.customerId)}
                </td>
                <td className="py-2 px-3 whitespace-normal sm:whitespace-nowrap text-gray-900 font-medium">
                  {format(r.customer_name || r.customerName)}
                </td>
                <td className="py-2 px-3 whitespace-normal sm:whitespace-nowrap text-gray-600">
                  <div className="flex items-center gap-2">
                    <span>{format(r.phone_number || r.phoneNumber)}</span>
                    <button
                      onClick={() =>
                        copyToClipboard(r.phone_number || r.phoneNumber)
                      }
                      className="text-gray-400 hover:text-gray-600 transition"
                      title="Copy phone number"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="9"
                          y="9"
                          width="13"
                          height="13"
                          rx="2"
                          ry="2"
                        ></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </button>
                  </div>
                </td>
                <td className="py-2 px-3 whitespace-normal sm:whitespace-nowrap text-gray-600">
                  {format(r.gender)}
                </td>
                <td className="py-2 px-3 whitespace-normal sm:whitespace-nowrap text-gray-600">
                  {format(r.age)}
                </td>
                <td className="py-2 px-3 whitespace-normal sm:whitespace-nowrap text-gray-900 font-semibold">
                  {format(r.product_category || r.productCategory)}
                </td>
                <td className="py-2 px-3 whitespace-normal sm:whitespace-nowrap text-gray-900 font-medium">
                  {format(r.quantity)}
                </td>
                <td className="py-2 px-3 whitespace-normal sm:whitespace-nowrap text-gray-900 font-medium">
                  {formatCurrency(r.total_amount || r.totalAmount)}
                </td>
                <td className="py-2 px-3 whitespace-normal sm:whitespace-nowrap text-gray-600">
                  {format(r.customer_region || r.customerRegion)}
                </td>
                <td className="py-2 px-3 whitespace-normal sm:whitespace-nowrap text-gray-600 hidden lg:table-cell">
                  {format(r.product_id || r.productId)}
                </td>
                <td className="py-2 px-3 whitespace-normal sm:whitespace-nowrap text-gray-600">
                  {format(r.employee_name || r.employeeName)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
