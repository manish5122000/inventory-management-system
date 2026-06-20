import { Edit, Trash2, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";

export default function ProductTable({ products, onEdit, onDelete }) {
  const navigate = useNavigate();
  const isLowStock = (quantity) => Number(quantity) <= 10;

  const safeProducts = (() => {
    if (Array.isArray(products)) return products;
    if (Array.isArray(products?.data)) return products.data;
    return [];
  })();

  if (!safeProducts.length) {
    return (
      <EmptyState
        type="products"
        title="No products found"
        description="Get started by adding your first product to the inventory."
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
              Product Name
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
              SKU
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Stock
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {safeProducts.map((product) => (
            <tr key={product?.id} className="hover:bg-slate-50 transition-colors">
              
              <td className="px-6 py-4">
                <div 
                  className="font-medium text-slate-900 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => navigate(`/products/${product?.id}`)}
                >
                  {product?.name || "N/A"}
                </div>
              </td>

              <td className="px-6 py-4">
                <span className="text-slate-600 font-mono text-sm">
                  {product?.sku || "-"}
                </span>
              </td>

              <td className="px-6 py-4">
                <span className="font-semibold text-slate-900">
                  ₹{Number(product?.price || 0).toFixed(2)}
                </span>
              </td>

              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-medium px-2.5 py-1 rounded-full text-sm ${
                      isLowStock(product?.stock_quantity)
                        ? "text-orange-600 bg-orange-50"
                        : "text-green-600 bg-green-50"
                    }`}
                  >
                    {product?.stock_quantity ?? 0}
                  </span>

                  {isLowStock(product?.stock_quantity) && (
                    <AlertTriangle
                      className="w-4 h-4 text-orange-500"
                      title="Low stock"
                    />
                  )}
                </div>
              </td>

              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit?.(product)}
                    className="text-slate-600 hover:text-blue-600"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete?.(product)}
                    className="text-slate-600 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>

                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}