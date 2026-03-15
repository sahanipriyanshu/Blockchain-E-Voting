import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Elections from './pages/Elections';
import ElectionDetail from './pages/ElectionDetail';
import Blockchain from './pages/Blockchain';
import AdminPanel from './pages/AdminPanel';
import Results from './pages/Results';
import { Toaster } from 'sonner';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/elections"
                element={
                  <PrivateRoute>
                    <Elections />
                  </PrivateRoute>
                }
              />
              <Route
                path="/elections/:id"
                element={
                  <PrivateRoute>
                    <ElectionDetail />
                  </PrivateRoute>
                }
              />
              <Route
                path="/blockchain"
                element={
                  <PrivateRoute>
                    <Blockchain />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <PrivateRoute adminOnly>
                    <AdminPanel />
                  </PrivateRoute>
                }
              />
              <Route
                path="/results"
                element={
                  <PrivateRoute>
                    <Results />
                  </PrivateRoute>
                }
              />
            </Routes>
            <Toaster
              position="top-center"
              expand={true}
              richColors={true}
              closeButton={true}
              duration={4000}
              toastOptions={{
                classNames: {
                  toast: 'glass-toast-sonner',
                  title: 'toast-title',
                  description: 'toast-description',
                  actionButton: 'toast-action-button',
                  cancelButton: 'toast-cancel-button',
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

