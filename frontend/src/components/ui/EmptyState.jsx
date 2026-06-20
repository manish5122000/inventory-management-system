import { Package, Users, ShoppingCart, AlertCircle } from "lucide-react";

const icons = {
  products: Package,
  customers: Users,
  orders: ShoppingCart,
  default: AlertCircle,
};

export default function EmptyState({ 
  type = "default", 
  title = "No data found", 
  description = "Get started by creating your first item.",
  action 
}) {
  const Icon = icons[type] || icons.default;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 mb-6 max-w-sm">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
