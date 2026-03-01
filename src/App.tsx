import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import DashboardLayout from '@/components/DashboardLayout';
import Dashboard from '@/components/Dashboard';
import Invoices from '@/components/Invoices';
import Customers from '@/components/Customers';
import CreateInvoice from '@/components/CreateInvoice';
import SalesLedgerLayout from '@/components/SalesLedgerLayout';
import PurchaseLedgerLayout from '@/components/PurchaseLedgerLayout';
import Bills from '@/components/Bills';
import Vendors from '@/components/Vendors';
import Expenses from '@/components/Expenses';
import Products from '@/components/Products';
import ReportsLayout from '@/components/ReportsLayout';
import ReportProfitLoss from '@/components/reports/ReportProfitLoss';
import ReportBalanceSheet from '@/components/reports/ReportBalanceSheet';
import ReportARAgingSummary from '@/components/reports/ReportARAgingSummary';
import ReportAPAgingSummary from '@/components/reports/ReportAPAgingSummary';
import TransactionsLayout from '@/components/TransactionsLayout';
import BankTransactions from '@/components/transactions/BankTransactions';
import BankReconciliation from '@/components/transactions/BankReconciliation';
import ReconciliationStarted from '@/components/transactions/ReconciliationStarted';
import ChartOfAccounts from '@/components/transactions/ChartOfAccounts';
import AccountSettings from '@/components/AccountSettings';
import UsersPage from '@/components/UsersPage';
import IntegrationPage from '@/components/IntegrationPage';
import Home from '@/components/Home';
import Login from '@/components/Login';
import SignUp from '@/components/SignUp';
import VerifyEmail from '@/components/VerifyEmail';
import OnboardingBusinessInfo from '@/components/onboarding/OnboardingBusinessInfo';
import StartFreeTrial from '@/components/onboarding/StartFreeTrial';
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
        <Route
          path='/onboarding/business'
          element={
            <ProtectedRoute>
              <OnboardingBusinessInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path='/onboarding/start-trial'
          element={
            <ProtectedRoute>
              <StartFreeTrial />
            </ProtectedRoute>
          }
        />
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

        {/* Sales ledger: Invoice + Customers (no Overview) */}
        <Route
          path='/sales'
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <SalesLedgerLayout />
              </DashboardLayout>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to='/sales/invoice' replace />} />
          <Route path='invoice' element={<Invoices />} />
          <Route path='invoice/new' element={<CreateInvoice />} />
          <Route path='customers' element={<Customers />} />
          <Route path='products' element={<Products />} />
        </Route>

        {/* Purchase ledger: Bills + Vendor */}
        <Route
          path='/purchase'
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <PurchaseLedgerLayout />
              </DashboardLayout>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to='/purchase/bills' replace />} />
          <Route path='bills' element={<Bills />} />
          <Route path='vendor' element={<Vendors />} />
          <Route path='expense' element={<Expenses />} />
        </Route>

        {/* Reports: Profit & loss, Balance sheet, A/R aging, A/P aging */}
        <Route
          path='/reports'
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ReportsLayout />
              </DashboardLayout>
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={<Navigate to='/reports/profit-loss' replace />}
          />
          <Route path='profit-loss' element={<ReportProfitLoss />} />
          <Route path='balance-sheet' element={<ReportBalanceSheet />} />
          <Route path='ar-aging' element={<ReportARAgingSummary />} />
          <Route path='ap-aging' element={<ReportAPAgingSummary />} />
        </Route>

        {/* Transactions: Bank transactions, Bank reconciliation, Chart of accounts */}
        <Route
          path='/transactions'
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <TransactionsLayout />
              </DashboardLayout>
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={<Navigate to='/transactions/bank-transactions' replace />}
          />
          <Route path='bank-transactions' element={<BankTransactions />} />
          <Route path='bank-reconciliation' element={<BankReconciliation />} />
          <Route path='reconcile' element={<ReconciliationStarted />} />
          <Route path='chart-of-accounts' element={<ChartOfAccounts />} />
        </Route>

        {/* Management: Users, Integration, Settings */}
        <Route
          path='/users'
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <UsersPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path='/integration'
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <IntegrationPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path='/settings'
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AccountSettings />
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
