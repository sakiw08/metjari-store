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
    img: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: 2,
    name: "سامسونج S24 ألترا",
    price: 1100,
    category: "phones",
    img: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: 3,
    name: "ماك بوك برو M3",
    price: 4500,
    category: "laptops",
    img: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: 4,
    name: "سماعات إيربودز برو",
    price: 320,
    category: "accessories",
    img: "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: 5,
    name: "ساعة أبل واتش",
    price: 650,
    category: "accessories",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: 6,
    name: "لاب توب أسوس",
    price: 2200,
    category: "laptops",
    img: "https://images.unsplash.com/photo-1588702547923-7093a6c3b8e5?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: 7,
    name: "سماعة سوني وايرلس",
    price: 280,
    category: "accessories",
    img: "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: 8,
    name: "شاحن لاسلكي 20W",
    price: 75,
    category: "accessories",
    img: "https://images.pexels.com/photos/394372/pexels-photo-394372.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: 9,
    name: "سامسونج Z Fold6",
    price: 1850,
    category: "phones",
    img: "https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: 10,
    name: "ديل XPS 13",
    price: 3200,
    category: "laptops",
    img: "https://images.pexels.com/photos/1181243/pexels-photo-1181243.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: 11,
    name: "سماعة بوز 2 Pro",
    price: 450,
    category: "accessories",
    img: "https://images.unsplash.com/photo-1613427749842-0b3123449841?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: 12,
    name: "هواوي Watch GT5",
    price: 550,
    category: "accessories",
    img: "https://images.unsplash.com/photo-1542459595-7e7e912adee9?auto=compress&cs=tinysrgb&w=400"
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

// ================== عرض المنتجات (الصفحة الرئيسية + المنتجات) ==================
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
        <button class="quick-view" onclick="openProductModal(${product.id})">عرض سريع</button>
      </div>
    </div>
  `).join('');

  if (productsCountEl) {
    productsCountEl.textContent = productsToShow.length;
  }

  if (activeFiltersText) {
    const hasFiltersText = activeFiltersText.dataset.hasFilters === 'true';
    if (!hasFiltersText) {
      activeFiltersText.textContent = 'يمكنك استخدام الفلاتر للبحث حسب التصنيف أو السعر أو الاسم';
    }
  }
}

// ================== الفلاتر في صفحة المنتجات ==================
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

    // تحديث نص الفلاتر
    if (activeFiltersText) {
      const parts = [];
      if (category && category !== 'all') parts.push('التصنيف');
      if (price && price !== 'all') parts.push('السعر');
      if (term) parts.push('البحث');
      if (parts.length) {
        activeFiltersText.textContent = 'الفلاتر المفعّلة: ' + parts.join(' + ');
        activeFiltersText.dataset.hasFilters = 'true';
      } else {
        activeFiltersText.textContent = 'لا توجد فلاتر مفعّلة حالياً';
        activeFiltersText.dataset.hasFilters = 'false';
      }
    }

    renderProducts(filtered);
  }

  if (categorySelect) {
    categorySelect.addEventListener('change', applyFilters);
  }
  if (priceSelect) {
    priceSelect.addEventListener('change', applyFilters);
  }
  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

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
        <p>منتج إلكتروني مختار بعناية من متجر ميم نون مع ضمان جودة وسعر مناسب.</p>
        <button class="add-to-cart" onclick="addToCart(${product.id})">أضف إلى السلة</button>
      </div>
    </div>
  `;

  modal.style.display = 'block';
}

function closeProductModal() {
  const modal = document.getElementById('productModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

function setupModalEvents() {
  const modal = document.getElementById('productModal');
  const closeBtn = document.querySelector('.close-modal');

  if (closeBtn) {
    closeBtn.addEventListener('click', closeProductModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeProductModal();
      }
    });
  }
}

