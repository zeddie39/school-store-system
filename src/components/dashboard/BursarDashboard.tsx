import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard,
  FileText,
  Calculator,
  PieChart,
  Calendar,
  Download
} from 'lucide-react';
import StatsCard from '../common/StatsCard';

const BursarDashboard: React.FC = () => {
  const stats = [
    {
      title: "Total Budget",
      value: "$125,000",
      description: "Annual allocation",
      icon: DollarSign,
      trend: "+5%",
      color: "text-success"
    },
    {
      title: "Spent This Month",
      value: "$12,480",
      description: "Current spending",
      icon: TrendingDown,
      trend: "+8%",
      color: "text-destructive"
    },
    {
      title: "Remaining Budget",
      value: "$87,520",
      description: "Available funds",
      icon: TrendingUp,
      trend: "-3%",
      color: "text-primary"
    },
    {
      title: "Pending Payments",
      value: "$5,240",
      description: "Awaiting approval",
      icon: CreditCard,
      trend: "+2",
      color: "text-warning"
    }
  ];

  const expenses = [
    {
      id: 1,
      category: "Laboratory Equipment",
      amount: "$3,200",
      date: "2024-01-15",
      vendor: "Science Supply Co.",
      status: "paid",
      department: "Science Lab"
    },
    {
      id: 2,
      category: "Library Books",
      amount: "$1,800",
      date: "2024-01-14",
      vendor: "Academic Publishers",
      status: "pending",
      department: "Library"
    },
    {
      id: 3,
      category: "Kitchen Supplies",
      amount: "$950",
      date: "2024-01-13",
      vendor: "Food Service Inc.",
      status: "approved",
      department: "Kitchen"
    }
  ];

  const departmentBudgets = [
    { name: "Science Laboratory", allocated: "$25,000", spent: "$18,500", remaining: "$6,500", percentage: 74 },
    { name: "Library", allocated: "$15,000", spent: "$8,200", remaining: "$6,800", percentage: 55 },
    { name: "Sports", allocated: "$12,000", spent: "$9,100", remaining: "$2,900", percentage: 76 },
    { name: "Kitchen", allocated: "$20,000", spent: "$15,300", remaining: "$4,700", percentage: 77 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-success/10 text-success';
      case 'pending': return 'bg-warning/10 text-warning';
      case 'approved': return 'bg-info/10 text-info';
      default: return 'bg-muted/10 text-muted-foreground';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-destructive';
    if (percentage >= 60) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Bursar Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm">
            <Calculator className="w-4 h-4 mr-2" />
            Budget Analysis
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Department Budgets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Department Budget Overview
          </CardTitle>
          <CardDescription>
            Track spending across all departments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {departmentBudgets.map((dept, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{dept.name}</h3>
                  <Badge variant="outline">{dept.percentage}% Used</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                  <div>
                    <span className="text-muted-foreground">Allocated:</span>
                    <p className="font-medium">{dept.allocated}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Spent:</span>
                    <p className="font-medium">{dept.spent}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Remaining:</span>
                    <p className="font-medium">{dept.remaining}</p>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getProgressColor(dept.percentage)}`}
                    style={{ width: `${dept.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Expenses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Recent Expenses
          </CardTitle>
          <CardDescription>
            Latest financial transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expenses.map((expense) => (
              <div key={expense.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{expense.category}</p>
                    <p className="text-sm text-muted-foreground">{expense.department}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-lg">{expense.amount}</p>
                    <Badge className={getStatusColor(expense.status)}>
                      {expense.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Vendor:</span>
                    <p className="font-medium">{expense.vendor}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Date:</span>
                    <p className="font-medium">{expense.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {expense.date}
                  </div>
                  <div className="flex gap-2">
                    {expense.status === 'pending' && (
                      <Button size="sm">
                        <CreditCard className="w-4 h-4 mr-1" />
                        Process Payment
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BursarDashboard;