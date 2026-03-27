import React from 'react';
import { Instagram, Twitter, MessageCircle, ShoppingBag, Globe, Twitch, Send } from 'lucide-react';

const Links = () => {
  const socialLinks = [
    {
      name: 'Nuestra Tienda',
      url: '/',
      icon: <ShoppingBag className="w-5 h-5" />,
      highlight: true
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/gege.thebrand/',
      icon: <Instagram className="w-5 h-5" />
    },
    {
      name: 'WhatsApp',
      url: 'https://wa.me/51948124445',
      icon: <MessageCircle className="w-5 h-5" />
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@gege.thebrand',
      icon: <Send className="w-5 h-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-[#fce7f3] dark:bg-[#07020f] flex flex-col items-center py-12 px-6 transition-colors duration-500">
      {/* Profile Section */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-800 shadow-lg border-4 border-white dark:border-gray-700 flex items-center justify-center mb-4 overflow-hidden">
          {/* Logo Branding */}
          <div className="text-center flex flex-col items-center justify-center">
            <span className="block text-[1.2rem] font-serif font-bold tracking-tight leading-none text-black dark:text-white">GEGE</span>
            <span className="block text-[0.35rem] font-sans font-bold tracking-[0.2em] text-black dark:text-white">THE BRAND</span>
          </div>
        </div>
        <h1 className="text-xl font-header font-bold uppercase tracking-widest text-black dark:text-white mb-2">
          GEGE THE BRAND
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-xs font-medium">
          ✨ Estilo & Esencia • Nueva Colección Disponible ✨
        </p>
      </div>


      {/* Links List */}
      <div className="w-full max-w-md space-y-4">
        {socialLinks.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target={link.url.startsWith('http') ? "_blank" : "_self"}
            rel="noopener noreferrer"
            className={`flex items-center justify-between w-full p-4 rounded-full transition-all duration-300 shadow-sm hover:shadow-md border border-white/20 hover:scale-[1.02] ${
              link.highlight 
                ? 'bg-black text-white dark:bg-white dark:text-black font-bold ring-2 ring-black/10' 
                : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm text-black dark:text-white'
            }`}
          >
            <div className="w-10">
              {link.icon}
            </div>
            <span className="flex-1 text-center font-bold tracking-wide uppercase text-sm">
              {link.name}
            </span>
            <div className="w-10"></div>
          </a>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-auto pt-12 pb-4">
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-white/20">
          <p className="text-[10px] font-bold tracking-widest text-gray-400 dark:text-gray-500 uppercase">
            gegethebrand.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default Links;
