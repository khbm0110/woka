import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import { NotificationProvider } from './context/NotificationContext.tsx';
import { SiteSettingsProvider } from './context/SiteSettingsContext.tsx';
import { LanguageProvider, useLanguage } from './context/LanguageContext.tsx';
import Header from './components/layout/Header.tsx';
import Footer from './components/layout/Footer.tsx';
import HomePage from './views/HomePage.tsx';
import ProjectsPage from './views/ProjectsPage.tsx';
import DashboardPage from './views/DashboardPage.tsx';
import AuthPage from './views/AuthPage.tsx';
import ProjectDetailsView from './views/ProjectDetailsView.tsx';
import ProtectedRoute from './components/auth/ProtectedRoute.tsx';
import { UserRole } from './types.ts';
import DepositPage from './views/DepositPage.tsx';
import WithdrawPage from './views/WithdrawPage.tsx'; // Import new view
import RegisterRoleSelectionPage from './views/RegisterRoleSelectionPage.tsx';
import RegisterPage from './views/RegisterPage.tsx';
import PhoneVerificationPage from './views/PhoneVerificationPage.tsx';
import VerificationPage from './views/VerificationPage.tsx';
import ProjectOwnerManageProjectView from './views/ProjectOwnerManageProjectView.tsx';
import MobileApp from './mobile_app/MobileApp.tsx';
import ServicesPage from './views/ServicesPage.tsx';
import ContactPage from './views/ContactPage.tsx';


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
    <LanguageProvider>
      <AuthProvider>
        <NotificationProvider>
          <SiteSettingsProvider>
            <HashRouter>
              <AppContent />
            </HashRouter>
          </SiteSettingsProvider>
        </NotificationProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;