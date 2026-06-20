import { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import DashboardCards from "../components/dashboard/DashboardCards";
import LowStockProducts from "../components/dashboard/LowStockProducts";
import { CardSkeleton } from "../components/ui/LoadingSkeleton";
import { getDashboardSummary } from "../api/dashboard";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const data = await getDashboardSummary();
      setSummary(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CardSkeleton />
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        </div>

        <DashboardCards summary={summary} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LowStockProducts lowStockProducts={summary?.low_stock_products_list || []} />
        </div>
      </div>
    </MainLayout>
  );
}