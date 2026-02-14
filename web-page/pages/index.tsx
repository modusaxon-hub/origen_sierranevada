/* eslint-disable no-undef */
// Access Globals provided by UMD scripts
const { createContext, useState, useContext, useEffect, useRef } = React;
const { HashRouter, Routes, Route, useNavigate, useLocation, Link } = ReactRouterDOM;
const ReactDOM = window.ReactDOM;

// SVG Logo Component
// Extracted from La-firma-de-la-tierra.svg
const LogoSVG = ({ className, color = "currentColor" }) => (
  <svg id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 120" className={className} fill={color} style={{ fill: color }}>
    {/* ORIGEN - Playfair Display Black (900) - Perfect side-to-side justification */}
    <text
      x="330" y="50"
      textLength="340"
      lengthAdjust="spacing"
      style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '48px' }}
    >
      ORIGEN
    </text>

    {/* Mountain Path (Isotipo) - Shifted left to avoid clashing with text */}
    <g transform="translate(10, 15)">
      <path d="M159.69,19.09c-2.13-2.43-6.04-6.75-8.84-8.45-1.9-1.15-5.63,1.79-7.24,2.89-8.37,5.69-15.05,13.62-23,19.6-2.68,2.01-4.59,2.48-7.34,3.98-4.34,2.35-10.26,10.86-14.83,11.24-3.39.29-5.46-2.09-7.91-4.03-5.83-4.62-8.23-8.44-16.06-3.38-5.07,3.28-9.78,8.31-14.49,12.14-15.16,12.29-33.53,23.97-53.97,25.94-.53.05-3.33.3-3.51.17-.51-.35-.23-1.62-.29-2.17,15.67-.67,30.2-7.35,42.78-15.7,9.49-6.3,16.9-13.89,25.78-20.41,6.46-4.74,10.45-6.49,17.61-1.43,1.79,1.27,7.63,6.98,9.13,7.04,2.97.11,7.41-5.52,9.42-7.34,4-3.61,8.44-4.93,12.63-8.16,6.69-5.15,12.57-11.58,19.31-16.77,2.6-2,7.89-6.35,11.33-5.85,4.05.59,9.74,8.08,13.16,10.55,2.65,1.91,4.66,2.11,7.48,3.27,4.33,1.79,8.2,6.61,11.49,9.81,2.7,2.63,7.83,8.64,11.11,10.03.54.89,1.93,1.82,3.1,2.1,9.6,2.34,10.38-9.9,20.92-7.12,4.69,1.24,14.47,12.29,18.69,15.92,13.38,11.56,29.38,19.93,47.15,23.77l10.58.92c1.54,2-.29,2.06-2.08,1.96-21.41-1.22-42.01-11.69-57.47-25.22-4.39-3.83-8.32-8.77-12.75-12.34-7.19-5.78-10.62-2.95-16.28,2.43-15.25,14.5-36.81,38.88-61.23,35.4-.66-.1-1.57-.42-1.35-1.22.35-1.27,1.99-.48,2.84-.47,17.87.28,31.14-10.09,43.51-20.93,2.34-2.05,9.14-7.92,10.6-10.07,1.18-1.74-1.71-.97-2.98-1.15-2.58-.37-4.31-1.4-6.27-2.98-3.56-2.88-6.93-7.65-10.64-9.89-.86-2-6.92-7.79-9.12-8.74-1.79-.77-3.57-.77-5.48-1.72-2.11-1.04-3.32-2.67-5.47-3.59h-.02Z" />
      <path d="M123.52,73.59c.09-.21,3.23-2.34,3.81-2.86,5.74-5.21,5.56-8.72,8.3-15.11,1.63-3.81,5.08-8.37,8.42-10.98.64-.5,3.35-2.71,4.09-2.01,1.19,1.12-3.88,4.3-4.71,5.16-5.21,5.35-4.74,11.72-8.42,17.58-1.59,2.53-7.13,8.23-9.98,9.22-.85.3-1.94,0-1.51-1h0Z" />
    </g>

    {/* SIERRA NEVADA - Papyrus (Regular) - Perfect side-to-side justification */}
    <text
      x="330" y="94"
      textLength="340"
      lengthAdjust="spacing"
      style={{ fontFamily: "'Papyrus', fantasy", fontSize: '24px', fontWeight: 400 }}
    >
      SIERRA NEVADA
    </text>
  </svg>
);

/* ---------------------------------------------------------------------------------------
   1. LANGUAGE CONTEXT
   --------------------------------------------------------------------------------------- */
const translations = {
  // Navbar
  'nav.home': { es: 'Inicio', en: 'Home' },
  'nav.sub': { es: 'Suscripción', en: 'Subscription' },
  'nav.guide': { es: 'Guía', en: 'Brewing Guide' },
  'nav.ai': { es: 'Laboratorio IA', en: 'AI Lab' },
  'nav.search_placeholder': { es: 'Buscar...', en: 'Type to search...' },
  'nav.cart_title': { es: 'Tu Carrito', en: 'Your Cart' },
  'nav.cart_empty': { es: 'Tu carrito está vacío', en: 'Your cart is empty' },
  'nav.cart_start': { es: 'Empezar a Comprar', en: 'Start Shopping' },
  'nav.checkout': { es: 'Pagar', en: 'Checkout' },
  'nav.subtotal': { es: 'Subtotal', en: 'Subtotal' },
  'nav.search_results': { es: 'Resultados', en: 'Results' },
  'nav.no_results': { es: 'No se encontraron resultados para', en: 'No results found for' },
  'nav.jump': { es: 'Ir a', en: 'Jump to' },
  'nav.login': { es: 'Ingresar', en: 'Login' },
  'nav.dashboard': { es: 'Panel', en: 'Dashboard' },

  // Home
  'home.hero.title_prefix': { es: 'Café', en: 'Café' },
  'home.hero.badge': { es: 'Especialidad Origen Único', en: 'Single Origin Specialty' },
  'home.reviews': { es: 'Reseñas', en: 'Reviews' },
  'home.desc': { es: 'Cultivado en las elevaciones místicas de la Sierra Nevada, Café Malu ofrece un equilibrio raro de acidez y cuerpo. Experimenta la herencia de generaciones en cada taza.', en: 'Grown in the mystical elevations of Sierra Nevada, Café Malu offers a rare balance of acidity and body. Experience the heritage of generations in every cup.' },
  'home.sub_save': { es: 'Suscríbete y Ahorra', en: 'Subscribe & Save' },
  'home.best_value': { es: 'Mejor Valor', en: 'Best Value' },
  'home.sub_details': { es: 'por bolsa 340g • Entrega mensual', en: 'per 12oz bag • Delivered monthly' },
  'home.onetime': { es: 'Compra Única', en: 'One-time' },
  'home.single_purchase': { es: 'Compra individual', en: 'Single purchase' },
  'home.add_cart': { es: 'Agregar al Carrito', en: 'Add to Cart' },
  'home.learn_more': { es: 'Leer Más', en: 'Learn More' },
  'home.story_title': { es: 'La Historia Detrás del Grano', en: 'The Story Behind Each Bean' },
  'home.story_desc': { es: 'En lo alto de los picos brumosos de la Sierra Nevada, donde las nubes tocan el suelo, se encuentra el origen de Café Malu. Cultivado por manos que han conocido estas tierras durante siglos, nuestros granos crecen bajo la sombra de árboles nativos, preservando la biodiversidad de la selva.', en: 'High in the misty peaks of the Sierra Nevada, where the clouds touch the soil, lies the origin of Café Malu. Cultivated by hands that have known these lands for centuries, our beans are shade-grown under a canopy of native trees, preserving the biodiversity of the rainforest.' },
  'home.trace_title': { es: 'Trazabilidad', en: 'Traceability' },
  'home.trace_desc': { es: 'Creemos en la transparencia total. Saber exactamente de dónde viene tu café te conecta con el viaje y las personas detrás de cada taza.', en: 'We believe in full transparency. Knowing exactly where your coffee comes from connects you to the journey and the people behind every cup.' },
  'home.producer': { es: 'Productor', en: 'Producer' },
  'home.region': { es: 'Región', en: 'Region' },
  'home.altitude': { es: 'Altitud', en: 'Altitude' },
  'home.roast_date': { es: 'Fecha Tueste', en: 'Roast Date' },
  'home.variety': { es: 'Variedad', en: 'Variety' },
  'home.high_alt': { es: 'Alta Altitud', en: 'High Altitude' },
  'home.washed': { es: 'Proceso Lavado', en: 'Washed Process' },
  'home.sustainable': { es: 'Sostenible', en: 'Sustainable' },
  'home.high_alt_sub': { es: '1,800m msnm', en: '1,800m above sea level' },
  'home.washed_sub': { es: 'Limpio y brillante', en: 'Clean, bright finish' },
  'home.sustainable_sub': { es: 'Amigable con aves', en: 'Bird-friendly farming' },

  // Footer
  'footer.explore': { es: 'Explorar', en: 'Explore' },
  'footer.join': { es: 'Únete al Ritual', en: 'Join the Ritual' },
  'footer.desc': { es: 'Suscríbete para recibir consejos de preparación y acceso anticipado a funciones de IA.', en: 'Subscribe to receive brewing tips, exclusive single-origin drops, and early access to our AI features.' },
  'footer.rights': { es: 'Todos los derechos reservados.', en: 'All rights reserved.' },
  'footer.privacy': { es: 'Política de Privacidad', en: 'Privacy Policy' },
  'footer.terms': { es: 'Términos', en: 'Terms of Service' },
  'footer.shipping': { es: 'Envíos', en: 'Shipping' },
  'footer.enter_email': { es: 'Ingresa tu correo', en: 'Enter your email address' },
  'footer.sub_btn': { es: 'Suscribirse', en: 'Subscribe' },
  'footer.sub_success': { es: '¡Suscrito!', en: 'Subscribed!' },
  'home.close': { es: 'Cerrar', en: 'Close' },
  'home.story_label': { es: 'NUESTRA HERENCIA', en: 'OUR HERITAGE' },
  'home.back_to_product': { es: 'Volver al Producto', en: 'Back to Product' },
  'home.read_less': { es: 'Ver Menos', en: 'Read Less' },
};

