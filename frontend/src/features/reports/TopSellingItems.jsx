import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MotionDiv = motion.div;
function TopSellingItems({ reports }) {
  const items = reports?.topSellingItems || [];

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">
          Top Selling Items
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {items.map((item, index) => (
            <MotionDiv
              key={item._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary text-primary-foreground font-semibold text-sm">
                  {index + 1}
                </span>

                <div>
                  <p className="font-medium">{item._id}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.totalSold} sold out
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold">
                  ${Number(item.revenue).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">revenue</p>
              </div>
            </MotionDiv>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default TopSellingItems;