// ================== Toast ==================
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (toast) {
    toast.remove();
  }

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
    const isVisible = getComputedStyle(nav).display === 'flex';
    nav.style.display = isVisible ? 'none' : 'flex';
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
});                        <span class="stars">${'★'.repeat(roundedStars)}${'☆'.repeat(5-roundedStars)}</span>
                        <button class="review-btn" onclick="showReviewForm(${product.id})">
                            ${productReviews.length ? productReviews.length + ' تقييم' : 'أضف تقييم'}
                        </button>
                    </div>
                </div>
                <div class="review-form" id="reviewForm-${product.id}" style="display: none;">
                    <div class="stars-rating">
                        <span class="star" data-stars="5">★</span>
                        <span class="star" data-stars="4">★</span>
                        <span class="star" data-stars="3">★</span>
                        <span class="star" data-stars="2">★</span>
                        <span class="star" data-stars="1">★</span>
                    </div>
                    <textarea id="reviewComment-${product.id}" placeholder="شارك رأيك..."></textarea>
                    <button class="submit-review" onclick="submitReview(${product.id})">إرسال التقييم</button>
                </div>
            </div>
        `;
    }).join('');

    // تحديث عداد عدد المنتجات
    if (productsCountEl) {
        productsCountEl.textContent = productsToShow.length;
    }

    // تحديث نص حالة الفلاتر
    if (activeFiltersText) {
        if (productsToShow.length === products.length) {
            activeFiltersText.textContent = 'جميع المنتجات معروضة حالياً';
        } else if (productsToShow.length === 0) {
            activeFiltersText.textContent = 'لا توجد منتجات مطابقة للتصفية الحالية';
        } else {
            activeFiltersText.textContent = `تم العثور على ${productsToShow.length} منتج/منتجات مطابقة`;
        }
    }
}

// الفلاتر
function filterProducts() {
    const category = document.getElementById('categoryFilter')?.value || 'all';
    const price = document.getElementById('priceFilter')?.value || 'all';
    const search = document.getElementById('searchInput')?.value.toLowerCase() || '';

    const filtered = products.filter(product => {
        const matchCategory = category === 'all' || product.category === category;
        const matchPrice =
            price === 'all' ||
            (price === 'under500' && product.price < 500) ||
            (price === '500-1000' && product.price >= 500 && product.price <= 1000) ||
            (price === 'over1000' && product.price > 1000);
        const matchSearch = product.name.toLowerCase().includes(search);
        return matchCategory && matchPrice && matchSearch;
    });

    renderProducts(filtered);
}

// إعادة تعيين الفلاتر
function resetFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const searchInput = document.getElementById('searchInput');

    if (categoryFilter) categoryFilter.value = 'all';
    if (priceFilter) priceFilter.value = 'all';
    if (searchInput) searchInput.value = '';

    renderProducts(products);
}

// نظام التقييمات
function addReview(productId, stars, comment) {
    if (!reviews[productId]) reviews[productId] = [];
    
    reviews[productId].push({
        stars: parseInt(stars),
        comment: comment,
        user: getCurrentUser()?.name || getCurrentUser()?.email?.split('@')[0] || 'زائر',
        date: new Date().toLocaleDateString('ar-LY')
    });
    
    localStorage.setItem('reviews', JSON.stringify(reviews));
    showToast('✅ تم إضافة تقييمك');
}

function showReviewForm(productId) {
    const reviewForm = document.getElementById(`reviewForm-${productId}`);
    if (reviewForm) {
        reviewForm.style.display = reviewForm.style.display === 'block' ? 'none' : 'block';
    }
}

function submitReview(productId) {
    const activeStar = document.querySelector(`#reviewForm-${productId} .star.active`);
    const commentInput = document.getElementById(`reviewComment-${productId}`);
    if (!commentInput) return;

    const comment = commentInput.value.trim();
    
    if (!activeStar || !comment) {
        showToast('⚠️ يجب اختيار تقييم وكتابة تعليق');
        return;
    }
    
    addReview(productId, activeStar.dataset.stars, comment);
    commentInput.value = '';
    document
        .querySelectorAll(`#reviewForm-${productId} .star`)
        .forEach(s => s.classList.remove('active'));
    document.getElementById(`reviewForm-${productId}`).style.display = 'none';
    renderProducts(); // إعادة تحميل المنتجات لعرض التقييم الجديد
}

