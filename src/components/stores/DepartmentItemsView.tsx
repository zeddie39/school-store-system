
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Package, 
  Search,
  Filter,
  Plus
} from 'lucide-react';
import { useStores } from '@/hooks/useStores';
import DepartmentDropdown from './DepartmentDropdown';
import AddItemDialog from '../items/AddItemDialog';

const DepartmentItemsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openDepartments, setOpenDepartments] = useState<Set<string>>(new Set());
  const [addItemOpen, setAddItemOpen] = useState(false);
  const { stores } = useStores();

  // Get unique departments
  const departments = React.useMemo(() => {
    const deptTypes = [...new Set(stores.map(store => store.store_type))];
    return deptTypes.map(type => ({
      value: type,
      label: type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
    }));
  }, [stores]);

  // Filter departments based on search
  const filteredDepartments = departments.filter(dept =>
    dept.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDepartment = (deptValue: string) => {
    const newOpen = new Set(openDepartments);
    if (newOpen.has(deptValue)) {
      newOpen.delete(deptValue);
    } else {
      newOpen.add(deptValue);
    }
    setOpenDepartments(newOpen);
  };

  const expandAll = () => {
    setOpenDepartments(new Set(departments.map(d => d.value)));
  };

  const collapseAll = () => {
    setOpenDepartments(new Set());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Department Inventory Management
              </CardTitle>
              <CardDescription>
                Click on departments to view items with real-time usage tracking
              </CardDescription>
            </div>
            <Button onClick={() => setAddItemOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={expandAll}>
                Expand All
              </Button>
              <Button variant="outline" size="sm" onClick={collapseAll}>
                Collapse All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Department Dropdowns */}
      <div className="space-y-4">
        {filteredDepartments.map((department) => (
          <DepartmentDropdown
            key={department.value}
            department={department.value}
            departmentLabel={department.label}
            isOpen={openDepartments.has(department.value)}
            onToggle={() => toggleDepartment(department.value)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredDepartments.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">No Departments Found</h3>
            <p className="text-muted-foreground text-center">
              {searchTerm ? 'No departments match your search.' : 'No departments available.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Add Item Dialog */}
      <AddItemDialog 
        open={addItemOpen} 
        onOpenChange={setAddItemOpen}
      />
    </div>
  );
};

export default DepartmentItemsView;
