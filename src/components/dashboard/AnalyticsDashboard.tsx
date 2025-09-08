import { MetricsCards } from "./MetricsCards";
import { AnalyticsCharts } from "./AnalyticsCharts";
import { CustomerTable } from "./CustomerTable";
import { OffersTable } from "./OffersTable";
import { NotesSection } from "./NotesSection";

export const AnalyticsDashboard = () => {
  return (
    <div className="space-y-6">
      <MetricsCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CustomerTable />
        <OffersTable />
      </div>
      <NotesSection />
    </div>
  );
};