import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Lenis from 'lenis';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import CartDrawer from './components/Cart/CartDrawer';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import WhatsAppBubble from './components/WhatsAppBubble/WhatsAppBubble';
import AdminLogin from './components/Admin/AdminLogin';
import AdminDashboard from './components/Admin/AdminDashboard';
import OrderReceipt from './components/Admin/OrderReceipt';
import EmployeeLogin from './components/Admin/EmployeeLogin';
import EmployeeRegister from './components/Admin/EmployeeRegister';
import EmployeeDashboard from './components/Admin/EmployeeDashboard';
import Wishlist from './pages/Wishlist';
import SharedWishlist from './pages/SharedWishlist';
import Links from './pages/Links';
import Nosotros from './pages/Nosotros';
import Sale from './pages/Sale';

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/employee');
  const isLinksRoute = location.pathname === '/links';
  const isIsolatedRoute = isAdminRoute || isLinksRoute;

  useEffect(() => {
    // Initialize Lenis for buttery smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Make lenis globally available so Header.jsx can use lenis.scrollTo
    window.lenis = lenis;

    return () => {
      lenis.destroy();
      window.lenis = null;
    };
  }, []);

  // Handle cross-page hash navigation and scroll-to-top
  useEffect(() => {
    // If we are on the homepage
    if (location.pathname === '/') {
      if (location.hash) {
        // Scroll to specific section
        const scrollToElement = (retryCount = 0) => {
          const id = location.hash.replace('#', '');
          const el = document.getElementById(id);
          
          if (el) {
            // Give extra frame for layout to settle
            requestAnimationFrame(() => {
              if (window.lenis) {
                // Landing at -140 looks cleaner with the fixed header and section padding
                window.lenis.scrollTo(el, { offset: -140, duration: 1.5 });
              } else {
                const headerOffset = 140;
                const elementPosition = el.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
              }
            });
          } else if (retryCount < 10) {
            // Be more persistent (up to 1 second)
            setTimeout(() => scrollToElement(retryCount + 1), 100);
          }
        };

        // Start checking after a small initial delay
        setTimeout(() => scrollToElement(0), 100);
      } else {
        // Scroll to top of homepage when no hash
        if (window.lenis) {
          window.lenis.scrollTo(0, { duration: 1.2 });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    }
  }, [location.pathname, location.hash]);

  return (
    <div className={`flex flex-col min-h-screen font-body transition-colors duration-500 ${!isIsolatedRoute ? 'bg-secondary dark:bg-[#07020f] text-primary dark:text-gray-100' : (isAdminRoute ? 'bg-gray-50 text-primary' : '')}`}>
      {!isIsolatedRoute && <Header />}
      {!isIsolatedRoute && <CartDrawer />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/receipt/:id" element={<OrderReceipt />} />
          <Route path="/employee" element={<Navigate to="/employee/login" replace />} />
          <Route path="/employee/login" element={<EmployeeLogin />} />
          <Route path="/employee/register" element={<EmployeeRegister />} />
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/wishlist/shared" element={<SharedWishlist />} />
          <Route path="/links" element={<Links />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/sale" element={<Sale />} />
        </Routes>
      </main>
      {!isIsolatedRoute && <Footer />}
      {!isIsolatedRoute && <WhatsAppBubble />}
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <Router>
              <AppContent />
            </Router>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
