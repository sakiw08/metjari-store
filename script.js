// ================== بيانات المستخدم ==================
function getCurrentUser() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  return user || null;
}

function updateUserHeader() {
  const userSpan = document.getElementById('userName');
  if (!userSpan) return;

  const user = getCurrentUser();
  if (user) {
    const name = (user.name || user.email || 'حسابي').split(' ')[0];
    userSpan.textContent = name;
  } else {
    userSpan.textContent = 'الدخول';
  }
}

// يُستدعى من HTML: onclick="toggleUserMenu()"
function toggleUserMenu() {
  const user = getCurrentUser();
  if (user) {
    const confirmLogout = confirm('هل تريد تسجيل الخروج من حسابك؟');
    if (confirmLogout) {
      localStorage.removeItem('currentUser');
      updateUserHeader();
      showToast('✅ تم تسجيل الخروج بنجاح');
    }
  } else {
    window.location.href = 'login.html';
  }
}

// ================== بيانات المنتجات ==================
const products = [
  {
    id: 1,
    name: "آيفون 15 برو ماكس",
    price: 1250,
    category: "phones",
    img: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400",
    description: "أحدث هواتف آبل بشاشة OLED فائقة الدقة بحجم 6.7 بوصة، مع معالج A17 Pro، وكاميرا احترافية بدقة 48 ميجابكسل."
  },
  {
    id: 2,
    name: "سامسونج S24 ألترا",
    price: 1100,
    category: "phones",
    img: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=400",
    description: "أحدث هواتف سامسونج الرائدة، بشاشة Dynamic AMOLED 2X، وقلم S Pen المدمج، وكاميرا بدقة 200 ميجابكسل."
  },
  {
    id: 3,
    name: "ماك بوك برو M3",
    price: 4500,
    category: "laptops",
    img: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400",
    description:"منتج مبدع زي اني"
  },
  {
    id: 4,
    name: "سماعات إيربودز برو",
    price: 320,
    category: "accessories",
    img: "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=400",
    description:"wow very good"
  },
  {
    id: 5,
    name: "ساعة أبل واتش",
    price: 650,
    category: "accessories",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=compress&cs=tinysrgb&w=400",
    description:"yed nice"
  },
  {
    id: 6,
    name: "لاب توب أسوس",
    price: 2200,
    category: "laptops",
    img: "https://images.unsplash.com/photo-1588702547923-7093a6c3b8e5?auto=compress&cs=tinysrgb&w=400",
    description:"3woww"
  }

];

// ================== حالة السلة في localStorage ==================
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCounter() {
  const cartCounter = document.querySelector('.cart-count');
  if (!cartCounter) return;
  cartCounter.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  updateCartCounter();
  showToast('✅ تم إضافة المنتج إلى السلة');
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartCounter();
  loadCartPage();
}

function updateQuantity(productId, change) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.quantity += change;
  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    saveCart();
    updateCartCounter();
    loadCartPage();
  }
}

