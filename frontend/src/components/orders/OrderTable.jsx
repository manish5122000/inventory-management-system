import { Calendar, DollarSign, User, Eye } from "lucide-react";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";

export default function OrderTable({ orders, onViewDetails }) {
  if (orders.length === 0) {
    return (
      <EmptyState
        type="orders"
        title="No orders found"
        description="Get started by creating your first order."
      />
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Order ID
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Customer ID
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Customer Name
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Total Amount
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4">
                <div className="font-medium text-slate-900">#{order.id}</div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="text-sm">Customer #{order.customer_id}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="text-sm">{order.customer_name}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-sm">{new Date().toLocaleDateString()}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  {/* <DollarSign className="w-4 h-4 text-green-500" /> */}
                  <span className="font-semibold text-slate-900">₹{order.total_amount?.toFixed(2) || "0.00"}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDetails(order)}
                  className="text-slate-600 hover:text-blue-600"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}