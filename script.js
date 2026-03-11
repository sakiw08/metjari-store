// دالة المستخدم الحالي
function getCurrentUser() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (user) {
        const fullUser = users.find(u => u.email === user.email);
        return fullUser || user;
    }
    return null;
}

// بيانات المنتجات
const products = [
    {id: 1, name: "آيفون 15 برو ماكس", price: 1250, category: "phones", img: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?fm=jpg&w=400&fit=crop"},
    {id: 2, name: "سامسونج S24 ألترا", price: 1100, category: "phones", img: "images/product1.jpg"},
    {id: 3, name: "مايك بوك برو M3", price: 4500, category: "laptops", img: "https://images.unsplash.com/photo-1613673701975-71f972a5bd95?w=400"},
    {id: 4, name: "سماعات إيربودز برو", price: 320, category: "accessories", img: "https://images.unsplash.com/photo-1588423771079-318a717d9ced?w=400"},
    {id: 5, name: "ساعة أبل واتش", price: 650, category: "accessories", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"},
    {id: 6, name: "لاب توب أسوس", price: 2200, category: "laptops", img: "https://images.unsplash.com/photo-1588702547923-7093a6c3b8e5?w=400"}
];

// السلة والتقييمات
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let reviews = JSON.parse(localStorage.getItem('reviews')) || {};

// تحديث عداد السلة
function updateCartCounter() {
    const cartCounter = document.querySelector('.cart-count');
    if (cartCounter) {
        cartCounter.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
}

// نظام السلة
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);
    
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({...product, quantity: 1});
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    showToast('✅ تم إضافة المنتج للسلة!');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    loadCartPage();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCounter();
            loadCartPage();
        }
    }
}

// عرض المنتجات مع التقييمات
function renderProducts(productsToShow = products) {
    const grid = document.getElementById('productsGrid') || document.querySelector('.products-grid');
    if (grid) {
        grid.innerHTML = productsToShow.map(product => {
            const productReviews = reviews[product.id] || [];
            const avgStars = productReviews.length ? 
                (productReviews.reduce((sum, r) => sum + r.stars, 0) / productReviews.length) : 0;
            const roundedStars = Math.round(avgStars);
            
            return `
                <div class="product-card" data-category="${product.category}" data-price="${product.price}">
                    <img src="${product.img}" alt="${product.name}" loading="lazy">
                    <h3>${product.name}</h3>
                    <div class="price">${product.price.toLocaleString()} د.ل</div>
                    <div class="product-actions">
                        <button class="add-to-cart" onclick="addToCart(${product.id})">
                            <i class="fas fa-cart-plus"></i> أضف للسلة
                        </button>
                        <button class="quick-view" onclick="openModal(${product.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                    <div class="product-reviews" id="reviews-${product.id}">
                        <div class="reviews-summary">
                            <span class="stars">${'★'.repeat(roundedStars)}${'☆'.repeat(5-roundedStars)}</span>
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
    }
}

// الفلاتر
function filterProducts() {
    const category = document.getElementById('categoryFilter')?.value || 'all';
    const price = document.getElementById('priceFilter')?.value || 'all';
    const search = document.getElementById('searchInput')?.value.toLowerCase() || '';

    let filtered = products.filter(product => {
        const matchCategory = category === 'all' || product.category === category;
        const matchPrice = price === 'all' || 
            (price === 'under500' && product.price < 500) ||
            (price === '500-1000' && product.price >= 500 && product.price <= 1000) ||
            (price === 'over1000' && product.price > 1000);
        const matchSearch = product.name.toLowerCase().includes(search);
        return matchCategory && matchPrice && matchSearch;
    });
    renderProducts(filtered);
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
    const stars = document.querySelector(`#reviewForm-${productId} .star.active`);
    const comment = document.getElementById(`reviewComment-${productId}`).value.trim();
    
    if (!stars || !comment) {
        showToast('⚠️ يجب اختيار تقييم وكتابة تعليق');
        return;
    }
    
    addReview(productId, stars.dataset.stars, comment);
    document.getElementById(`reviewComment-${productId}`).value = '';
    document.querySelectorAll(`#reviewForm-${productId} .star`).forEach(s => s.classList.remove('active'));
    document.getElementById(`reviewForm-${productId}`).style.display = 'none';
    renderProducts(); // إعادة تحميل المنتجات لعرض التقييم الجديد
}

// Modal المنتج
function openModal(productId) {
    const product = products.find(p => p.id === productId);
    const modalBody = document.getElementById('productModalBody');
    if (modalBody && product) {
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
        document.getElementById('productModal').style.display = 'block';
    }
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

function renderCartItems(cart) {
    const cartRows = document.getElementById('cartRows');
    if (!cartRows) return;
    
    let subtotal = 0;
    cartRows.innerHTML = cart.map(item => {
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
    document.getElementById('subtotal').textContent = subtotal.toLocaleString() + ' د.ل';
    document.getElementById('total').textContent = (subtotal + shipping).toLocaleString() + ' د.ل';
}

// نظام المستخدمين
function checkUserLogin() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const userNameEl = document.getElementById('userName');
    
    if (userNameEl && user) {
        userNameEl.textContent = user.email.split('@')[0];
    }
}

function toggleUserMenu() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        showToast('مرحباً ' + user.email.split('@')[0]);
    } else {
        window.location.href = 'login.html';
    }
}

// القوائم والتفاعلات
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
            nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
        });
    }
    
    // الفلاتر
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const searchInput = document.getElementById('searchInput');
    
    if (categoryFilter) categoryFilter.addEventListener('change', filterProducts);
    if (priceFilter) priceFilter.addEventListener('change', filterProducts);
    if (searchInput) searchInput.addEventListener('input', filterProducts);
    
    // عرض المنتجات
    if (document.getElementById('productsGrid') || document.querySelector('.products-grid')) {
        renderProducts();
    }
    
    // صفحة السلة
    if (window.location.pathname.includes('cart.html')) {
        loadCartPage();
    }
    
    // إغلاق Modal
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('product-modal') || e.target.classList.contains('close-modal')) {
            document.getElementById('productModal').style.display = 'none';
        }
    });

    if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
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
