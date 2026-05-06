import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Login            from './pages/auth/Login';
import Register         from './pages/auth/Register';
import ClientDashboard  from './pages/client/ClientDashboard';
import PostJob          from './pages/client/PostJob';
import MyJobs           from './pages/client/MyJobs';
import BrowseFreelancers from './pages/client/BrowseFreelancers';
import ViewProposals    from './pages/client/ViewProposals';
import CurrencyConverter from './pages/client/CurrencyConverter';

const PrivateRoute = ({ children }) => {
  const { token } = useSelector(s => s.auth);
  return token ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard"         element={<PrivateRoute><ClientDashboard /></PrivateRoute>} />
        <Route path="/post-job"          element={<PrivateRoute><PostJob /></PrivateRoute>} />
        <Route path="/my-jobs"           element={<PrivateRoute><MyJobs /></PrivateRoute>} />
        <Route path="/browse-freelancers" element={<PrivateRoute><BrowseFreelancers /></PrivateRoute>} />
        <Route path="/proposals/:jobId"  element={<PrivateRoute><ViewProposals /></PrivateRoute>} />
        <Route path="/currency"          element={<PrivateRoute><CurrencyConverter /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}