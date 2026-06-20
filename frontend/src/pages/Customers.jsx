import { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import CustomerForm from "../components/customers/CustomerForm";
import CustomerTable from "../components/customers/CustomerTable";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import Pagination from "../components/ui/Pagination";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { TableSkeleton } from "../components/ui/LoadingSkeleton";
import { Plus, Search } from "lucide-react";
import toast from "react-hot-toast";
import { getCustomers, createCustomer, deleteCustomer, updateCustomer } from "../api/customers";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, customer: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadCustomers();
  }, [currentPage]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = customers.filter(
        (customer) =>
          customer.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.phone.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  }, [searchQuery, customers]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await getCustomers(currentPage, 10);
      setCustomers(data.data || data);
      setFilteredCustomers(data.data || data);
      setTotalPages(data.total_pages || 1);
    } catch (error) {
      toast.error("Failed to load customers");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (payload) => {
    try {
      await createCustomer(payload);
      toast.success("Customer created successfully");
      setCurrentPage(1);
      loadCustomers();
    } catch (error) {
      toast.error("Failed to create customer");
      console.error(error);
    }
  };

  const handleUpdate = async (id, payload) => {
    try {
      await updateCustomer(id, payload);
      toast.success("Customer updated successfully");
      loadCustomers();
    } catch (error) {
      toast.error("Failed to update customer");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.customer) return;
    try {
      await deleteCustomer(deleteDialog.customer.id);
      toast.success("Customer deleted successfully");
      setDeleteDialog({ isOpen: false, customer: null });
      setCurrentPage(1);
      loadCustomers();
    } catch (error) {
      toast.error("Failed to delete customer");
      console.error(error);
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (customer) => {
    setDeleteDialog({ isOpen: true, customer });
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCustomer(null);
  };

  const handleFormSubmit = async (data) => {
    if (editingCustomer) {
      await handleUpdate(editingCustomer.id, data);
    } else {
      await handleCreate(data);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
            <p className="text-slate-500 mt-1">Manage your customer</p>
          </div>
          <Button onClick={() => setIsFormOpen(true)} className="w-full sm:w-auto">
            <Plus className="w-4 h-4" />
            Add Customer
          </Button>
        </div>

        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {loading ? (
          <TableSkeleton />
        ) : (
          <>
            <CustomerTable
              customers={filteredCustomers}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      <CustomerForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        initialData={editingCustomer}
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, customer: null })}
        onConfirm={handleDelete}
        title="Delete Customer"
        message={`Are you sure you want to delete "${deleteDialog.customer?.full_name}"`}
        confirmText="Delete"
        danger
      />
    </MainLayout>
  );
}