// Modal المنتج
function openModal(productId) {
    const product = products.find(p => p.id === productId);
    const modalBody = document.getElementById('productModalBody');
    const modal = document.getElementById('productModal');

    if (!product || !modalBody || !modal) return;

    modalBody.innerHTML = `
        <div class="modal-product">
            <img src="${product.img}" alt="${product.name}">
            <div class="modal-info">
                <h2>${product.name}</h2>
                <div class="price">${product.price.toLocaleString()} د.ل</div>
                <p>منتج عالي الجودة بأفضل الأسعار في ليبيا</p>
                <button onclick="addToCart(${product.id})" class="add-to-cart">أضف للسلة</button>
            </div>
        </div>
    `;
    modal.style.display = 'block';
}

// صفحة السلة
function loadCartPage() {
    const cartEmpty = document.getElementById('cartEmpty');
    const cartItems = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        if (cartEmpty) cartEmpty.style.display = 'block';
        if (cartItems) cartItems.style.display = 'none';
        return;
    }
    
    if (cartEmpty) cartEmpty.style.display = 'none';
    if (cartItems) cartItems.style.display = 'block';
    renderCartItems(cart);
}

function renderCartItems(cartArr) {
    const cartRows = document.getElementById('cartRows');
    if (!cartRows) return;
    
    let subtotal = 0;
    cartRows.innerHTML = cartArr.map(item => {
        const total = item.price * item.quantity;
        subtotal += total;
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
                <div class="cart-total">${total.toLocaleString()} د.ل</div>
                <div class="cart-remove">
                    <button onclick="removeFromCart(${item.id})" class="remove-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    const shipping = 15;
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');

    if (subtotalEl) subtotalEl.textContent = subtotal.toLocaleString() + ' د.ل';
    if (totalEl) totalEl.textContent = (subtotal + shipping).toLocaleString() + ' د.ل';
}

// نظام المستخدمين
function checkUserLogin() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const userNameEl = document.getElementById('userName');
    
    if (userNameEl && user && user.email) {
        userNameEl.textContent = user.email.split('@')[0];
    }
}

function toggleUserMenu() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user && user.email) {
        showToast('مرحباً ' + user.email.split('@')[0]);
    } else {
        window.location.href = 'login.html';
    }
}

// التوست
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// تشغيل الكود عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    updateCartCounter();
    checkUserLogin();
    
    // القائمة المتنقلة
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.style.display = (nav.style.display === 'flex') ? 'none' : 'flex';
        });
    }
    
    // الفلاتر
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const searchInput = document.getElementById('searchInput');
    const resetFiltersBtn = document.getElementById('resetFilters');
    
    if (categoryFilter) categoryFilter.addEventListener('change', filterProducts);
    if (priceFilter) priceFilter.addEventListener('change', filterProducts);
    if (searchInput) searchInput.addEventListener('input', filterProducts);
    if (resetFiltersBtn) resetFiltersBtn.addEventListener('click', resetFilters);
    
    // عرض المنتجات في صفحة المنتجات
    if (document.getElementById('productsGrid') || document.querySelector('.products-grid')) {
        renderProducts();
    }
    
    // صفحة السلة
    if (window.location.pathname.includes('cart.html')) {
        loadCartPage();
    }
    
    // إغلاق Modal
    document.addEventListener('click', (e) => {
        const modal = document.getElementById('productModal');
        if (!modal) return;

        if (e.target.classList.contains('product-modal') || e.target.classList.contains('close-modal')) {
            modal.style.display = 'none';
        }
    });

    // Service Worker لـ PWA (يتطلب المسار الصحيح للملف)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    // نجوم التقييم
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('star')) {
            const stars = e.target.parentElement.querySelectorAll('.star');
            const rating = parseInt(e.target.dataset.stars);
            
            stars.forEach((star, index) => {
                if (index < rating) {
                    star.classList.add('active');
                } else {
                    star.classList.remove('active');
                }
            });
        }
    });
});
