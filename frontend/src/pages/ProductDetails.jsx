import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { ArrowLeft, Package, DollarSign, AlertTriangle, Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { getProductById, deleteProduct } from "../api/products";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await getProductById(id);
      setProduct(data);
    } catch (error) {
      toast.error("Failed to load product details");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return;
    }
    try {
      await deleteProduct(id);
      toast.success("Product deleted successfully");
      navigate("/products");
    } catch (error) {
      toast.error("Failed to delete product");
      console.error(error);
    }
  };

  const isLowStock = (quantity) => Number(quantity) <= 10;

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

  if (!product) {
    return (
      <MainLayout>
        <div className="text-center py-16">
          <p className="text-slate-500">Product not found</p>
          <Button onClick={() => navigate("/products")} className="mt-4">
            Back to Products
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/products")}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Product #{product.id}</h1>
              <p className="text-slate-500 mt-1">Product information</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Product Name</p>
                <p className="font-semibold text-slate-900">{product.name}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Price</p>
                <p className="font-semibold text-slate-900">₹{Number(product.price).toFixed(2)}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isLowStock(product.stock_quantity) ? "bg-orange-100" : "bg-purple-100"}`}>
                <Package className={`w-5 h-5 ${isLowStock(product.stock_quantity) ? "text-orange-600" : "text-purple-600"}`} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Stock Quantity</p>
                <div className="flex items-center gap-2">
                  <p className={`font-semibold ${isLowStock(product.stock_quantity) ? "text-orange-600" : "text-slate-900"}`}>
                    {product.stock_quantity}
                  </p>
                  {isLowStock(product.stock_quantity) && (
                    <AlertTriangle className="w-4 h-4 text-orange-500" title="Low stock" />
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <Package className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">SKU</p>
                <p className="font-semibold text-slate-900">{product.sku || "-"}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
