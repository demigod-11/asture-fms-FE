import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import Home from '@/components/Home';
import Login from '@/components/Login';
import NotFound from '@/components/NotFound';

const App: React.FC = () => {
  return (
    <div className='min-h-screen bg-gray-50'>
      <Routes>
        {/* Auth routes without layout */}
        <Route path='/login' element={<Login />} />

        {/* App routes with layout */}
        <Route
          path='/'
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path='/home'
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
