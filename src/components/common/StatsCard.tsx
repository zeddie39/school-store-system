
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
  
  // Check if the value should be displayed as currency
  const shouldDisplayAsCurrency = title.toLowerCase().includes('cost') || 
                                  title.toLowerCase().includes('value') || 
                                  title.toLowerCase().includes('budget') ||
                                  title.toLowerCase().includes('expense') ||
                                  title.toLowerCase().includes('amount');
  
  const displayValue = shouldDisplayAsCurrency 
    ? `KSH ${Number(value).toLocaleString()}` 
    : value;
  
  return (
    <Card className="stats-card hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">
              {displayValue}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
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
