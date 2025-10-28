import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { SiteSettingsProvider } from './context/SiteSettingsContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './views/HomePage';
import ProjectsPage from './views/ProjectsPage';
import DashboardPage from './views/DashboardPage';
import AuthPage from './views/AuthPage';
import ProjectDetailsView from './views/ProjectDetailsView';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { UserRole } from './types';
import DepositPage from './views/DepositPage';
import WithdrawPage from './views/WithdrawPage'; // Import new view
import RegisterRoleSelectionPage from './views/RegisterRoleSelectionPage';
import RegisterPage from './views/RegisterPage';
import PhoneVerificationPage from './views/PhoneVerificationPage';
import VerificationPage from './views/VerificationPage';
import ProjectOwnerManageProjectView from './views/ProjectOwnerManageProjectView';
import MobileApp from './mobile_app/MobileApp';
import ServicesPage from './views/ServicesPage';
import ContactPage from './views/ContactPage';


function AppContent() {
  const { language, dir } = useLanguage();
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedTheme || (userPrefersDark ? 'dark' : 'light');
  });

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [language, dir]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  return (
    <Routes>
      {/* Mobile App Route */}
      <Route path="/mobile/*" element={<MobileApp theme={theme} toggleTheme={toggleTheme} />} />

      {/* Web App Routes */}
      <Route path="/*" element={
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-body text-text-light dark:text-text-dark">
          <Header toggleTheme={toggleTheme} theme={theme} />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/projets" element={<ProjectsPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/projet/:id" element={<ProjectDetailsView />} />
              
              {/* New Auth and Registration Flow */}
              <Route path="/connexion" element={<AuthPage />} />
              <Route path="/inscription" element={<RegisterRoleSelectionPage />} />
              <Route path="/inscription/:role" element={<RegisterPage />} />
              <Route path="/verification-telephone/:role" element={<PhoneVerificationPage />} />
              <Route path="/verification/:role" element={<VerificationPage />} />

              {/* Protected Routes */}
              <Route
                path="/depot"
                element={
                  <ProtectedRoute roles={[UserRole.INVESTOR]}>
                    <DepositPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/retrait"
                element={
                  <ProtectedRoute roles={[UserRole.INVESTOR, UserRole.PROJECT_OWNER]}>
                    <WithdrawPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute
                    roles={[
                      UserRole.INVESTOR,
                      UserRole.PROJECT_OWNER,
                      UserRole.SUPER_ADMIN,
                      UserRole.VALIDATOR_ADMIN,
                      UserRole.FINANCIAL_ADMIN,
                      UserRole.SERVICE_ADMIN,
                    ]}
                  >
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/projet/:id/gerer"
                element={
                  <ProtectedRoute roles={[UserRole.PROJECT_OWNER]}>
                    <ProjectOwnerManageProjectView />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      } />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <SiteSettingsProvider>
          <HashRouter>
            <AppContent />
          </HashRouter>
        </SiteSettingsProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
