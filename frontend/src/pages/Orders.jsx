import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import OrderForm from "../components/orders/OrderForm";
import OrderTable from "../components/orders/OrderTable";
import Pagination from "../components/ui/Pagination";
import Button from "../components/ui/Button";
import { TableSkeleton } from "../components/ui/LoadingSkeleton";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import { getOrders, createOrder } from "../api/orders";
import { getProducts } from "../api/products";
import { getCustomers } from "../api/customers";

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadData();
  }, [currentPage]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ordersData, productsData, customersData] = await Promise.all([
        getOrders(currentPage, 10),
        getProducts(),
        getCustomers(),
      ]);
      setOrders(ordersData.data || ordersData);
      setTotalPages(ordersData.total_pages || 1);
      setProducts(productsData.data || productsData);
      setCustomers(customersData.data || customersData);
    } catch (error) {
      toast.error("Failed to load data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (payload) => {
    try {
      await createOrder(payload);
      toast.success("Order created successfully");
      setCurrentPage(1);
      loadData();
    } catch (error) {
      toast.error("Failed to create order");
      console.error(error);
    }
  };

  const handleViewDetails = (order) => {
    navigate(`/orders/${order.id}`);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
            <p className="text-slate-500 mt-1">Manage and track your orders</p>
          </div>
          <Button onClick={() => setIsFormOpen(true)} className="w-full sm:w-auto">
            <Plus className="w-4 h-4" />
            Create Order
          </Button>
        </div>

        {loading ? (
          <TableSkeleton />
        ) : (
          <>
            <OrderTable
              orders={orders}
              onViewDetails={handleViewDetails}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      <OrderForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        customers={customers}
        products={products}
        onSubmit={handleCreate}
      />
    </MainLayout>
  );
}