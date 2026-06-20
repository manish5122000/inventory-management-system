import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { ArrowLeft, Calendar, DollarSign, User, Package } from "lucide-react";
import toast from "react-hot-toast";
import { getOrderById } from "../api/orders";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const data = await getOrderById(id);
      setOrder(data);
    } catch (error) {
      toast.error("Failed to load order details");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  console.log("lsjdfj",order)

  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-slate-200 rounded mb-4"></div>
            <div className="h-32 bg-slate-200 rounded"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!order) {
    return (
      <MainLayout>
        <div className="text-center py-16">
          <p className="text-slate-500">Order not found</p>
          <Button onClick={() => navigate("/orders")} className="mt-4">
            Back to Orders
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/orders")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Order #{order.id}</h1>
            <p className="text-slate-500 mt-1">Order details and information</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Customer ID</p>
                <p className="font-semibold text-slate-900">#{order.customer_id}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Amount</p>
                <p className="font-semibold text-slate-900">₹{order.total_amount?.toFixed(2) || "0.00"}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <User className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Customer Name</p>
                <p className="font-semibold text-slate-900">
                  {order.customer_name || "N/A"}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Order Date</p>
                <p className="font-semibold text-slate-900">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </Card>
        </div>

        <Card title="Order Items">
          {order.order_items && Array.isArray(order.order_items) && order.order_items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Product ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Quantity</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Unit Price</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.order_items.map((item, index) => (
                    <tr key={item.id || index} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-900">#{item.product_id}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{item.quantity}</td>
                      <td className="py-3 px-4 text-slate-600">₹{item.unit_price?.toFixed(2) || "0.00"}</td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-900">₹{item.subtotal?.toFixed(2) || "0.00"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">No items in this order</div>
          )}
        </Card>
      </div>
    </MainLayout>
  );
}