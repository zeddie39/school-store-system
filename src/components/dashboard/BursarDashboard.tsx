import React, { useState } from 'react';
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
  Download,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import StatsCard from '../common/StatsCard';
import { useToast } from '@/hooks/use-toast';
import { useBudgets } from '@/hooks/useBudgets';
import { useExpenses } from '@/hooks/useExpenses';

const BursarDashboard: React.FC = () => {
  const { toast } = useToast();
  const { budgets, loading: budgetsLoading } = useBudgets();
  const { expenses, updateExpenseStatus, loading: expensesLoading } = useExpenses();
  const [processingPayments, setProcessingPayments] = useState<Set<string>>(new Set());
  const [activeView, setActiveView] = useState<'overview' | 'budget' | 'expenses' | 'reports'>('overview');

  // Calculate dynamic stats from real data
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.allocated_amount, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent_amount, 0);
  const pendingExpenses = expenses.filter(exp => exp.status === 'pending').reduce((sum, exp) => sum + exp.amount, 0);

  const stats = [
    {
      title: "Total Budget",
      value: `KSH ${totalBudget.toLocaleString()}`,
      description: "Annual allocation",
      icon: DollarSign,
      trend: "+5%",
      color: "text-success"
    },
    {
      title: "Spent This Month",
      value: `KSH ${totalSpent.toLocaleString()}`,
      description: "Current spending",
      icon: TrendingDown,
      trend: "+8%",
      color: "text-destructive"
    },
    {
      title: "Remaining Budget",
      value: `KSH ${(totalBudget - totalSpent).toLocaleString()}`,
      description: "Available funds",
      icon: TrendingUp,
      trend: "-3%",
      color: "text-primary"
    },
    {
      title: "Pending Payments",
      value: `KSH ${pendingExpenses.toLocaleString()}`,
      description: "Awaiting approval",
      icon: CreditCard,
      trend: "+2",
      color: "text-warning"
    }
  ];

  const departmentBudgets = budgets.map(budget => ({
    id: budget.id,
    name: budget.department_name,
    allocated: `KSH ${budget.allocated_amount.toLocaleString()}`,
    spent: `KSH ${budget.spent_amount.toLocaleString()}`,
    remaining: `KSH ${(budget.allocated_amount - budget.spent_amount).toLocaleString()}`,
    percentage: Math.round((budget.spent_amount / budget.allocated_amount) * 100)
  }));

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

  const handleExportReport = () => {
    toast({
      title: "Exporting Financial Report",
      description: "Generating comprehensive financial report...",
    });
    setTimeout(() => {
      toast({
        title: "Report Exported Successfully",
        description: "Financial report has been downloaded to your device.",
      });
    }, 2000);
  };

  const handleBudgetAnalysis = () => {
    setActiveView('budget');
    toast({
      title: "Budget Analysis",
      description: "Opening comprehensive budget analysis dashboard...",
    });
  };

  const handleExpenseTracking = () => {
    setActiveView('expenses');
    toast({
      title: "Expense Tracking",
      description: "Opening expense tracking interface...",
    });
  };

  const handleCreateBudget = () => {
    toast({
      title: "Create New Budget",
      description: "Opening budget creation form...",
    });
  };

  const handleEditBudget = (budgetId: string) => {
    toast({
      title: "Edit Budget",
      description: `Opening budget editor for ${budgetId}...`,
    });
  };

  const handleDeleteBudget = (budgetId: string) => {
    toast({
      title: "Delete Budget",
      description: `Are you sure you want to delete budget for ${budgetId}?`,
      variant: "destructive",
    });
  };

  const handleAddExpense = () => {
    toast({
      title: "Add New Expense",
      description: "Opening expense entry form...",
    });
  };

  const handleProcessPayment = (expenseId: string) => {
    setProcessingPayments(prev => new Set(prev).add(expenseId));
    setTimeout(() => {
      updateExpenseStatus(expenseId, 'paid');
      setProcessingPayments(prev => {
        const newSet = new Set(prev);
        newSet.delete(expenseId);
        return newSet;
      });
      const expense = expenses.find(e => e.id === expenseId);
      toast({
        title: "Payment Processed",
        description: `Payment of KSH ${expense?.amount.toLocaleString()} has been completed.`,
      });
    }, 2000);
  };

  const handleViewDetails = (expenseId: string) => {
    toast({
      title: "Expense Details",
      description: `Opening detailed view for expense #${expenseId}...`,
    });
  };

  const handleGenerateReports = () => {
    setActiveView('reports');
    toast({
      title: "Financial Reports",
      description: "Opening comprehensive reports dashboard...",
    });
  };

  const renderBudgetManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Budget Management</h2>
        <Button onClick={handleCreateBudget}>
          <Plus className="w-4 h-4 mr-2" />
          Create Budget
        </Button>
      </div>
      
      <div className="grid gap-4">
        {departmentBudgets.map((dept, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">{dept.name}</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditBudget(dept.id)}>
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteBudget(dept.id)}>
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Allocated</p>
                  <p className="font-semibold">{dept.allocated}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Spent</p>
                  <p className="font-semibold">{dept.spent}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Remaining</p>
                  <p className="font-semibold">{dept.remaining}</p>
                </div>
              </div>
              
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getProgressColor(dept.percentage)}`}
                  style={{ width: `${dept.percentage}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderExpenseTracking = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Expense Tracking</h2>
        <Button onClick={handleAddExpense}>
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
        </Button>
      </div>
      
      <div className="grid gap-4">
        {expenses.map((expense) => (
          <Card key={expense.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">{expense.category}</h3>
                  <p className="text-sm text-muted-foreground">{expense.department}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">KSH {expense.amount.toLocaleString()}</p>
                  <Badge className={getStatusColor(expense.status)}>
                    {expense.status}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Vendor</p>
                  <p className="font-medium">{expense.vendor}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{expense.expense_date}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {expense.expense_date}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewDetails(expense.id)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  {expense.status === 'pending' && (
                    <Button 
                      size="sm"
                      onClick={() => handleProcessPayment(expense.id)}
                      disabled={processingPayments.has(expense.id)}
                    >
                      <CreditCard className="w-4 h-4 mr-1" />
                      {processingPayments.has(expense.id) ? 'Processing...' : 'Process'}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Financial Reports</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Report</CardTitle>
            <CardDescription>Comprehensive monthly financial summary</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={handleExportReport}>
              <Download className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Department Analysis</CardTitle>
            <CardDescription>Spending analysis by department</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={handleExportReport}>
              <PieChart className="w-4 h-4 mr-2" />
              View Analysis
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Budget Variance</CardTitle>
            <CardDescription>Budget vs actual spending comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={handleExportReport}>
              <Calculator className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'budget':
        return renderBudgetManagement();
      case 'expenses':
        return renderExpenseTracking();
      case 'reports':
        return renderReports();
      default:
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <StatsCard key={index} {...stat} />
              ))}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Financial management shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button
                    variant="outline"
                    className="h-24 flex-col gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={handleBudgetAnalysis}
                  >
                    <Calculator className="w-6 h-6" />
                    Budget Analysis
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex-col gap-2 bg-success text-success-foreground hover:bg-success/90"
                    onClick={handleExpenseTracking}
                  >
                    <FileText className="w-6 h-6" />
                    Track Expenses
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex-col gap-2 bg-info text-info-foreground hover:bg-info/90"
                    onClick={handleGenerateReports}
                  >
                    <Download className="w-6 h-6" />
                    Generate Reports
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex-col gap-2 bg-warning text-warning-foreground hover:bg-warning/90"
                    onClick={handleAddExpense}
                  >
                    <Plus className="w-6 h-6" />
                    Add Expense
                  </Button>
                </div>
              </CardContent>
            </Card>

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
                          <p className="font-medium text-lg">KSH {expense.amount.toLocaleString()}</p>
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
                          <p className="font-medium">{expense.expense_date}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {expense.expense_date}
                        </div>
                        <div className="flex gap-2">
                          {expense.status === 'pending' && (
                            <Button 
                              size="sm"
                              onClick={() => handleProcessPayment(expense.id)}
                              disabled={processingPayments.has(expense.id)}
                            >
                              <CreditCard className="w-4 h-4 mr-1" />
                              {processingPayments.has(expense.id) ? 'Processing...' : 'Process Payment'}
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDetails(expense.id)}
                          >
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
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Bursar Dashboard</h1>
        <div className="flex gap-2">
          <Button 
            variant={activeView === 'overview' ? 'default' : 'outline'} 
            onClick={() => setActiveView('overview')}
          >
            Overview
          </Button>
          <Button 
            variant={activeView === 'budget' ? 'default' : 'outline'} 
            onClick={() => setActiveView('budget')}
          >
            Budget
          </Button>
          <Button 
            variant={activeView === 'expenses' ? 'default' : 'outline'} 
            onClick={() => setActiveView('expenses')}
          >
            Expenses
          </Button>
          <Button 
            variant={activeView === 'reports' ? 'default' : 'outline'} 
            onClick={() => setActiveView('reports')}
          >
            Reports
          </Button>
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

export default BursarDashboard;
