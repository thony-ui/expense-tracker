"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const categoryData = [
  { name: "Food & Dining", value: 850, color: "#FF6B6B" },
  { name: "Transportation", value: 620, color: "#4ECDC4" },
  { name: "Shopping", value: 480, color: "#45B7D1" },
  { name: "Entertainment", value: 350, color: "#96CEB4" },
  { name: "Bills & Utilities", value: 420, color: "#FFEAA7" },
  { name: "Healthcare", value: 180, color: "#DDA0DD" },
];

export function CategoryChart() {
  const total = categoryData.reduce((sum, item) => sum + item.value, 0);
  const maxValue = Math.max(...categoryData.map((item) => item.value));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Categories</CardTitle>
        <p className="text-sm text-muted-foreground">
          Breakdown of expenses by category
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Bar Chart */}
          <div className="space-y-4">
            {categoryData.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">${item.value}</span>
                    <span className="text-xs text-gray-500">
                      ({((item.value / total) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${(item.value / maxValue) * 100}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Pie Chart */}
          <div className="flex justify-center py-4">
            <div className="relative w-48 h-48">
              {categoryData.map((item, index, array) => {
                // Calculate the pie segments
                const percentage = item.value / total;
                let startAngle = 0;
                for (let i = 0; i < index; i++) {
                  startAngle += (array[i].value / total) * 360;
                }
                const endAngle = startAngle + percentage * 360;

                // Convert to radians
                const startRad = (startAngle - 90) * (Math.PI / 180);
                const endRad = (endAngle - 90) * (Math.PI / 180);

                // Calculate the path
                const x1 = 96 + 96 * Math.cos(startRad);
                const y1 = 96 + 96 * Math.sin(startRad);
                const x2 = 96 + 96 * Math.cos(endRad);
                const y2 = 96 + 96 * Math.sin(endRad);

                // Determine if the arc should be drawn as a large arc
                const largeArcFlag = percentage > 0.5 ? 1 : 0;

                // Create the SVG path
                const path = `M 96 96 L ${x1} ${y1} A 96 96 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

                return (
                  <svg
                    key={item.name}
                    className="absolute top-0 left-0 w-full h-full"
                    viewBox="0 0 192 192"
                  >
                    <path d={path} fill={item.color} />
                  </svg>
                );
              })}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full w-16 h-16 flex items-center justify-center">
                <span className="text-sm font-medium">${total}</span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="text-sm text-center">
            <p className="font-medium">
              Total Monthly Expenses: ${total.toLocaleString()}
            </p>
            <p className="text-gray-500">
              Largest category:{" "}
              {categoryData.sort((a, b) => b.value - a.value)[0].name}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