const LanguageContext = createContext(undefined);

const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('es');
  const [currency, setCurrency] = useState('COP');

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'es' ? 'en' : 'es'));
  };

  // Automatically sync currency with language
  useEffect(() => {
    setCurrency(language === 'es' ? 'COP' : 'USD');
  }, [language]);

  const t = (key, defaultText = '') => {
    return translations[key]?.[language] || defaultText || key;
  };

  const formatPrice = (priceCOP) => {
    if (language === 'es') {
      // Spanish = COP (precio ya está en COP)
      return `$${priceCOP.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`;
    } else {
      // English = USD (convertir de COP a USD)
      const priceUSD = priceCOP / 4000;
      return `USD ${priceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, currency, toggleLanguage, t, formatPrice }}>
      {children}
    </LanguageContext.Provider>
  );
};

const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
};

/* ---------------------------------------------------------------------------------------
   1.5 MOCK BACKEND DATABASE
   --------------------------------------------------------------------------------------- */
const INITIAL_PRODUCTS = [
  {
    id: 1,
    category: 'coffee',
    name: { es: 'Café Malu', en: 'Malu Coffee' },
    badge: { es: 'Especialidad Origen Único', en: 'Single Origin Specialty' },
    score: 88,
    tags: { es: ['Frutal', 'Chocolate', 'Cítrico'], en: ['Fruity', 'Chocolate', 'Citrus'] },
    price: 72000, // COP (base currency)
    desc: {
      es: 'Cultivado en las elevaciones místicas de la Sierra Nevada, Café Malu ofrece un equilibrio raro de acidez y cuerpo. Experimenta la herencia de generaciones en cada taza.',
      en: 'Grown in the mystical elevations of Sierra Nevada, Café Malu offers a rare balance of acidity and body. Experience the heritage of generations in every cup.'
    },
    story: {
      es: 'En lo alto de los picos brumosos de la Sierra Nevada, donde las nubes tocan el suelo, se encuentra el origen de Café Malu. Cultivado por manos que han conocido estas tierras durante siglos, nuestros granos crecen bajo la sombra de árboles nativos, preservando la biodiversidad de la selva.',
      en: 'High in the misty peaks of the Sierra Nevada, where the clouds touch the soil, lies the origin of Café Malu. Cultivated by hands that have known these lands for centuries, our beans are shade-grown under a canopy of native trees, preserving the biodiversity of the rainforest.'
    },
    img: 'public/cafe_malu_dual_bags_premium.png',
    color: '#E0A367',
    maskType: 'pop',
    variations: [
      { name: { es: 'Molienda', en: 'Grind' }, options: ['En Grano', 'Media', 'Fina'] },
      { name: { es: 'Presentación', en: 'Weight' }, options: ['340g', '500g', '1kg'], prices: [0, 32000, 88000] } // COP
    ]
  },
  {
    id: 2,
    category: 'coffee',
    name: { es: 'Sombra Sagrada', en: 'Sacred Shade' },
    badge: { es: 'Reserva Ecológica', en: 'Ecological Reserve' },
    score: 91,
    tags: { es: ['Floral', 'Jazmín', 'Miel'], en: ['Floral', 'Jasmine', 'Honey'] },
    price: 96000, // COP (base currency)
    desc: {
      es: 'Nuestra reserva más preciada. Un perfil sensorial que evoca los bosques de niebla y la pureza del agua de montaña.',
      en: 'Our most precious reserve. A sensory profile that evokes the cloud forests and the purity of mountain water.'
    },
    story: {
      es: 'Sombra Sagrada proviene de microlotes cultivados a más de 1,900msnm. Cada grano es seleccionado a mano durante el solsticio, respetando los ciclos lunares de la Sierra.',
      en: 'Sacred Shade comes from microlots grown above 1,900m asl. Each bean is hand-selected during the solstice, respecting the lunar cycles of the Sierra.'
    },
    img: 'public/sombra_sagrada_luxury.png',
    overlayImg: 'public/sombra_sagrada_sinfondo.png',
    overlayOffset: 32,
    overlayScale: 1.15,
    color: '#1C2923',
    maskType: 'pop',
    variations: [
      { name: { es: 'Molienda', en: 'Grind' }, options: ['En Grano', 'Media', 'Fina'] },
      { name: { es: 'Presentación', en: 'Weight' }, options: ['340g', '500g', '1kg'], prices: [0, 40000, 104000] } // COP
    ]
  },
  {
    id: 3,
    category: 'accessories',
    name: { es: 'Dripper Artesanal', en: 'Artisan Dripper' },
    badge: { es: 'Accesorios de Autor', en: 'Designer Accessories' },
    score: null,
    tags: { es: ['Cerámica', 'Hecho a mano', 'Único'], en: ['Ceramic', 'Handmade', 'Unique'] },
    price: 180000, // COP (base currency)
    desc: {
      es: 'Piezas únicas moldeadas por el barro de la Sierra, diseñadas para una extracción perfecta y un ritual sagrado.',
      en: 'Unique pieces molded from Sierra clay, designed for perfect extraction and a sacred ritual.'
    },
    story: {
      es: 'Creado en colaboración con alfareros locales de la cuenca del Río Gaira, este dripper mantiene la temperatura ideal para resaltar las notas frutales de Origen.',
      en: 'Created in collaboration with local potters from the Rio Gaira basin, this dripper maintains the ideal temperature to highlight the fruity notes of Origen.'
    },
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZv5nOjp7zmCZWGky4raehhN3mKOLVPfk7eSBc9HNBjO5_kEG1uLCwIfoV2zizjbqLyiS1aAl43qdi4ZMZ3OVO59JxWHZp6TgX6Sw11WEvi_-nzkn5hoEVagZgtxAfYnZgN-h8LhD3zDWvYUSqSYDSFQCQSutsQeJpn7hZcVzpF1vXFP9OjLupDWW_HSc7b0YfZAOUNk9jSQA6kohzyMdBLFhCICbYLZlzToOGgmQZufO0hnnEcHt2CHFGM_tqMBUlTY4q109L_afn',
    color: '#D2B48C',
    variations: []
  }
];

const MOCK_DB = {
  products: INITIAL_PRODUCTS,

  finances: {
    revenueMonthly: 12450000,
    ordersToday: 48,
    pendingShipments: 12,
    conversionRate: '3.8%'
  },
  users: [
    {
      email: 'origensierranevadasm@gmail.com',
      password: 'hashed_@Dministrador12345',
      role: 'admin',
      name: 'Manuel',
      registrationDate: new Date().toISOString()
    }
  ],
  transactions: [] // Historico para visitantes y usuarios
};

// Utils for security
const validatePassword = (pass) => {
  const hasUpper = /[A-Z]/.test(pass);
  const hasLower = /[a-z]/.test(pass);
  const hasNumber = /[0-9]/.test(pass);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
  const isLongEnough = pass.length >= 6;
  return {
    isStrong: hasUpper && hasLower && hasNumber && hasSpecial && isLongEnough,
    criteria: { hasUpper, hasLower, hasNumber, hasSpecial, isLongEnough }
  };
};

const mockHash = (pass) => `hashed_${pass}`;


/* ---------------------------------------------------------------------------------------
   1.6 AUTH CONTEXT
   --------------------------------------------------------------------------------------- */
const AuthContext = createContext(undefined);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('origen_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [productsState, setProductsState] = useState(MOCK_DB.products);

  const login = (email, password) => {
    const hashed = mockHash(password);
    const foundUser = MOCK_DB.users.find(u => u.email === email && u.password === hashed);

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('origen_user', JSON.stringify(foundUser));
      return foundUser.role;
    }
    return null;
  };

  const register = (userData) => {
    const { email, password, name, identification, phone, address } = userData;
    const { isStrong } = validatePassword(password);

    if (!isStrong) throw new Error("Contraseña no cumple requisitos de seguridad");

    const newUser = {
      email,
      password: mockHash(password),
      name,
      identification,
      phone,
      address,
      role: 'usuario',
      registrationDate: new Date().toISOString(),
      history: []
    };

    MOCK_DB.users.push(newUser);
    setUser(newUser);
    localStorage.setItem('origen_user', JSON.stringify(newUser));
    return 'usuario';
  };


  const logout = () => {
    setUser(null);
    localStorage.removeItem('origen_user');
  };

  const logVisitorTransaction = (name, product, amount) => {
    const transaction = {
      name,
      product,
      amount,
      type: 'Compra Visitante',
      date: new Date().toLocaleDateString(),
      role: 'visitante'
    };
    MOCK_DB.transactions.push(transaction);
  };

  const updateProduct = (updatedProd) => {
    setProductsState(prev => prev.map(p => p.id === updatedProd.id ? updatedProd : p));
  };

  return (
    <AuthContext.Provider value={{
      user, login, register, logout, logVisitorTransaction,
      db: { ...MOCK_DB, products: productsState },
      updateProduct
    }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

/* ---------------------------------------------------------------------------------------
   1.7 CART CONTEXT
   --------------------------------------------------------------------------------------- */
const CartContext = createContext(undefined);

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { language } = useLanguage();

  const addToCart = (product, selectedVariations = {}) => {
    setCartItems(prev => {
      // Create a unique key for the product + combination of variations
      const variantKey = Object.values(selectedVariations).join('-');
      const itemUniqueId = `${product.id}-${variantKey}`;

      const exists = prev.find(item => item.uniqueId === itemUniqueId);

      if (exists) {
        return prev.map(item => item.uniqueId === itemUniqueId ? { ...item, qty: item.qty + 1 } : item);
      }

      return [...prev, {
        uniqueId: itemUniqueId,
        id: product.id,
        name: product.name[language] || product.name.es || product.name.en || product.name,
        sub: product.badge?.[language] || 'Premium Product',
        price: product.price,
        qty: 1,
        img: product.img,
        selectedVariations // Store chosen options
      }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (uniqueId) => {
    setCartItems(prev => prev.filter(item => item.uniqueId !== uniqueId));
  };

  const updateQty = (uniqueId, delta) => {
    setCartItems(prev => prev.map(item =>
      item.uniqueId === uniqueId ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ));
  };


  const cartSubtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <CartContext.Provider value={{ cartItems, isCartOpen, setIsCartOpen, addToCart, removeFromCart, updateQty, cartSubtotal }}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};


const DarkModeToggle = () => {
  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
  };
  return (
    <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-white/10 transition-colors text-white" title="Toggle Theme">
      <span className="material-icons-outlined block dark:hidden">dark_mode</span>
      <span className="material-icons-outlined hidden dark:block text-primary">light_mode</span>
    </button>
  );
};

const Navbar = ({ activeCategory, setActiveCategory }) => {
  const navigate = useNavigate();
  const { language, toggleLanguage, t, formatPrice } = useLanguage();
  const { user, logout } = useAuth();
  const { cartItems, isCartOpen, setIsCartOpen, updateQty, removeFromCart, cartSubtotal } = useCart();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);


  useEffect(() => {
    const handleScroll = () => { setIsScrolled(window.scrollY > 20); };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    { id: 'coffee', label: { es: 'Café', en: 'Coffee' } },
    { id: 'derivatives', label: { es: 'Derivados', en: 'Derivatives' } },
    { id: 'accessories', label: { es: 'Accesorios', en: 'Accessories' } }
  ];


  return (
    <React.Fragment>
      <nav className={`fixed w-full z-50 top-0 transition-all duration-500 ${isScrolled ? 'bg-background-dark/95 backdrop-blur-md py-3 shadow-lg border-b border-primary/20' : 'bg-gradient-to-b from-black/80 to-transparent py-6 border-b border-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`lg:hidden p-2 rounded-full transition-colors ${isScrolled ? 'text-white hover:bg-white/10' : 'text-white hover:text-primary'}`}>
            <span className="material-icons-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
            <LogoSVG
              className="h-12 w-auto transition-colors duration-300"
              color={isScrolled ? (document.documentElement.classList.contains('dark') ? '#C8AA6E' : '#141E16') : '#C8AA6E'}
            />
          </div>

          {/* Sub-menu Categorías Desktop - Elegant & Static */}
          <div className="hidden md:flex items-center space-x-10">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`font-accent text-[10px] uppercase tracking-[0.3em] transition-all duration-300 relative pb-2 group ${activeCategory === cat.id ? 'text-primary' : 'text-gray-400 hover:text-white'}`}
              >
                {cat.label[language]}
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[1.5px] bg-primary transition-all duration-500 ${activeCategory === cat.id ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-50'}`}></span>
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4 text-white">
            <button onClick={() => setIsSearchOpen(true)} className="hidden lg:block p-2 rounded-full hover:bg-white/10 hover:text-primary transition-colors">
              <span className="material-icons-outlined">search</span>
            </button>
            <div className="relative cursor-pointer p-2 rounded-full hover:bg-white/10 hover:text-primary transition-colors" onClick={() => setIsCartOpen(true)}>
              <span className="material-icons-outlined">shopping_bag</span>
              <span className="absolute top-0 right-0 bg-primary text-background-dark text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">{cartItems.length}</span>
            </div>
            {/* Legend/Admin Login Button with Electric Effect */}
            <button
              onClick={() => user ? navigate(user.role === 'admin' ? '/admin' : '/dashboard') : navigate('/login')}
              className={`p-2 rounded-full hover:bg-white/10 transition-all ${user ? 'text-primary' : 'electric-glow bg-white/5'}`}
              title={user ? t('nav.dashboard') : t('nav.login')}
            >
              <span className="material-icons-outlined text-xl">{user ? 'dashboard' : 'login'}</span>
            </button>
            {user && (
              <button onClick={logout} className="p-2 rounded-full hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-colors" title="Logout">
                <span className="material-icons-outlined text-xl">logout</span>
              </button>
            )}

            <button onClick={toggleLanguage} className="p-2 rounded-full hover:bg-white/10 transition-colors hidden sm:block"><span className="font-accent text-xs text-white uppercase">{language}</span></button>
            <DarkModeToggle />
          </div>
        </div>
      </nav>

      {/* Premium Cart Sidebar */}
      <aside className={`fixed inset-y-0 right-0 w-full sm:w-[500px] z-[60] glass-panel transition-transform duration-700 ease-royal ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full p-8 sm:p-12">
          <header className="flex justify-between items-center mb-12 border-b border-white/5 pb-8">
            <div>
              <h2 className="font-display text-4xl font-black text-white mb-1 uppercase tracking-tight">{t('nav.cart_title')}</h2>
              <p className="text-[10px] font-accent uppercase tracking-[0.3em] text-primary">{cartItems.length > 0 ? `${cartItems.length} ${t('nav.cart_items', 'artículos')}` : t('nav.cart_empty')}</p>
            </div>
            <button onClick={() => setIsCartOpen(false)} className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all border border-white/10">
              <span className="material-icons-outlined text-white">close</span>
            </button>
          </header>

          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-8 pr-4">
            {cartItems.map(item => (
              <div key={item.uniqueId} className="flex gap-6 group">
                <div className="h-24 w-24 bg-white/5 rounded-2xl overflow-hidden border border-white/10 p-2 group-hover:border-primary/40 transition-all">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 rounded-lg" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <h4 className="text-white font-bold text-lg">{item.name}</h4>
                    <span className="text-primary font-display font-bold">{formatPrice(item.price)}</span>
                  </div>
                  {/* Show Selected Variations */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {Object.entries(item.selectedVariations || {}).map(([key, val]) => (
                      <span key={key} className="text-[9px] font-accent uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded text-gray-400 border border-white/5">
                        {val}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4 bg-black/40 rounded-full px-4 py-2 border border-white/5">
                      <button onClick={() => updateQty(item.uniqueId, -1)} className="text-gray-500 hover:text-white transition-colors">-</button>
                      <span className="text-xs text-white font-bold w-4 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.uniqueId, 1)} className="text-gray-500 hover:text-white transition-colors">+</button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.uniqueId)}
                      className="text-[9px] font-accent uppercase tracking-widest text-red-500/60 hover:text-red-500 transition-colors"
                    >
                      {t('cart.remove', 'Eliminar')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>


          <footer className="mt-12 pt-10 border-t border-white/10 space-y-8">
            <div className="flex justify-between items-end">
              <span className="text-gray-500 font-accent uppercase tracking-[0.2em] text-xs">{t('nav.subtotal')}</span>
              <div className="text-right">
                <p className="text-4xl font-display font-bold text-white mb-1 italic">{formatPrice(cartSubtotal)}</p>
                <p className="text-[9px] text-gray-600 font-accent uppercase tracking-widest">{t('cart.taxes', 'Impuestos incluidos')}</p>
              </div>
            </div>
            <button className="w-full py-5 bg-primary hover:bg-primary-hover text-black font-accent font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-primary/20 transition-all transform hover:scale-[1.02] active:scale-95">
              {t('nav.checkout')}
            </button>

            <button onClick={() => setIsCartOpen(false)} className="w-full text-[10px] font-accent text-gray-500 uppercase tracking-widest hover:text-white transition-colors">
              Continuar Navegando
            </button>
          </footer>
        </div>
      </aside>

      {isCartOpen && <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md opacity-100 transition-all duration-500" onClick={() => setIsCartOpen(false)}></div>}
    </React.Fragment>
  );
};

/* ---------------------------------------------------------------------------------------
   2.5 AUTH & DASHBOARD COMPONENTS
   --------------------------------------------------------------------------------------- */

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    identification: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const passStatus = validatePassword(formData.password);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const role = login(formData.email, formData.password);
        if (role) {
          navigate(role === 'admin' ? '/admin' : '/dashboard');
        } else {
          setError('Credenciales incorrectas');
        }
      } else {
        const role = register(formData);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen auth-gradient flex items-center justify-center px-6 pt-24 pb-12">
      <div className="glass-panel w-full max-w-lg p-10 rounded-3xl animate-fade-up">
        <div className="text-center mb-8">
          <LogoSVG className="h-14 w-auto mx-auto mb-6" color="#C8AA6E" />
          <h2 className="font-display text-3xl font-bold text-white mb-2">{isLogin ? 'Bienvenido' : 'Crear Cuenta'}</h2>
          <p className="text-gray-400 font-body text-sm italic">{isLogin ? 'Ingresa tus credenciales premium' : 'Únete a la herencia de la Sierra'}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 animate-shake">
            <span className="material-icons-outlined text-red-500 text-sm">error_outline</span>
            <p className="text-xs text-red-400 font-body">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-[10px] font-accent uppercase tracking-widest text-primary">Nombre Completo</label>
                <input
                  name="name" type="text" required value={formData.name} onChange={handleInputChange}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-all text-sm"
                  placeholder="Manuel..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-accent uppercase tracking-widest text-primary">Identificación</label>
                <input
                  name="identification" type="text" required value={formData.identification} onChange={handleInputChange}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-all text-sm"
                  placeholder="CC / NIT"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-accent uppercase tracking-widest text-primary">Email</label>
            <input
              name="email" type="email" required value={formData.email} onChange={handleInputChange}
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-all text-sm"
              placeholder="correo@ejemplo.com"
            />
          </div>

          {!isLogin && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-[10px] font-accent uppercase tracking-widest text-primary">WhatsApp / Cel</label>
                <input
                  name="phone" type="tel" required value={formData.phone} onChange={handleInputChange}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-all text-sm"
                  placeholder="+57..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-accent uppercase tracking-widest text-primary">Dirección</label>
                <input
                  name="address" type="text" required value={formData.address} onChange={handleInputChange}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-all text-sm"
                  placeholder="Calle..."
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-accent uppercase tracking-widest text-primary">Contraseña</label>
            <input
              name="password" type="password" required value={formData.password} onChange={handleInputChange}
              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none transition-all text-sm"
              placeholder="••••••••"
            />

            {!isLogin && formData.password && (
              <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/5 animate-fade-up">
                <p className="text-[10px] font-accent uppercase tracking-widest mb-3 flex justify-between">
                  Seguridad
                  <span className={passStatus.isStrong ? 'text-green-500' : 'text-red-500'}>
                    {passStatus.isStrong ? 'FUERTE' : 'DÉBIL'}
                  </span>
                </p>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                  <div className={`flex items-center gap-2 text-[9px] ${passStatus.criteria.isLongEnough ? 'text-primary' : 'text-gray-600'}`}>
                    <span className="material-icons-outlined text-[12px]">{passStatus.criteria.isLongEnough ? 'check_circle' : 'circle'}</span> 6+ caracteres
                  </div>
                  <div className={`flex items-center gap-2 text-[9px] ${passStatus.criteria.hasUpper ? 'text-primary' : 'text-gray-600'}`}>
                    <span className="material-icons-outlined text-[12px]">{passStatus.criteria.hasUpper ? 'check_circle' : 'circle'}</span> Mayúscula
                  </div>
                  <div className={`flex items-center gap-2 text-[9px] ${passStatus.criteria.hasLower ? 'text-primary' : 'text-gray-600'}`}>
                    <span className="material-icons-outlined text-[12px]">{passStatus.criteria.hasLower ? 'check_circle' : 'circle'}</span> Minúscula
                  </div>
                  <div className={`flex items-center gap-2 text-[9px] ${passStatus.criteria.hasNumber ? 'text-primary' : 'text-gray-600'}`}>
                    <span className="material-icons-outlined text-[12px]">{passStatus.criteria.hasNumber ? 'check_circle' : 'circle'}</span> Número
                  </div>
                  <div className={`flex items-center gap-2 text-[9px] ${passStatus.criteria.hasSpecial ? 'text-primary' : 'text-gray-600'}`}>
                    <span className="material-icons-outlined text-[12px]">{passStatus.criteria.hasSpecial ? 'check_circle' : 'circle'}</span> Especial (@#...)
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!isLogin && !passStatus.isStrong}
            className={`w-full py-4 font-accent font-bold uppercase tracking-widest rounded-xl transition-all transform active:scale-95 shadow-xl ${(!isLogin && !passStatus.isStrong) ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-primary hover:bg-primary-hover text-black shadow-primary/20'}`}
          >
            {isLogin ? 'Ingresar' : 'Registrar Cuenta'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-xs font-accent uppercase tracking-widest text-gray-500 hover:text-primary transition-colors">
            {isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Ingresa aquí'}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { user, db, updateProduct } = useAuth();
  const navigate = useNavigate();

  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') return null;

  const handleEdit = (product) => {
    setEditingProduct(JSON.parse(JSON.stringify(product))); // Deep clone for safe editing
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProduct(editingProduct);
    setIsModalOpen(false);
  };


  const stats = [
    { label: 'Ventas del Mes', value: `$${(db.finances.revenueMonthly / 1000000).toFixed(1)}M`, icon: 'trending_up', trend: '+12.4%', color: 'text-green-500' },
    { label: 'Pedidos Hoy', value: db.finances.ordersToday, icon: 'shopping_cart', trend: '+5', color: 'text-primary' },
    { label: 'Envíos Pendientes', value: db.finances.pendingShipments, icon: 'local_shipping', trend: 'Prioritario', color: 'text-yellow-500' },
    { label: 'Tasa Conversión', value: db.finances.conversionRate, icon: 'insights', trend: 'Estable', color: 'text-cyan-500' },
  ];

  return (
    <div className="min-h-screen bg-background-dark flex pt-20">
      {/* Sidebar - Navegación de Control */}
      <aside className="w-72 border-r border-white/5 p-8 space-y-10 hidden lg:block bg-black/20 backdrop-blur-xl">
        <div className="space-y-4">
          <label className="text-[10px] font-accent uppercase tracking-[0.3em] text-primary/60 font-bold">Operaciones</label>
          <nav className="space-y-2">
            <button className="sidebar-item-active w-full flex items-center gap-4 px-5 py-4 rounded-xl text-sm font-accent tracking-widest font-bold">
              <span className="material-icons-outlined">dashboard</span> DASHBOARD
            </button>
            <button className="w-full flex items-center gap-4 px-5 py-4 rounded-xl text-sm font-accent tracking-widest text-gray-500 hover:text-white hover:bg-white/5 transition-all">
              <span className="material-icons-outlined">inventory_2</span> INVENTARIO
            </button>
            <button className="w-full flex items-center gap-4 px-5 py-4 rounded-xl text-sm font-accent tracking-widest text-gray-500 hover:text-white hover:bg-white/5 transition-all">
              <span className="material-icons-outlined">payments</span> FINANZAS
            </button>
            <button className="w-full flex items-center gap-4 px-5 py-4 rounded-xl text-sm font-accent tracking-widest text-gray-500 hover:text-white hover:bg-white/5 transition-all">
              <span className="material-icons-outlined">people</span> CLIENTES
            </button>
          </nav>
        </div>

        <div className="pt-10 border-t border-white/5">
          <div className="glass-panel p-6 rounded-2xl bg-primary/5 border-primary/20">
            <p className="text-[10px] font-accent text-primary uppercase tracking-widest mb-2">Estado del Servidor</p>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs text-white font-body">Sistemas Online</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content - Workspace administrable */}
      <main className="flex-1 p-10 overflow-y-auto custom-scrollbar">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div className="animate-fade-up">
            <span className="text-primary font-accent text-[10px] tracking-[0.3em] uppercase mb-2 block">Sierra Control Center</span>
            <h1 className="font-display text-5xl font-bold text-white mb-3">Panel de Mando</h1>
            <p className="text-gray-400 font-body text-lg italic">Bienvenido, {user.name}. Control total sobre la herencia de la Sierra.</p>
          </div>
          <div className="flex gap-4 animate-fade-up">
            <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-xs font-accent uppercase tracking-[0.2em] text-white hover:bg-white/10 transition-all backdrop-blur-md">Generar Informe</button>
            <button className="px-8 py-3 bg-primary hover:bg-primary-hover rounded-full text-xs font-accent font-bold uppercase tracking-[0.2em] text-black shadow-xl shadow-primary/30 transition-all transform hover:scale-105 active:scale-95">Añadir Stock</button>
          </div>
        </header>

        {/* Financial Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, i) => (
            <div key={i} className="glass-panel p-8 rounded-3xl group hover:border-primary/40 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-icons-outlined text-8xl">{stat.icon}</span>
              </div>
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 bg-white/5 rounded-2xl ${stat.color}`}>
                  <span className="material-icons-outlined text-2xl">{stat.icon}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-xs font-bold leading-none mb-1 ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-gray-500'}`}>{stat.trend}</span>
                  <span className="text-[10px] text-gray-600 font-accent uppercase tracking-widest">vs prev.</span>
                </div>
              </div>
              <h3 className="text-4xl font-display font-bold text-white mb-2">{stat.value}</h3>
              <p className="text-xs font-accent uppercase tracking-[0.2em] text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Active Inventory Management */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          <section className="xl:col-span-2 glass-panel rounded-3xl overflow-hidden border border-white/5 bg-black/40">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
              <div>
                <h2 className="font-display text-2xl font-bold text-white mb-1">Gestión de Inventario</h2>
                <p className="text-xs text-gray-500 font-body uppercase tracking-widest">Stock disponible en tiempo real</p>
              </div>
              <button className="p-2 bg-white/5 rounded-lg hover:text-primary transition-colors">
                <span className="material-icons-outlined">filter_list</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-body">
                <thead>
                  <tr className="text-gray-500 text-[10px] font-accent uppercase tracking-[0.3em] border-b border-white/5 bg-black/20">
                    <th className="px-8 py-5">Item / SKU</th>
                    <th className="px-8 py-5">Variaciones</th>
                    <th className="px-8 py-5 text-center">Stock</th>
                    <th className="px-8 py-5">Valor Unidad</th>
                    <th className="px-8 py-5">Estado Global</th>
                    <th className="px-8 py-5">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  {db.products.map(product => (
                    <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-white font-bold mb-1">{product.name}</span>
                          <span className="text-[10px] font-mono text-primary/60">{product.sku}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-wrap gap-2">
                          {product.variations.length > 0 ? product.variations.map((v, i) => (
                            <div key={i} className="flex flex-col gap-1">
                              <span className="text-[8px] font-accent uppercase text-gray-500">{v.name.es}</span>
                              <div className="flex gap-1">
                                {v.options.map(opt => (
                                  <span key={opt} className="px-2 py-0.5 bg-white/5 rounded text-[8px] text-primary">{opt}</span>
                                ))}
                              </div>
                            </div>
                          )) : <span className="text-[8px] italic text-gray-600">Sin variaciones</span>}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={`text-lg font-bold font-display ${product.stock < 20 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                          {product.stock} <small className="text-[10px] uppercase text-gray-600 ml-1">{product.unit}</small>
                        </span>
                      </td>

                      <td className="px-8 py-6 font-bold text-primary">${product.price.toLocaleString()}</td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1 rounded-full text-[9px] font-accent font-black uppercase tracking-widest ${product.stock > 100 ? 'bg-green-500/10 text-green-500' : product.stock > 20 ? 'bg-primary/10 text-primary' : 'bg-red-500/10 text-red-500'}`}>
                          {product.stock > 100 ? 'Stock Completo' : product.stock > 20 ? 'Nivel Medio' : 'Crítico'}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-primary hover:text-white transition-colors bg-primary/10 p-2 rounded-lg"
                        >
                          <span className="material-icons-outlined text-lg">edit</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Quick Actions & Recent Activity */}
          <section className="space-y-10">
            <div className="glass-panel p-8 rounded-3xl border-primary/20 bg-primary/5">
              <h3 className="font-accent text-sm font-bold text-primary uppercase tracking-widest mb-6 border-b border-primary/10 pb-4">Acciones Maestro</h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 bg-black/40 rounded-2xl flex flex-col items-center gap-3 hover:bg-black/60 transition-all border border-white/5">
                  <span className="material-icons-outlined text-primary">add_box</span>
                  <span className="text-[10px] font-accent uppercase tracking-widest">Nuevo Café</span>
                </button>
                <button className="p-4 bg-black/40 rounded-2xl flex flex-col items-center gap-3 hover:bg-black/60 transition-all border border-white/5">
                  <span className="material-icons-outlined text-primary">local_offer</span>
                  <span className="text-[10px] font-accent uppercase tracking-widest">Promoción</span>
                </button>
              </div>
            </div>

            <div className="glass-panel p-8 rounded-3xl">
              <h3 className="font-accent text-sm font-bold text-white uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Actividad Local</h3>
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shadow-[0_0_10px_#C8AA6E]"></div>
                  <div>
                    <p className="text-xs text-gray-300 font-body">Nuevo pedido #8102 recibido</p>
                    <span className="text-[10px] text-gray-600 font-accent">Hace 5 minutos</span>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="h-2 w-2 rounded-full bg-yellow-500 mt-1.5"></div>
                  <div>
                    <p className="text-xs text-gray-300 font-body">Stock bajo en Sombra Sagrada</p>
                    <span className="text-[10px] text-gray-600 font-accent">Hace 2 horas</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Admin Edit Modal - Now correctly scoped */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
          <div className="glass-panel w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] p-10 border-primary/30 shadow-[0_0_100px_rgba(200,170,110,0.1)]">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/10">
              <h2 className="font-display text-4xl font-bold text-white uppercase tracking-tight">Editar Alquimia: <span className="text-primary">{editingProduct.name}</span></h2>
              <button onClick={() => setIsModalOpen(false)} className="h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10">
                <span className="material-icons-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-accent uppercase tracking-widest text-primary font-bold">Stock Actual ({editingProduct.unit})</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={e => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white outline-none focus:border-primary transition-all font-display text-2xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-accent uppercase tracking-widest text-primary font-bold">Precio Base ($)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={e => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white outline-none focus:border-primary transition-all font-display text-2xl text-primary"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-accent text-sm font-bold text-white uppercase tracking-widest">Variantes del Producto</h3>
                  <button
                    type="button"
                    onClick={() => {
                      const newVars = [...(editingProduct.variations || []), { name: { es: 'Nueva Variante', en: 'New Variation' }, options: [], prices: [] }];
                      setEditingProduct({ ...editingProduct, variations: newVars });
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full text-[10px] font-accent text-primary uppercase tracking-widest hover:bg-primary/20 transition-all font-bold"
                  >
                    <span className="material-icons-outlined text-sm">add_circle</span> Añadir Grupo
                  </button>
                </div>

                <div className="space-y-8">
                  {editingProduct.variations?.map((v, vIdx) => (
                    <div key={vIdx} className="p-8 bg-white/5 rounded-3xl border border-white/10 relative group">
                      <button
                        type="button"
                        onClick={() => {
                          const newVars = editingProduct.variations.filter((_, i) => i !== vIdx);
                          setEditingProduct({ ...editingProduct, variations: newVars });
                        }}
                        className="absolute top-4 right-4 text-red-500/40 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        title="Eliminar Grupo"
                      >
                        <span className="material-icons-outlined text-lg">delete_sweep</span>
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-1">
                          <label className="text-[9px] font-accent uppercase text-gray-500 tracking-widest">Nombre (ES)</label>
                          <input
                            value={v.name.es}
                            onChange={e => {
                              const newVars = [...editingProduct.variations];
                              newVars[vIdx].name.es = e.target.value;
                              setEditingProduct({ ...editingProduct, variations: newVars });
                            }}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-accent uppercase text-gray-500 tracking-widest">Opciones (Coma para separar)</label>
                          <input
                            value={v.options.join(', ')}
                            onChange={e => {
                              const newVars = [...editingProduct.variations];
                              newVars[vIdx].options = e.target.value.split(',').map(s => s.trim());
                              setEditingProduct({ ...editingProduct, variations: newVars });
                            }}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none text-xs text-primary"
                            placeholder="Ej: Molido, En Grano"
                          />
                        </div>
                      </div>

                      {/* Costos Extra por opción si es presentación */}
                      {v.name.en.toLowerCase().includes('weight') || v.name.es.toLowerCase().includes('presentación') ? (
                        <div className="mt-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                          <p className="text-[9px] font-accent text-primary uppercase tracking-widest mb-3 font-bold">Sobrecostos por Presentación ($)</p>
                          <div className="grid grid-cols-3 gap-4">
                            {v.options.map((opt, oIdx) => (
                              <div key={oIdx} className="space-y-1">
                                <span className="text-[8px] text-gray-400 block truncate">{opt}</span>
                                <input
                                  type="number"
                                  value={v.prices?.[oIdx] || 0}
                                  onChange={e => {
                                    const newVars = [...editingProduct.variations];
                                    if (!newVars[vIdx].prices) newVars[vIdx].prices = new Array(v.options.length).fill(0);
                                    newVars[vIdx].prices[oIdx] = parseFloat(e.target.value);
                                    setEditingProduct({ ...editingProduct, variations: newVars });
                                  }}
                                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white outline-none text-[10px]"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-10 flex gap-4">
                <button type="submit" className="flex-1 py-5 bg-primary hover:bg-primary-hover text-black font-accent font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-primary/20 transition-all text-sm">Guardar Cambios Maestros</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-accent text-gray-400 uppercase tracking-widest hover:text-white transition-all">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;


  return (
    <div className="min-h-screen bg-background-dark pt-32 pb-20 px-6 sm:px-10">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header de Perfil */}
        <div className="glass-panel p-10 rounded-[2.5rem] animate-fade-up relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 font-display text-9xl italic uppercase select-none">{user.role}</div>
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="h-32 w-32 rounded-3xl bg-primary/20 flex items-center justify-center border-2 border-primary/40 shadow-2xl shadow-primary/10 relative group">
              <span className="material-icons-outlined text-6xl text-primary lowercase">{user.name[0]}</span>
              <div className="absolute inset-0 bg-primary/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <span className="material-icons-outlined text-white">camera_alt</span>
              </div>
            </div>
            <div className="text-center md:text-left">
              <span className="text-primary font-accent text-[10px] tracking-[0.4em] uppercase mb-2 block font-black">Miembro Sierra Premium</span>
              <h1 className="text-5xl font-display font-bold text-white uppercase tracking-widest mb-3">{user.name}</h1>
              <p className="text-gray-500 font-body italic flex items-center justify-center md:justify-start gap-2">
                <span className="material-icons-outlined text-sm">event</span>
                Registrado el {new Date(user.registrationDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Columna Izquierda: Datos del perfil */}
          <div className="lg:col-span-1 space-y-10">
            <section className="glass-panel p-8 rounded-[2rem] border-primary/10 animate-fade-up" style={{ animationDelay: '100ms' }}>
              <h3 className="font-accent text-xs font-bold text-white uppercase tracking-[0.2em] mb-8 border-b border-white/5 pb-4">Datos de Perfil</h3>
              <div className="space-y-6">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-accent uppercase text-primary/60 tracking-widest leading-none">Identificación</span>
                  <span className="text-sm text-gray-300 font-body">{user.identification || 'No registrada'}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-accent uppercase text-primary/60 tracking-widest leading-none">Email de contacto</span>
                  <span className="text-sm text-gray-300 font-body">{user.email}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-accent uppercase text-primary/60 tracking-widest leading-none">WhatsApp / Cel</span>
                  <span className="text-sm text-gray-300 font-body">{user.phone || 'No registrado'}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-accent uppercase text-primary/60 tracking-widest leading-none">Dirección de Residencia</span>
                  <span className="text-sm text-gray-300 font-body">{user.address || 'No registrada'}</span>
                </div>
              </div>
              <button className="w-full mt-10 py-3 border border-white/10 rounded-xl text-[9px] font-accent font-bold uppercase tracking-widest text-gray-400 hover:text-primary hover:border-primary/40 transition-all">Editar Información</button>
            </section>
          </div>

          {/* Columna Derecha: Actividad y Transacciones */}
          <div className="lg:col-span-2 space-y-10">
            <section className="glass-panel p-8 rounded-[2rem] animate-fade-up" style={{ animationDelay: '200ms' }}>
              <h3 className="font-accent text-xs font-bold text-white uppercase tracking-[0.2em] mb-8 border-b border-white/5 pb-4">Historial de Transacciones</h3>
              <div className="space-y-4">
                {(user.history && user.history.length > 0) ? (
                  user.history.map((tx, i) => (
                    <div key={i} className="p-5 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center group hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="material-icons-outlined text-sm text-primary">shopping_bag</span>
                        </div>
                        <div>
                          <p className="text-sm text-white font-bold italic">{tx.product}</p>
                          <span className="text-[10px] text-gray-500 font-accent uppercase tracking-widest">{tx.date} • {tx.type}</span>
                        </div>
                      </div>
                      <span className="text-sm font-display font-bold text-white">${tx.amount}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <span className="material-icons-outlined text-gray-700 text-5xl mb-4">history_toggle_off</span>
                    <p className="text-xs text-gray-600 font-accent uppercase tracking-widest">Aún no hay transacciones sagradas</p>
                  </div>
                )}
              </div>
            </section>

            <section className="glass-panel p-8 rounded-[2rem] border-primary/20 bg-primary/5 animate-fade-up" style={{ animationDelay: '300ms' }}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-accent text-xs font-bold text-white uppercase tracking-[0.2em] mb-1">Suscripción Origen</h3>
                  <span className="px-2 py-0.5 bg-primary/20 rounded-full text-[8px] font-black text-primary uppercase tracking-widest">Activa</span>
                </div>
                <span className="material-icons-outlined text-primary">auto_awesome</span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-end gap-6">
                <div>
                  <h4 className="text-3xl font-display text-white mb-2 italic">Sombra Sagrada</h4>
                  <p className="text-[11px] text-gray-400 font-body">Próximo envío: **15 de febrero, 2024**</p>
                </div>
                <button className="px-8 py-3 bg-primary hover:bg-primary-hover text-black rounded-xl text-[10px] font-accent font-bold uppercase tracking-widest transition-all shadow-lg shadow-primary/20">Gestionar Ritual</button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------------------------------
   4. HOME PAGE COMPONENT
   --------------------------------------------------------------------------------------- */
const HomePage = ({ activeCategory }) => {
  const navigate = useNavigate();
  const { language, t, formatPrice } = useLanguage();
  const { addToCart } = useCart();
  const { db } = useAuth(); // Get dynamic products
  const products = db.products;

  // Filtered products based on selected category
  const filteredProducts = products.filter(p => p.category === activeCategory);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [direction, setDirection] = useState('next'); // 'next' or 'prev'

  // Selection state for variations and purchase type
  const [selectedVariations, setSelectedVariations] = useState({});
  const [purchaseType, setPurchaseType] = useState('subscription');

  // Parallax state for mouse tracking
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  // Reset and set default variations when product or category switches
  useEffect(() => {
    const currentProduct = filteredProducts[activeIndex] || products[0];
    const defaults = {};
    if (currentProduct.variations) {
      currentProduct.variations.forEach((v, idx) => {
        defaults[idx] = v.options[0];
      });
    }
    setSelectedVariations(defaults);
    setIsExpanded(false);
  }, [activeIndex, filteredProducts, activeCategory]);


  const activeProduct = filteredProducts[activeIndex] || products[0];

  const calculateCurrentPrice = () => {
    let totalPrice = activeProduct.price;
    // Add extra cost for weight/quantity if specified
    if (activeProduct.variations) {
      activeProduct.variations.forEach((v, vIdx) => {
        if (v.prices && selectedVariations[vIdx]) {
          const optIdx = v.options.indexOf(selectedVariations[vIdx]);
          if (optIdx !== -1) totalPrice += v.prices[optIdx];
        }
      });
    }
    // Add premium for single purchase
    if (purchaseType === 'single') totalPrice += 4.00;
    return totalPrice;
  };

  const handleProductChange = (newIndex, dir) => {
    setDirection(dir);
    setIsSwitching(true);
    setTimeout(() => {
      setActiveIndex(newIndex);
      setIsExpanded(false);
      setTimeout(() => setIsSwitching(false), 50);
    }, 300);
  };

  const nextProduct = () => {
    const nextIdx = (activeIndex + 1) % filteredProducts.length;
    handleProductChange(nextIdx, 'next');
  };

  const prevProduct = () => {
    const prevIdx = (activeIndex - 1 + filteredProducts.length) % filteredProducts.length;
    handleProductChange(prevIdx, 'prev');
  };

  const handleMouseMove = (e) => {
    if (isExpanded) return;
    const { clientX, clientY } = e;
    const x = (clientX - window.innerWidth / 2) / 40;
    const y = (clientY - window.innerHeight / 2) / 40;
    setParallax({ x, y });
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-500 pt-32 lg:pt-20" onMouseMove={handleMouseMove}>
      {/* Carousel Hero with Cinematic Blur */}
      <header className={`relative min-h-[90vh] flex items-center overflow-hidden px-6 lg:px-20 transition-all duration-1000 ${isExpanded ? 'blur-md brightness-50 scale-95' : ''}`}>

        {/* Navigation Arrows - Extremes of the Hero */}
        <button
          onClick={prevProduct}
          className="absolute left-4 sm:left-10 z-40 transition-all hover:scale-125 text-primary/40 hover:text-primary active:scale-90 p-4"
          title="Anterior"
        >
          <span className="material-icons-outlined text-5xl sm:text-7xl">chevron_left</span>
        </button>
        <button
          onClick={nextProduct}
          className="absolute right-4 sm:right-10 z-40 transition-all hover:scale-125 text-primary/40 hover:text-primary active:scale-90 p-4"
          title="Siguiente"
        >
          <span className="material-icons-outlined text-5xl sm:text-7xl">chevron_right</span>
        </button>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Left Side: Product Image & Navigation with Re-engineered Portal */}
          <div className="relative flex justify-center items-center order-2 lg:order-1 select-none min-h-[400px] sm:min-h-[600px]">
            {/* Dynamic Atmospheric Glow - Now contained here to avoid blocking right side */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none transition-all duration-1000 opacity-20 z-0"
              style={{ backgroundColor: activeProduct.color }}
            ></div>


            {/* 1. Pure Gold Metallic Orbital Ring - The Anchor */}
            <div className="absolute w-[310px] h-[310px] sm:w-[510px] sm:h-[510px] gold-ring-metallic rounded-full animate-spin-slow pointer-events-none"></div>

            {/* 2. Secondary Decorative Ring (Dashed) */}
            <div className="absolute w-[280px] h-[280px] sm:w-[480px] sm:h-[480px] border border-dashed border-primary/20 rounded-full opacity-40 pointer-events-none"></div>


            {/* 3. The Portal - Refined Elegant Sizing with Soft Bottom Edge and Parallax */}
            <div
              className={`relative w-[320px] h-[450px] sm:w-[550px] sm:h-[700px] flex items-center justify-center pointer-events-none z-20 transition-all duration-500
                ${isSwitching ? `opacity-0 blur-md ${direction === 'next' ? '-translate-x-20 scale-90' : 'translate-x-20 scale-90'}` : `opacity-100 translate-x-0 scale-100 blur-0 ${direction === 'next' ? 'animate-swipe-in-left' : 'animate-swipe-in-right'}`}`}
            >
              {/* Layer 1: Base Scene - Always strictly circular */}
              <div
                className="absolute inset-0 flex items-center justify-center portal-mask-circle transition-transform duration-150 ease-out"
                style={{ transform: `translate(${parallax.x}px, ${parallax.y}px)` }}
              >
                <img
                  key={`base-${activeProduct.id}`}
                  alt={activeProduct.name[language]}
                  className="w-80 sm:w-[560px] h-auto animate-float-hero-pop drop-shadow-[0_40px_80px_rgba(0,0,0,0.6)] pointer-events-auto transform translate-y-12 sm:translate-y-20 soft-bottom-edge"
                  src={activeProduct.img}
                />
              </div>

              {/* Layer 2: Overlay Bag - Using Pop mask if applicable */}
              {activeProduct.overlayImg ? (
                <div
                  className="absolute inset-0 flex items-center justify-center portal-mask-pop transition-transform duration-150 ease-out z-30"
                  style={{ transform: `translate(${parallax.x}px, ${parallax.y + (activeProduct.overlayOffset || 0)}px)` }}
                >
                  <div
                    style={{
                      transform: `scale(${activeProduct.overlayScale || 1})`,
                      transformOrigin: 'bottom center',
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <img
                      key={`overlay-${activeProduct.id}`}
                      alt={activeProduct.name[language]}
                      className="w-80 sm:w-[560px] h-auto animate-float-hero-pop drop-shadow-[0_10px_30px_rgba(0,0,0,0.2)] pointer-events-auto transform translate-y-12 sm:translate-y-20 soft-bottom-edge"
                      src={activeProduct.overlayImg}
                    />
                  </div>
                </div>
              ) : activeProduct.maskType === 'pop' ? (
                /* Falling back to single layer with pop for products like Malu */
                <div
                  className="absolute inset-0 flex items-center justify-center portal-mask-pop transition-transform duration-150 ease-out"
                  style={{ transform: `translate(${parallax.x}px, ${parallax.y}px)` }}
                >
                  <img
                    key={`base-pop-${activeProduct.id}`}
                    alt={activeProduct.name[language]}
                    className="w-80 sm:w-[560px] h-auto animate-float-hero-pop drop-shadow-[0_40px_80px_rgba(0,0,0,0.6)] pointer-events-auto transform translate-y-12 sm:translate-y-20 soft-bottom-edge"
                    src={activeProduct.img}
                  />
                </div>
              ) : null}
            </div>

            {/* 5. Quality Seal (Always Floating on top) */}
            {activeProduct.score && (
              <div className={`absolute top-[10%] right-[5%] sm:top-[15%] sm:right-[15%] bg-background-dark/95 backdrop-blur-md text-primary border border-primary/40 p-5 rounded-full flex flex-col items-center justify-center transform scale-75 sm:scale-110 shadow-2xl z-30 transition-all duration-500 ${isSwitching ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}>
                <span className="text-[10px] font-accent uppercase tracking-widest leading-none text-primary/80">SCAA</span>
                <span className="text-3xl font-display font-black text-white">{activeProduct.score}</span>
                <span className="text-[10px] font-accent uppercase tracking-widest leading-none text-primary/60">PTS</span>
              </div>
            )}
          </div>
          <div className={`order-1 lg:order-2 space-y-6 text-center lg:text-left transition-all duration-500 relative z-[100] pointer-events-auto ${isSwitching ? `opacity-0 blur-md ${direction === 'next' ? 'translate-x-20' : '-translate-x-20'}` : `opacity-100 translate-x-0 blur-0 ${direction === 'next' ? 'animate-swipe-in-left' : 'animate-swipe-in-right'}`}`} key={`info-${activeProduct.id}`}>
            <div className="relative z-[110]">
              <span className="font-accent text-primary tracking-[0.3em] text-xs uppercase block mb-3 animate-fade-up">
                {activeProduct.badge[language]}
              </span>
              <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl text-text-main-light dark:text-white leading-[0.9] mb-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
                {activeProduct.name[language].split(' ')[0]} <span className="text-primary italic font-light">{activeProduct.name[language].split(' ')[1] || ''}</span>
              </h1>
              <div className="flex items-center justify-center lg:justify-start gap-1 text-primary text-sm mb-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
                <span className="material-icons-outlined text-base">star</span>
                <span className="material-icons-outlined text-base">star</span>
                <span className="material-icons-outlined text-base">star</span>
                <span className="material-icons-outlined text-base">star</span>
                <span className="material-icons-outlined text-base">star</span>
                <span className="ml-2 font-body text-gray-500 text-xs">(124 {t('home.reviews')})</span>
              </div>
            </div>


            <div className="flex flex-wrap justify-center lg:justify-start gap-3 animate-fade-up" style={{ animationDelay: '0.3s' }}>
              {activeProduct.tags[language].map(tag => (
                <span key={tag} className="px-5 py-1.5 border border-primary/40 text-primary text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            <p className="font-body text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 animate-fade-up" style={{ animationDelay: '0.4s' }}>
              {activeProduct.desc[language]}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto lg:mx-0 pt-4 animate-fade-up relative z-[200]" style={{ animationDelay: '0.5s' }}>
              <div
                onClick={(e) => { e.stopPropagation(); setPurchaseType('subscription'); }}
                className={`p-6 rounded-2xl cursor-pointer transition-all border-2 ${purchaseType === 'subscription' ? 'border-primary bg-primary/10 shadow-xl opacity-100' : 'border-white/5 bg-white/5 opacity-40 hover:opacity-60'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-accent text-[10px] font-bold text-primary uppercase tracking-widest">{t('home.sub_save')}</span>
                  <span className={`bg-primary text-background-dark text-[8px] font-bold px-2 py-0.5 rounded uppercase transition-opacity ${purchaseType === 'subscription' ? 'opacity-100' : 'opacity-30'}`}>{t('home.best_value')}</span>
                </div>
                <span className="block text-3xl font-display text-text-main-light dark:text-white">{formatPrice(calculateCurrentPrice())}</span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">{t('home.sub_details')}</span>
              </div>
              <div
                onClick={(e) => { e.stopPropagation(); setPurchaseType('single'); }}
                className={`p-6 rounded-2xl cursor-pointer transition-all border-2 ${purchaseType === 'single' ? 'border-primary bg-primary/10 shadow-xl opacity-100' : 'border-white/5 bg-white/5 opacity-40 hover:opacity-60'}`}
              >
                <span className="font-accent text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">{t('home.onetime')}</span>
                <span className="block text-3xl font-display text-gray-400 dark:text-gray-200">{formatPrice(calculateCurrentPrice() + 4)}</span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">{t('home.single_purchase')}</span>
              </div>
            </div>


            {/* Variation Pickers */}
            <div className={`space-y-6 pt-2 transition-all duration-500 relative z-[200] pointer-events-auto ${isSwitching ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`} style={{ animationDelay: '0.45s' }}>
              {activeProduct.variations && activeProduct.variations.map((variation, vIdx) => (
                <div key={vIdx} className="space-y-3 relative z-[210]">
                  <label className="text-[10px] font-accent uppercase tracking-[0.3em] text-gray-500 font-bold block">
                    {variation.name[language]}
                  </label>
                  <div className="flex flex-wrap gap-2 relative z-[220]">
                    {variation.options.map(option => (
                      <button
                        key={option}
                        onClick={(e) => { e.stopPropagation(); setSelectedVariations(prev => ({ ...prev, [vIdx]: option })); }}
                        className={`px-6 py-4 sm:py-2 rounded-xl text-[10px] font-accent uppercase tracking-widest transition-all border cursor-pointer pointer-events-auto touch-manipulation select-none relative z-[230] ${selectedVariations[vIdx] === option ? 'bg-primary border-primary text-background-dark font-black shadow-lg shadow-primary/20 scale-105' : 'bg-white/5 border-white/10 text-gray-400 hover:border-primary/40 hover:text-white active:bg-white/10'}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>



            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-center lg:justify-start animate-fade-up relative z-[130]" style={{ animationDelay: '0.6s' }}>
              <button
                onClick={(e) => { e.stopPropagation(); addToCart({ ...activeProduct, price: calculateCurrentPrice() }, selectedVariations); }}
                className="bg-primary hover:bg-primary-hover text-background-dark font-accent font-bold text-xs tracking-[0.2em] uppercase px-12 py-4 shadow-lg hover:shadow-primary/30 transition-all transform hover:-translate-y-1 btn-shine-container btn-shine-effect cursor-pointer pointer-events-auto"
              >
                {t('home.add_cart')}
              </button>


              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="border border-white/20 hover:border-primary text-text-main-light dark:text-white font-accent font-bold text-xs tracking-[0.2em] uppercase px-12 py-4 transition-all btn-shine-container btn-shine-effect cursor-pointer pointer-events-auto"
              >
                {isExpanded ? t('home.read_less') : t('home.learn_more')}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Expandable Story Section - Cinematic Reveal */}
      <div
        onClick={() => setIsExpanded(false)}
        className={`fixed inset-0 z-[500] flex items-center justify-center px-6 transition-all duration-1000 ${isExpanded ? 'opacity-100 pointer-events-auto cursor-pointer shadow-[0_0_50px_black]' : 'opacity-0 pointer-events-none'}`}
      >
        {isExpanded && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl cursor-default"
          >
            <section className="bg-background-dark/95 backdrop-blur-3xl py-20 px-10 sm:px-20 rounded-[4rem] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.9)] animate-fade-up">
              <div className="max-w-3xl mx-auto text-center">
                <div className="w-12 h-1 bg-primary mx-auto mb-10 opacity-50"></div>
                <span className="font-accent text-primary text-[10px] tracking-[0.4em] uppercase block mb-6">
                  {t('home.story_label') || 'NUESTRA HERENCIA'}
                </span>
                <h2 className="font-display text-4xl lg:text-6xl text-white mb-10 leading-tight">
                  {t('home.story_title')}
                </h2>
                <div className="relative">
                  <span className="absolute -top-10 -left-6 text-primary/10 text-9xl font-display leading-none select-none">"</span>
                  <p className="font-display italic text-2xl lg:text-3xl text-gray-300 leading-relaxed relative z-10">
                    {activeProduct.story[language]}
                  </p>
                  <span className="absolute -bottom-20 -right-6 text-primary/10 text-9xl font-display leading-none select-none translate-y-10">"</span>
                </div>

                <div className="mt-20 flex justify-center">
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-8 py-3 rounded-full font-accent text-[10px] tracking-widest uppercase transition-all"
                  >
                    {t('home.back_to_product') || 'Volver al Producto'}
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

/* ---------------------------------------------------------------------------------------
   5. FOOTER COMPONENT
   --------------------------------------------------------------------------------------- */
const Footer = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) { setStatus('success'); setTimeout(() => setStatus('idle'), 3000); }
  };

  return (
    <footer className="bg-[#0B120D] text-white pt-24 pb-12 border-t border-[#C8AA6E]/20 relative overflow-hidden">
      {/* Topographic Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="topographic-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M0 100 C 20 0 50 0 100 100 Z M0 0 C 50 100 80 100 100 0 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <path d="M-10 50 C 20 80 80 20 110 50" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#topographic-pattern)" />
        </svg>
        {/* Placeholder for complex topo pattern - using simple abstract curves for now */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
      </div>

      {/* Golden Gradient Top Border Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C8AA6E] to-transparent opacity-80"></div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20 relative z-10">

        {/* Brand Column */}
        <div className="lg:col-span-1 text-center md:text-left space-y-6">
          <div className="flex justify-center md:justify-start">
            {/* Using the LogoSVG component we typically use, ensuring it scales nicely */}
            <div className="w-48 text-[#C8AA6E]">
              <LogoSVG className="w-full h-auto" color="#C8AA6E" />
            </div>
          </div>
          <p className="text-gray-400 font-body text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
            {t('footer.brand_desc') || 'Cultivando el alma de la montaña en cada grano. Un tributo a la tierra sagrada de la Sierra Nevada de Santa Marta.'}
          </p>
          <div className="flex gap-4 justify-center md:justify-start">
            {['facebook', 'instagram', 'twitter'].map(social => (
              <a key={social} href="#" className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center text-primary hover:bg-primary hover:text-black transition-all duration-300">
                <span className={`fab fa-${social}`}></span>
              </a>
            ))}
          </div>
        </div>

        {/* Navigation Columns */}
        <div className="grid grid-cols-2 gap-8 md:col-span-2 lg:col-span-2">
          <div>
            <h4 className="font-accent font-bold text-xs text-[#C8AA6E] uppercase tracking-[0.25em] mb-6">Explorar</h4>
            <ul className="space-y-4">
              {['Nuestros Cafés', 'Suscripción', 'Métodos de Extracción', 'Blog de Origen'].map(item => (
                <li key={item}><a href="#" className="text-gray-400 hover:text-white text-sm font-body transition-colors relative group">
                  <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  {item}
                </a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-accent font-bold text-xs text-[#C8AA6E] uppercase tracking-[0.25em] mb-6">Legal</h4>
            <ul className="space-y-4">
              {['Términos y Condiciones', 'Política de Privacidad', 'Envíos y Devoluciones', 'Contacto'].map(item => (
                <li key={item}><a href="#" className="text-gray-400 hover:text-white text-sm font-body transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Column */}
        <div className="lg:col-span-1">
          <h3 className="font-display text-2xl text-white mb-2 italic">Únete al Ritual</h3>
          <p className="text-xs text-gray-500 font-body mb-6">{t('footer.join')}</p>
          <form onSubmit={handleSubscribe} className="space-y-4">
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.enter_email')}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#C8AA6E] transition-colors text-xs font-body"
              />
              <button
                type="submit"
                className={`absolute right-2 top-2 bottom-2 px-4 rounded-md font-accent font-bold text-[10px] uppercase tracking-widest transition-all duration-300 flex items-center justify-center ${status === 'success' ? 'bg-green-900 text-green-400' : 'bg-[#C8AA6E] hover:bg-[#B6965A] text-[#141E16]'}`}
              >
                {status === 'success' ? <span className="material-icons text-sm">check</span> : <span className="material-icons text-sm">arrow_forward</span>}
              </button>
            </div>
            <p className="text-[10px] text-gray-600 leading-tight">
              Al suscribirte aceptas recibir historias de la Sierra y ofertas exclusivas.
            </p>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-600 font-accent uppercase tracking-widest relative z-10">
        <p>© 2024 Origen Sierra Nevada. {t('footer.rights')}</p>
        <div className="flex gap-6">
          <span>Diseñado con Alma</span>
          <span>Hecho en Colombia</span>
        </div>
      </div>
    </footer>
  );
};

/* ---------------------------------------------------------------------------------------
   6. APP ROOT
   --------------------------------------------------------------------------------------- */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const App = () => {
  const [activeCategory, setActiveCategory] = useState('coffee');

  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <HashRouter>
            <ScrollToTop />
            <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark font-body transition-colors duration-300">
              <Navbar activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
              <Routes>
                <Route path="/" element={<HomePage activeCategory={activeCategory} />} />
                <Route path="/login" element={<AuthPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/dashboard" element={<UserDashboard />} />
              </Routes>
            </div>
          </HashRouter>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};


const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
