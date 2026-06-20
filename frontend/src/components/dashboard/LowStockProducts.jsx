import { AlertTriangle, Package } from "lucide-react";

export default function LowStockProducts({ lowStockProducts }) {
  if (!lowStockProducts || lowStockProducts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-50 rounded-lg">
            <Package className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Low Stock Products</h3>
        </div>
        <p className="text-slate-500 text-sm">No products are running low on stock.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-orange-50 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Low Stock Products</h3>
      </div>
      <div className="space-y-3">
        {lowStockProducts.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200"
          >
            <div className="flex-1">
              <p className="font-medium text-slate-900">{product.name}</p>
              <p className="text-sm text-slate-500">SKU: {product.sku}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-orange-600">{product.stock_quantity}</p>
              <p className="text-xs text-slate-500">units left</p>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-500 mt-4">
        * Products with less than 5 units in stock
      </p>
    </div>
  );
}
