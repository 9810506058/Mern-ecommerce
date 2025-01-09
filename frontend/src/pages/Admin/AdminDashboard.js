import React from 'react';
import Layout from '../../components/Layouts/Layout';
import AdminMenu from './../../components/Layouts/AdminMenu';
import { useAuth } from '../../context/auth';

const AdminDashboard = () => {
  const [auth] = useAuth();

  return (
    <Layout>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="card p-3 w-70">
              <h1>{auth?.user?.name || "Welcome, Admin"}</h1>
              <h2>{auth?.user?.email}</h2>
              <h2>{auth?.user?.address}</h2>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
