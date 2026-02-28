import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import DashboardLayout from '@/components/DashboardLayout';
import Dashboard from '@/components/Dashboard';
import Invoices from '@/components/Invoices';
import Home from '@/components/Home';
import Login from '@/components/Login';
import SignUp from '@/components/SignUp';
import VerifyEmail from '@/components/VerifyEmail';
import ForgotPassword from '@/components/ForgotPassword';
import ResetPassword from '@/components/ResetPassword';
import ProtectedRoute from '@/components/ProtectedRoute';
import NotFound from '@/components/NotFound';

const App: React.FC = () => {
  return (
    <div className='min-h-screen bg-gray-50'>
      <Routes>
        {/* Auth routes (no auth required) */}
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/verify-email' element={<VerifyEmail />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />

        {/* Protected app routes → dashboard */}
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path='/home'
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path='/sales/invoice'
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Invoices />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path='/sales/customers'
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <div className='p-4'>
                  <h1 className='text-2xl font-bold text-gray-900'>Customers</h1>
                  <p className='text-gray-500 mt-2'>Customers page — coming soon.</p>
                </div>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path='/welcome'
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route path='/terms' element={<Navigate to='/login' replace />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
