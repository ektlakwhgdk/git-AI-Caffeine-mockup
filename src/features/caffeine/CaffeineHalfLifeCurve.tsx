import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface CaffeineHalfLifeCurveProps {
  currentAmount: number;
}

export function CaffeineHalfLifeCurve({ currentAmount }: CaffeineHalfLifeCurveProps) {
  // Caffeine half-life is approximately 5 hours
  // Generate data points for 12 hours
  const generateHalfLifeData = () => {
    const data = [];
    const halfLife = 5; // hours
    
    for (let hour = 0; hour <= 12; hour += 0.5) {
      const amount = currentAmount * Math.pow(0.5, hour / halfLife);
      data.push({
        hour,
        caffeine: Math.round(amount),
        label: hour === 0 ? 'Now' : `${hour}h`
      });
    }
    
    return data;
  };

  const data = generateHalfLifeData();
  const halfLifePoint = data.find(d => d.hour === 5);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span className="text-xs text-muted-foreground">카페인 반감기</span>
        </div>
        <span className="text-xs text-muted-foreground">
          5시간 후 {halfLifePoint?.caffeine}mg
        </span>
      </div>
      
      <ResponsiveContainer width="100%" height={80}>
        <AreaChart
          data={data}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <defs>
            <linearGradient id="caffeineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#5D3A1F" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#5D3A1F" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="hour" 
            tick={{ fontSize: 10, fill: '#6B5744' }}
            tickLine={false}
            axisLine={false}
            ticks={[0, 3, 6, 9, 12]}
            tickFormatter={(value) => `${value}h`}
          />
          <YAxis hide />
          <Area
            type="monotone"
            dataKey="caffeine"
            stroke="#5D3A1F"
            strokeWidth={2}
            fill="url(#caffeineGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
