import { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import ProductForm from "../components/products/ProductForm";
import ProductTable from "../components/products/ProductTable";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import Pagination from "../components/ui/Pagination";
import Button from "../components/ui/Button";
import { TableSkeleton } from "../components/ui/LoadingSkeleton";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import { getProducts, createProduct, deleteProduct, updateProduct } from "../api/products";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, product: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadProducts();
  }, [currentPage]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts(currentPage, 10);
      setProducts(data.data || data);
      setTotalPages(data.total_pages || 1);
    } catch (error) {
      toast.error("Failed to load products");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (payload) => {
    try {
      await createProduct(payload);
      toast.success("Product created successfully");
      setCurrentPage(1);
      loadProducts();
    } catch (error) {
      toast.error("Failed to create product");
      console.error(error);
    }
  };

  const handleUpdate = async (id, payload) => {
    try {
      await updateProduct(id, payload);
      toast.success("Product updated successfully");
      loadProducts();
    } catch (error) {
      toast.error("Failed to update product");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.product) return;
    try {
      await deleteProduct(deleteDialog.product.id);
      toast.success("Product deleted successfully");
      setDeleteDialog({ isOpen: false, product: null });
      setCurrentPage(1);
      loadProducts();
    } catch (error) {
      toast.error("Failed to delete product");
      console.error(error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (product) => {
    setDeleteDialog({ isOpen: true, product });
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleFormSubmit = async (data) => {
    if (editingProduct) {
      await handleUpdate(editingProduct.id, data);
    } else {
      await handleCreate(data);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Products</h1>
            <p className="text-slate-500 mt-1">Manage your product </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)} className="w-full sm:w-auto">
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </div>

        {loading ? (
          <TableSkeleton />
        ) : (
          <>
            <ProductTable
              products={products}
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

      <ProductForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        initialData={editingProduct}
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, product: null })}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteDialog.product?.name}"`}
        confirmText="Delete"
        danger
      />
    </MainLayout>
  );
}