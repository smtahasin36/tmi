
import { User, Game, Product, Order, SiteSettings, Slider, PaymentMethod, RedeemCode } from './types';

const STORAGE_KEYS = {
  USERS: 'tmi_users',
  ADMINS: 'tmi_admins',
  GAMES: 'tmi_games',
  PRODUCTS: 'tmi_products',
  ORDERS: 'tmi_orders',
  SETTINGS: 'tmi_settings',
  SLIDERS: 'tmi_sliders',
  PAYMENT_METHODS: 'tmi_payment_methods',
  REDEEM_CODES: 'tmi_redeem_codes',
  CURRENT_USER: 'tmi_current_user'
};

const defaultSettings: SiteSettings = {
  siteName: 'Tmi Top Up',
  siteTitle: 'Best Gaming Top Up Store',
  siteDescription: 'Get your UC, Diamonds, and Vouchers instantly at the best prices.',
  currencySymbol: '৳',
  fabLink: 'https://wa.me/880123456789',
  youtubeLink: 'https://youtube.com/watch?v=example',
  marqueeStatus: true,
  marqueeText: 'Welcome to Tmi Top Up! Enjoy fast and reliable gaming top-ups 24/7.'
};

const defaultGames: Game[] = [
  { id: '1', name: 'Free Fire', type: 'uid', image: 'https://picsum.photos/400/300?random=1', description: 'Fast FF Diamonds Top Up', isPopular: true },
  { id: '2', name: 'PUBG Mobile', type: 'uid', image: 'https://picsum.photos/400/300?random=2', description: 'Instant UC Delivery', isPopular: true },
  { id: '3', name: 'Mobile Legends', type: 'uid', image: 'https://picsum.photos/400/300?random=3', description: 'MLBB Diamonds Store' },
  { id: '4', name: 'Garena Shells', type: 'voucher', image: 'https://picsum.photos/400/300?random=4', description: 'Garena My Voucher Codes' }
];

const defaultSliders: Slider[] = [
  { id: '1', image: 'https://picsum.photos/1200/400?random=10', link: '#' },
  { id: '2', image: 'https://picsum.photos/1200/400?random=11', link: '#' },
  { id: '3', image: 'https://picsum.photos/1200/400?random=12', link: '#' }
];

export const DB = {
  initialize: () => {
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
    if (!localStorage.getItem(STORAGE_KEYS.GAMES)) localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(defaultGames));
    if (!localStorage.getItem(STORAGE_KEYS.SLIDERS)) localStorage.setItem(STORAGE_KEYS.SLIDERS, JSON.stringify(defaultSliders));
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify([]));
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([{
        id: '1', name: 'Demo User', phone: '01700000000', email: 'user@example.com', password: 'password123', balance: 500, totalSpent: 1200, weeklySpent: 200, role: 'user'
    }]));
    if (!localStorage.getItem(STORAGE_KEYS.ADMINS)) localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify([{
        id: 'admin', username: 'mraiprime', password: 'khfmhf2007'
    }]));
  },

  getSettings: (): SiteSettings => {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : defaultSettings;
  },
  updateSettings: (settings: SiteSettings) => localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings)),

  getGames: (): Game[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.GAMES) || '[]'),
  saveGames: (games: Game[]) => localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(games)),

  getProducts: (): Product[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]'),
  saveProducts: (products: Product[]) => localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products)),

  getOrders: (): Order[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]'),
  saveOrders: (orders: Order[]) => localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders)),

  getSliders: (): Slider[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.SLIDERS) || '[]'),
  saveSliders: (sliders: Slider[]) => localStorage.setItem(STORAGE_KEYS.SLIDERS, JSON.stringify(sliders)),

  getUsers: (): User[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]'),
  saveUsers: (users: User[]) => localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users)),

  getPaymentMethods: (): PaymentMethod[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.PAYMENT_METHODS) || '[]'),
  savePaymentMethods: (methods: PaymentMethod[]) => localStorage.setItem(STORAGE_KEYS.PAYMENT_METHODS, JSON.stringify(methods)),

  getRedeemCodes: (): RedeemCode[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.REDEEM_CODES) || '[]'),
  saveRedeemCodes: (codes: RedeemCode[]) => localStorage.setItem(STORAGE_KEYS.REDEEM_CODES, JSON.stringify(codes)),

  getCurrentUser: (): User | null => JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null'),
  setCurrentUser: (user: User | null) => localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
};