// ================== صفحة السلة ==================
function loadCartPage() {
  const emptyEl = document.getElementById('cartEmpty');
  const itemsEl = document.getElementById('cartItems');
  const rowsEl = document.getElementById('cartRows');
  const subtotalEl = document.getElementById('subtotal');
  const totalEl = document.getElementById('total');

  if (!emptyEl || !itemsEl || !rowsEl || !subtotalEl || !totalEl) return;

  if (cart.length === 0) {
    emptyEl.style.display = 'block';
    itemsEl.style.display = 'none';
    subtotalEl.textContent = '0 د.ل';
    totalEl.textContent = '0 د.ل';
    return;
  }

  emptyEl.style.display = 'none';
  itemsEl.style.display = 'block';

  let subtotal = 0;

  rowsEl.innerHTML = cart.map(item => {
    const lineTotal = item.price * item.quantity;
    subtotal += lineTotal;

    return `
      <div class="cart-row">
        <div class="cart-product">
          <img src="${item.img}" alt="${item.name}">
          <div>
            <h4>${item.name}</h4>
            <p>${item.price.toLocaleString()} د.ل / قطعة</p>
          </div>
        </div>
        <div class="cart-price">${item.price.toLocaleString()} د.ل</div>
        <div class="cart-quantity">
          <button onclick="updateQuantity(${item.id}, -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="updateQuantity(${item.id}, 1)">+</button>
        </div>
        <div class="cart-total">${lineTotal.toLocaleString()} د.ل</div>
        <div class="cart-remove">
          <button class="remove-btn" onclick="removeFromCart(${item.id})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  const shipping = 15;
  subtotalEl.textContent = `${subtotal.toLocaleString()} د.ل`;
  totalEl.textContent = `${(subtotal + shipping).toLocaleString()} د.ل`;
}

// ================== عرض المنتجات (الرئيسية + صفحة المنتجات) ==================

function renderProducts(productsToShow = products) {
  const grid = document.getElementById('productsGrid') || document.querySelector('.products-grid');
  const productsCountEl = document.getElementById('productsCount');
  const activeFiltersText = document.getElementById('activeFiltersText');

  if (!grid) return;

  grid.innerHTML = productsToShow.map(product => `
    <div class="product-card">
      <img src="${product.img}" alt="${product.name}">
      <h3>${product.name}</h3>
      <div class="price">${product.price.toLocaleString()} د.ل</div>
      <div class="product-actions">
        <button class="add-to-cart" onclick="addToCart(${product.id})">أضف إلى السلة</button>
        <a href="product.html?id=${product.id}" class="quick-view" style="display: inline-block; text-align: center; background: #667eea; color: white; border: none; padding: 1rem; border-radius: 12px; cursor: pointer; font-size: 1rem; text-decoration: none;">عرض التفاصيل</a>
      </div>
    </div>
  `).join('');

  if (productsCountEl) {
    productsCountEl.textContent = productsToShow.length;
  }

  if (activeFiltersText && !productsToShow.length) {
    activeFiltersText.textContent = 'لا توجد منتجات مطابقة للفلاتر الحالية';
  }
}

// ================== فلاتر صفحة المنتجات ==================
function setupFilters() {
  const categorySelect = document.getElementById('categoryFilter');
  const priceSelect = document.getElementById('priceFilter');
  const searchInput = document.getElementById('searchInput');
  const activeFiltersText = document.getElementById('activeFiltersText');

  if (!categorySelect && !priceSelect && !searchInput) return;

  function applyFilters() {
    let filtered = [...products];

    const category = categorySelect ? categorySelect.value : 'all';
    const price = priceSelect ? priceSelect.value : 'all';
    const term = searchInput ? searchInput.value.trim() : '';

    if (category && category !== 'all') {
      filtered = filtered.filter(p => p.category === category);
    }

    if (price && price !== 'all') {
      if (price === '0-500') {
        filtered = filtered.filter(p => p.price <= 500);
      } else if (price === '500-1500') {
        filtered = filtered.filter(p => p.price > 500 && p.price <= 1500);
      } else if (price === '1500+') {
        filtered = filtered.filter(p => p.price > 1500);
      }
    }

    if (term) {
      const lower = term.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(lower)
      );
    }

    if (activeFiltersText) {
      const parts = [];
      if (category && category !== 'all') parts.push('التصنيف');
      if (price && price !== 'all') parts.push('السعر');
      if (term) parts.push('البحث');
      activeFiltersText.textContent = parts.length
        ? 'الفلاتر المفعّلة: ' + parts.join(' + ')
        : 'جميع المنتجات معروضة حالياً';
    }

    renderProducts(filtered);
  }

  if (categorySelect) categorySelect.addEventListener('change', applyFilters);
  if (priceSelect) priceSelect.addEventListener('change', applyFilters);
  if (searchInput) searchInput.addEventListener('input', applyFilters);

  applyFilters();
}

// ================== مودال عرض المنتج ==================
function openProductModal(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('productModal');
  const body = document.getElementById('productModalBody');
  if (!modal || !body) return;

  body.innerHTML = `
    <div class="modal-product">
      <img src="${product.img}" alt="${product.name}">
      <div class="modal-info">
        <h2>${product.name}</h2>
        <div class="price">${product.price.toLocaleString()} د.ل</div>
        <p>${product.description || 'منتج إلكتروني مختار بعناية من متجر ميم نون مع ضمان جودة وسعر مناسب.'}</p>
        <button class="add-to-cart" onclick="addToCart(${product.id})">أضف إلى السلة</button>
      </div>
    </div>
  `;

  modal.style.display = 'block';
}

function closeProductModal() {
  const modal = document.getElementById('productModal');
  if (modal) modal.style.display = 'none';
}

function setupModalEvents() {
  const modal = document.getElementById('productModal');
  const closeBtn = document.querySelector('.close-modal');

  if (closeBtn) closeBtn.addEventListener('click', closeProductModal);

  if (modal) {
    modal.addEventListener('click', e => {
      if (e.target === modal) closeProductModal();
    });
  }
}

// ================== Toast ==================
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (toast) toast.remove();

  toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    toast.remove();
  }, 2500);
}

// ================== قائمة الجوال ==================
function setupMobileNav() {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');

  if (!menuToggle || !nav) return;

  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
  });
}

// ================== تسجيل الـ Service Worker ==================
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .catch(err => console.error('Service Worker registration failed', err));
    });
  }
}

// ================== تهيئة عامة عند تحميل الصفحة ==================
document.addEventListener('DOMContentLoaded', () => {
  updateUserHeader();
  updateCartCounter();
  setupMobileNav();
  setupModalEvents();
  registerServiceWorker();

  // صفحة المنتجات أو الرئيسية
  if (document.getElementById('productsGrid') || document.querySelector('.products-grid')) {
    renderProducts();
    setupFilters();
  }

  // صفحة السلة
  if (document.querySelector('.cart-section')) {
    loadCartPage();
    const clearCartBtn = document.getElementById('clearCart');
    if (clearCartBtn) {
      clearCartBtn.addEventListener('click', () => {
        localStorage.removeItem('cart');
        cart = [];
        loadCartPage();
        updateCartCounter();
        showToast('تم إفراغ السلة');
      });
    }
  }
});


// ========== دالة إتمام الطلب عبر واتساب فقط ==========

// دالة مساعدة لبناء نص الطلب
function buildOrderMessage() {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cartItems.length === 0) {
        alert('⚠️ السلة فارغة، أضف منتجات أولاً');
        return '';
    }
    
    // تصفية السلة: نحتفظ فقط بالمنتجات الموجودة في مصفوفة products
    const validCartItems = cartItems.filter(item => {
        const exists = products.some(p => p.id === item.id);
        if (!exists) {
    console.log(`تمت إزالة المنتج ${item.name} من السلة لأنه لم يعد متوفرًا.`);
    alert(`تمت إزالة "${item.name}" من سلتك لعدم توفره`); // 👈 استخدم alert
    }
        return exists;
    });
    
    // إذا أصبحت السلة فارغة بعد التصفية
    if (validCartItems.length === 0) {
        localStorage.removeItem('cart'); // إفراغ السلة
        alert('بعض المنتجات في سلتك لم تعد متوفرة وتمت إزالتها.');
        return '';
    }
    
    // تحديث السلة في localStorage بالمنتجات الصالحة فقط
    localStorage.setItem('cart', JSON.stringify(validCartItems));
    updateCartCounter(); // هذه الدالة موجودة في ملف script.js
    if (typeof loadCartPage === 'function') {
    loadCartPage(); // إعادة رسم السلة
}
    
    // بناء الرسالة باستخدام validCartItems
    let message = '📦 طلب جديد من متجر ميم نون:\n\n';
    let total = 0;
    
    validCartItems.forEach(item => {
        let itemTotal = item.price * item.quantity;
        message += `🔹 ${item.name}\n   الكمية: ${item.quantity} | السعر: ${item.price} د.ل\n   الإجمالي: ${itemTotal} د.ل\n\n`;
        total += itemTotal;
    });
    
    let shipping = 15;
    message += `─────────────────────\n🚚 رسوم الشحن: ${shipping} د.ل\n💰 المجموع النهائي: ${total + shipping} د.ل\n─────────────────────\nشكراً لتسوقك مع ميم نون ❤️`;
    
    return message;
}

// دالة إتمام الطلب عبر واتساب
function checkoutWhatsApp() {
    let message = buildOrderMessage();
    if (message) {
        let phoneNumber = '218931931419'; // رقم الواتساب
        let encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    }
}