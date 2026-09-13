import { Navigate, Route, HashRouter, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { PackagesPage } from './pages/PackagesPage';
import { GuideRitualsPage } from './pages/GuideRitualsPage';
import { GuideStepsPage } from './pages/GuideStepsPage';
import { DuasPage } from './pages/DuasPage';
import { PackingPage } from './pages/PackingPage';
import { VaccinesPage } from './pages/VaccinesPage';
import { NewsPage } from './pages/NewsPage';
import { NusukLinksPage } from './pages/NusukLinksPage';
import { FaqPage } from './pages/FaqPage';
import { ServicesPage } from './pages/ServicesPage';
import { EbooksPage } from './pages/EbooksPage';
import { ContactPage } from './pages/ContactPage';
import { EnquiriesPage } from './pages/EnquiriesPage';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RequireAuth><Layout /></RequireAuth>}>
        <Route path="/" element={<Navigate to="/packages" replace />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/guide-rituals" element={<GuideRitualsPage />} />
        <Route path="/guide-steps" element={<GuideStepsPage />} />
        <Route path="/duas" element={<DuasPage />} />
        <Route path="/packing" element={<PackingPage />} />
        <Route path="/vaccines" element={<VaccinesPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/nusuk-links" element={<NusukLinksPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/ebooks" element={<EbooksPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/enquiries" element={<EnquiriesPage />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  );
}
