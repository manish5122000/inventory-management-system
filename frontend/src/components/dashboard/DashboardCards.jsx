import { Package, Users, ShoppingCart, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";

export default function DashboardCards({ summary }) {
  const cards = [
    {
      title: "Total Products",
      value: summary.total_products,
      icon: Package,
      color: "blue",
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Total Customers",
      value: summary.total_customers,
      icon: Users,
      color: "green",
      trend: "+8%",
      trendUp: true,
    },
    {
      title: "Total Orders",
      value: summary.total_orders,
      icon: ShoppingCart,
      color: "purple",
      trend: "+23%",
      trendUp: true,
    },
    {
      title: "Low Stock Items",
      value: summary.low_stock_products,
      icon: AlertTriangle,
      color: "orange",
      trend: "-5%",
      trendUp: false,
    },
  ];

  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      icon: "text-blue-600",
      border: "border-blue-200",
    },
    green: {
      bg: "bg-green-50",
      icon: "text-green-600",
      border: "border-green-200",
    },
    purple: {
      bg: "bg-purple-50",
      icon: "text-purple-600",
      border: "border-purple-200",
    },
    orange: {
      bg: "bg-orange-50",
      icon: "text-orange-600",
      border: "border-orange-200",
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const colors = colorClasses[card.color];
        return (
          <div
            key={card.title}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-lg ${colors.bg}`}>
                <Icon className={`w-6 h-6 ${colors.icon}`} />
              </div>
              <div className={`flex items-center gap-1 text-sm ${card.trendUp ? "text-green-600" : "text-red-600"}`}>
                {card.trendUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="font-medium">{card.trend}</span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-slate-500">{card.title}</h3>
              <p className="text-3xl font-bold text-slate-900 mt-1">{card.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}