import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const metrics = [
  {
    title: "Rewards Issued",
    value: "$1,200",
    className: "bg-gradient-card shadow-card",
  },
  {
    title: "Average 5% Back",
    value: "5%",
    className: "bg-gradient-card shadow-card",
  },
];

export const MetricsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {metrics.map((metric) => (
        <Card key={metric.title} className={metric.className}>
          <CardHeader className="pb-2">
            <CardTitle className="text-foreground font-medium">
              {metric.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground">
              {metric.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};