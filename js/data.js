/* AnnuMakeover - Data Layer (localStorage) */
const AM = {
  WA_NUMBER: '917352712794', // ← Replace with actual WhatsApp number
  ADMIN_PIN: 'annu@2024',
  KEY_SERVICES: 'annumakeover_services',
  KEY_FEEDBACK: 'annumakeover_feedback',
  KEY_AUTH: 'annumakeover_admin_auth',

  DEFAULT_SERVICES: [
    { id: 1, name: 'Reception Makeup', price: 10000, category: 'makeup', description: 'Elegant reception makeup for your special day using premium products.', active: true },
    { id: 2, name: 'Bridal Makeup', price: 12000, category: 'makeup', description: 'Complete bridal transformation with flawless finish that lasts all day.', active: true },
    { id: 3, name: 'Party Makeup', price: 3000, category: 'makeup', description: 'Glamorous party-ready makeup to make you stand out.', active: true },
    { id: 4, name: 'Facial', price: 3650, category: 'facial', description: 'Deep cleansing rejuvenating facial treatment for glowing skin.', active: true },
    { id: 5, name: 'O3+ Facial', price: 2500, category: 'facial', description: 'Premium O3+ facial for deep nourishment and radiance.', active: true },
    { id: 6, name: 'Lotus Gold Facial', price: 1500, category: 'facial', description: 'Luxurious lotus gold facial for a luminous complexion.', active: true },
    { id: 7, name: 'Kanpeki Facial', price: 2500, category: 'facial', description: 'Japanese-inspired Kanpeki facial for flawless skin.', active: true },
    { id: 8, name: 'Fruits Facial', price: 900, category: 'facial', description: 'Natural fruits facial packed with vitamins for fresh skin.', active: true },
    { id: 9, name: 'Aroma Facial', price: 1500, category: 'facial', description: 'Relaxing aroma therapy facial for stress-free glowing skin.', active: true },
    { id: 10, name: 'VLCC Facial', price: 1500, category: 'facial', description: 'Professional VLCC facial for deep pore cleansing.', active: true },
    { id: 11, name: 'Raaga De-Tan', price: 500, category: 'detan', description: 'Effective Raaga de-tan treatment for even skin tone.', active: true },
    { id: 12, name: 'O3+ De-Tan', price: 650, category: 'detan', description: 'Premium O3+ de-tan for quick visible brightening.', active: true },
    { id: 13, name: 'VLCC De-Tan', price: 350, category: 'detan', description: 'Gentle VLCC de-tan treatment for a lighter complexion.', active: true },
    { id: 14, name: 'Body Polishing', price: 3000, category: 'body', description: 'Full body polishing for smooth, glowing and rejuvenated skin.', active: true },
    { id: 15, name: 'Full Body Waxing', price: 3000, category: 'body', description: 'Complete body waxing service for silky smooth skin.', active: true },
    { id: 16, name: 'Hair Smoothing & Straightening', price: 4500, category: 'hair', description: 'Professional smoothing treatment for sleek, frizz-free hair.', active: true },
    { id: 17, name: 'Keratin Treatment', price: 4500, category: 'hair', description: 'Deep keratin nourishment for strong, shiny, manageable hair.', active: true },
    { id: 18, name: 'Hair Cut', price: 400, category: 'hair', description: 'Stylish precision haircut tailored to your face shape.', active: true },
    { id: 19, name: 'Hair Colour', price: 2500, category: 'hair', description: 'Professional hair colouring with premium colour products.', active: true },
    { id: 20, name: 'Manicure & Pedicure', price: 2000, category: 'other', description: 'Complete nail care treatment for beautiful hands and feet.', active: true },
    { id: 21, name: 'Face Wax', price: 500, category: 'other', description: 'Gentle face waxing for smooth, hair-free skin.', active: true },
    { id: 22, name: 'Eyebrow & Forehead', price: 50, category: 'other', description: 'Precise eyebrow threading and forehead shaping.', active: true },
  ],

  getServices() {
    const raw = localStorage.getItem(this.KEY_SERVICES);
    if (!raw) {
      localStorage.setItem(this.KEY_SERVICES, JSON.stringify(this.DEFAULT_SERVICES));
      return this.DEFAULT_SERVICES;
    }
    return JSON.parse(raw);
  },

  saveServices(services) {
    localStorage.setItem(this.KEY_SERVICES, JSON.stringify(services));
  },

  addService(service) {
    const services = this.getServices();
    service.id = Date.now();
    service.active = true;
    services.push(service);
    this.saveServices(services);
    return service;
  },

  updateService(id, updates) {
    const services = this.getServices();
    const idx = services.findIndex(s => s.id === id);
    if (idx !== -1) {
      services[idx] = { ...services[idx], ...updates };
      this.saveServices(services);
      return services[idx];
    }
    return null;
  },

  deleteService(id) {
    const services = this.getServices().filter(s => s.id !== id);
    this.saveServices(services);
  },

  getFeedback() {
    const raw = localStorage.getItem(this.KEY_FEEDBACK);
    return raw ? JSON.parse(raw) : [];
  },

  addFeedback(feedback) {
    const list = this.getFeedback();
    feedback.id = Date.now();
    feedback.date = new Date().toISOString();
    feedback.adminReply = '';
    list.unshift(feedback);
    localStorage.setItem(this.KEY_FEEDBACK, JSON.stringify(list));
    return feedback;
  },

  replyFeedback(id, reply) {
    const list = this.getFeedback();
    const idx = list.findIndex(f => f.id === id);
    if (idx !== -1) {
      list[idx].adminReply = reply;
      localStorage.setItem(this.KEY_FEEDBACK, JSON.stringify(list));
    }
  },

  deleteFeedback(id) {
    const list = this.getFeedback().filter(f => f.id !== id);
    localStorage.setItem(this.KEY_FEEDBACK, JSON.stringify(list));
  },

  isAdminAuth() {
    return sessionStorage.getItem(this.KEY_AUTH) === 'true';
  },

  adminLogin(pin) {
    if (pin === this.ADMIN_PIN) {
      sessionStorage.setItem(this.KEY_AUTH, 'true');
      return true;
    }
    return false;
  },

  adminLogout() {
    sessionStorage.removeItem(this.KEY_AUTH);
  },

  waLink(serviceName, price) {
    const msg = encodeURIComponent(`Hi! I'd like to book *${serviceName}* (₹${price.toLocaleString('en-IN')}). Please confirm availability.`);
    return `https://wa.me/${this.WA_NUMBER}?text=${msg}`;
  },

  CATEGORIES: {
    makeup: { label: 'Makeup', icon: '💄' },
    facial: { label: 'Facial', icon: '✨' },
    detan: { label: 'De-Tan', icon: '🌸' },
    body: { label: 'Body', icon: '💆' },
    hair: { label: 'Hair', icon: '💇' },
    other: { label: 'Other', icon: '💅' },
  },

  formatDate(iso) {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }
};
