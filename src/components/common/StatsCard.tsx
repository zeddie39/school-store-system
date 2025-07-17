import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  trend: string;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  color 
}) => {
  const isPositiveTrend = trend.startsWith('+');
  
  return (
    <Card className="stats-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">
              {title.toLowerCase().includes('cost') || title.toLowerCase().includes('value') || title.toLowerCase().includes('budget') 
                ? `KSH ${Number(value).toLocaleString()}` 
                : value}
            </p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <div className={`p-3 rounded-full bg-primary/10 ${color}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <span className={`text-sm font-medium ${
            isPositiveTrend ? 'text-success' : 'text-destructive'
          }`}>
            {trend}
          </span>
          <span className="text-sm text-muted-foreground ml-2">
            from last period
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;