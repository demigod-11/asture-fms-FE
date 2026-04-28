import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import DashboardLayout from '@/components/DashboardLayout';
import Dashboard from '@/components/Dashboard';
import Invoices from '@/components/Invoices';
import InvoiceDetail from '@/components/InvoiceDetail';
import Customers from '@/components/Customers';
import CreateInvoice from '@/components/CreateInvoice';
import SalesLedgerLayout from '@/components/SalesLedgerLayout';
import PurchaseLedgerLayout from '@/components/PurchaseLedgerLayout';
import Bills from '@/components/Bills';
import BillDetail from '@/components/BillDetail';
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
import TagsPage from '@/components/TagsPage';
import AuditLogPage from '@/components/settings/AuditLogPage';
import CoaCategoriesPage from '@/components/settings/CoaCategoriesPage';
import AcceptInvitationPage from '@/components/AcceptInvitationPage';
import AccountSettings from '@/components/AccountSettings';
import AccountSettingsLayout from '@/components/settings/AccountSettingsLayout';
import AdvancedSettingsLayout from '@/components/settings/AdvancedSettingsLayout';
import PersonalDetailsPage from '@/components/settings/PersonalDetailsPage';
import CompanyDetailsPage from '@/components/settings/CompanyDetailsPage';
import UsersPage from '@/components/UsersPage';
import IntegrationPage from '@/components/IntegrationPage';
import Home from '@/components/Home';
import Login from '@/components/Login';
import SignUp from '@/components/SignUp';
import VerifyEmail from '@/components/VerifyEmail';
import TermsOfServicePage from '@/components/TermsOfServicePage';
import OnboardingBusinessInfo from '@/components/onboarding/OnboardingBusinessInfo';
import StartFreeTrial from '@/components/onboarding/StartFreeTrial';
import ForgotPassword from '@/components/ForgotPassword';
import ResetPassword from '@/components/ResetPassword';
import ProtectedRoute from '@/components/ProtectedRoute';
import NotFound from '@/components/NotFound';
import { ProfileProvider } from '@/contexts/ProfileContext';
import { CurrencyProvider } from '@/contexts/CurrencyContext';

const App: React.FC = () => {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <Routes>
        {/* Auth routes (no auth required) */}
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/otp' element={<VerifyEmail />} />
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
        <Route path='/accept-invitation' element={<AcceptInvitationPage />} />

        {/* Single dashboard layout: one mount, profile loaded once and kept in state */}
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <ProfileProvider>
                <CurrencyProvider>
                  <DashboardLayout />
                </CurrencyProvider>
              </ProfileProvider>
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path='home' element={<Dashboard />} />

          <Route path='sales' element={<SalesLedgerLayout />}>
            <Route index element={<Navigate to='invoice' replace />} />
            <Route path='invoice' element={<Invoices />} />
            <Route path='invoice/:invoiceId' element={<InvoiceDetail />} />
            <Route path='invoice/:invoiceId/edit' element={<CreateInvoice />} />
            <Route path='invoice/new' element={<CreateInvoice />} />
            <Route path='customers' element={<Customers />} />
            <Route path='products' element={<Products />} />
          </Route>

          <Route path='purchase' element={<PurchaseLedgerLayout />}>
            <Route index element={<Navigate to='bills' replace />} />
            <Route path='bills' element={<Bills />} />
            <Route path='bills/:billId' element={<BillDetail />} />
            <Route path='vendor' element={<Vendors />} />
            <Route path='expense' element={<Expenses />} />
          </Route>

          <Route path='reports' element={<ReportsLayout />}>
            <Route index element={<Navigate to='profit-loss' replace />} />
            <Route path='profit-loss' element={<ReportProfitLoss />} />
            <Route path='balance-sheet' element={<ReportBalanceSheet />} />
            <Route path='ar-aging' element={<ReportARAgingSummary />} />
            <Route path='ap-aging' element={<ReportAPAgingSummary />} />
          </Route>

          <Route path='transactions' element={<TransactionsLayout />}>
            <Route
              index
              element={<Navigate to='bank-transactions' replace />}
            />
            <Route path='bank-transactions' element={<BankTransactions />} />
            <Route
              path='bank-reconciliation'
              element={<BankReconciliation />}
            />
            <Route path='reconcile' element={<ReconciliationStarted />} />
            <Route path='chart-of-accounts' element={<ChartOfAccounts />} />
          </Route>

          <Route path='users' element={<UsersPage />} />
          <Route path='integration' element={<IntegrationPage />} />
          <Route path='settings' element={<AccountSettingsLayout />}>
            <Route index element={<AccountSettings />} />
            <Route path='personal' element={<PersonalDetailsPage />} />
            <Route path='company' element={<CompanyDetailsPage />} />
            <Route path='audit-log' element={<AuditLogPage />} />
            <Route path='advanced' element={<AdvancedSettingsLayout />}>
              <Route index element={<Navigate to='tags' replace />} />
              <Route path='tags' element={<TagsPage />} />
              <Route path='coa-categories' element={<CoaCategoriesPage />} />
            </Route>
          </Route>
        </Route>

        <Route
          path='/welcome'
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path='/terms'
          element={
            <Layout>
              <TermsOfServicePage />
            </Layout>
          }
        />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
