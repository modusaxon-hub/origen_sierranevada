import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './shared/components/Header';
import ChatWidget from './shared/components/ChatWidget';
import { ProtectedRoute } from './features/auth';
import Logo from './shared/components/Logo';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import CookieBanner from './shared/components/CookieBanner';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const SubscriptionPage = lazy(() => import('./pages/SubscriptionPage'));
const BrewingGuidePage = lazy(() => import('./pages/BrewingGuidePage'));
const AiLabPage = lazy(() => import('./pages/AiLabPage'));
const LoginPage = lazy(() => import('./features/auth/pages/LoginPage'));
const ForgotPasswordPage = lazy(() => import('./features/auth/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./features/auth/pages/ResetPasswordPage'));
const Brandbook = lazy(() => import('./pages/Brandbook'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ProductManager = lazy(() => import('./pages/ProductManager'));
const UserManager = lazy(() => import('./pages/UserManager'));
const RegisterPage = lazy(() => import('./features/auth/pages/RegisterPage'));

const Catalog = lazy(() => import('./features/catalog/pages/CatalogPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderManager = lazy(() => import('./pages/OrderManager'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const MyOrdersPage = lazy(() => import('./pages/MyOrdersPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const TrackOrderPage = lazy(() => import('./pages/TrackOrderPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const InvoicePrototype = lazy(() => import('./components/Invoice/InvoicePrototype'));

// Loading Placeholder
const PageLoader = () => (
    <div className="min-h-screen bg-[#050806] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#C5A065]/20 border-t-[#C5A065] rounded-full animate-spin mb-4"></div>
        <Logo className="w-[240px] h-auto opacity-70" />
    </div>
);

// Scroll to top wrapper
const ScrollToTop = () => {
    const { pathname } = useLocation();
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <LanguageProvider>
                <CartProvider>
                    <HashRouter>
                        <ScrollToTop />
                        <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark font-body transition-colors duration-300">
                            <Header />
                            <Suspense fallback={<PageLoader />}>
                                <Routes>
                                    <Route path="/" element={<HomePage />} />
                                    <Route path="/subscription" element={<SubscriptionPage />} />
                                    <Route path="/guide" element={<BrewingGuidePage />} />
                                    <Route path="/ai-lab" element={<AiLabPage />} />
                                    <Route path="/catalog" element={<Catalog />} />
                                    <Route path="/login" element={<LoginPage />} />
                                    <Route path="/register" element={<RegisterPage />} />
                                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                                    <Route path="/checkout" element={<CheckoutPage />} />
                                    <Route path="/privacy" element={<PrivacyPolicyPage />} />
                                    <Route path="/terms" element={<TermsPage />} />
                                    <Route path="/track/:orderId" element={<TrackOrderPage />} />
                                    <Route path="/contact" element={<ContactPage />} />
                                    <Route path="/preview/invoice" element={<InvoicePrototype />} />

                                    {/* Customer Routes */}
                                    <Route path="/my-orders" element={
                                        <ProtectedRoute requireAdmin={false}>
                                            <MyOrdersPage />
                                        </ProtectedRoute>
                                    } />
                                    <Route path="/account" element={
                                        <ProtectedRoute requireAdmin={false}>
                                            <UserDashboard />
                                        </ProtectedRoute>
                                    } />

                                    {/* Protected Routes */}
                                    <Route
                                        path="/admin"
                                        element={
                                            <ProtectedRoute requireAdmin={true}>
                                                <AdminDashboard />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/admin/products"
                                        element={
                                            <ProtectedRoute requireAdmin={true}>
                                                <ProductManager />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/admin/users"
                                        element={
                                            <ProtectedRoute requireAdmin={true}>
                                                <UserManager />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/admin/orders"
                                        element={
                                            <ProtectedRoute requireAdmin={true}>
                                                <OrderManager />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/brandbook"
                                        element={
                                            <ProtectedRoute requireAdmin={true}>
                                                <Brandbook />
                                            </ProtectedRoute>
                                        }
                                    />
                                </Routes>
                            </Suspense>
                            <ChatWidget />
                            <CookieBanner />
                        </div>
                    </HashRouter>
                </CartProvider>
            </LanguageProvider>
        </AuthProvider>
    );
};

export default App;
