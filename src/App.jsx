import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import CartDrawer from './components/Cart/CartDrawer';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import WhatsAppBubble from './components/WhatsAppBubble/WhatsAppBubble';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-secondary font-body text-primary">
          <Header />
          <CartDrawer />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetail />} />
            </Routes>
          </main>
          <Footer />
          <WhatsAppBubble />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
