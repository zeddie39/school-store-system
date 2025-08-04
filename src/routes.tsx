import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Index from '@/pages/Index';
import Register from '@/pages/Register';
import Stores from '@/pages/Stores';
import DepartmentPage from '@/pages/DepartmentPage';
import DepartmentDetails from '@/pages/DepartmentDetails';
import StoreDepartmentPage from '@/pages/StoreDepartmentPage';
import DepartmentReportPage from '@/pages/DepartmentReportPage';
import NotFound from '@/pages/NotFound';
import SupplierManagementPage from '@/pages/SupplierManagementPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Index />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/stores',
    element: <Stores />,
  },
  {
    path: '/suppliers',
    element: <SupplierManagementPage />,
  },
  {
    path: '/departments/:departmentId',
    element: <DepartmentPage />,
  },
  {
    path: '/departments/:departmentId/details',
    element: <DepartmentDetails />,
  },
  {
    path: '/stores/:storeId/department/:departmentName',
    element: <StoreDepartmentPage />,
  },
  {
    path: '/stores/reports/:departmentName',
    element: <DepartmentReportPage />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);