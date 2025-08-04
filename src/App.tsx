import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DepartmentPage from "./pages/DepartmentPage";
import DepartmentDetails from "./pages/DepartmentDetails";
import StoreDepartmentPage from "./pages/StoreDepartmentPage";
import Index from "./pages/Index";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import StoresPage from "./pages/Stores";
import DepartmentReportPage from "./pages/DepartmentReportPage";
import SupplierManagementPage from "./pages/SupplierManagementPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/register" element={<Register />} />
          <Route path="/stores" element={<StoresPage />} />
          <Route path="/suppliers" element={<SupplierManagementPage />} />
          <Route path="/department-reports/:department" element={<DepartmentReportPage />} />
          <Route path="/departments/:id" element={<DepartmentPage />} />
          <Route path="/departments/:deptId" element={<DepartmentDetails />} />
          <Route path="/stores/:department" element={<StoreDepartmentPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
