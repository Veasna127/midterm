
  // ── State ──
  let activeCat = 'all';
  let activeSort = 'newest';
  let searchQuery = '';

  // ── Elements ──
  const cards = document.querySelectorAll('.product-card');
  const resultCount = document.getElementById('resultCount');
  const noResults = document.getElementById('noResults');

  // Search
  const searchToggle = document.getElementById('searchToggle');
  const searchInputWrap = document.getElementById('searchInputWrap');
  const searchInput = document.getElementById('searchInput');
  const searchClear = document.getElementById('searchClear');

  // Category
  const catBtn = document.getElementById('catBtn');
  const catLabel = document.getElementById('catLabel');
  const catMenu = document.getElementById('catMenu');
  const catChevron = document.getElementById('catChevron');
  const catOptions = catMenu.querySelectorAll('.filter-option');
  const activeBadge = document.getElementById('activeBadge');
  const activeBadgeLabel = document.getElementById('activeBadgeLabel');
  const clearCat = document.getElementById('clearCat');

  // Sort
  const sortBtn = document.getElementById('sortBtn');
  const sortLabel = document.getElementById('sortLabel');
  const sortMenu = document.getElementById('sortMenu');
  const sortChevron = document.getElementById('sortChevron');
  const sortOptions = sortMenu.querySelectorAll('.sort-option');

  // ── Search toggle ──
  searchToggle.addEventListener('click', () => {
    const isOpen = searchInputWrap.classList.contains('open');
    if (isOpen) {
      searchInputWrap.classList.remove('open');
      searchInput.value = '';
      searchQuery = '';
      applyFilters();
    } else {
      searchInputWrap.classList.add('open');
      setTimeout(() => searchInput.focus(), 320);
    }
  });

  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value.trim().toLowerCase();
    applyFilters();
  });

  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    applyFilters();
    searchInput.focus();
  });

  // ── Category dropdown ──
  catBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = catMenu.classList.contains('open');
    closeAllDropdowns();
    if (!isOpen) {
      catMenu.classList.add('open');
      catChevron.style.transform = 'rotate(180deg)';
    }
  });

  catOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      activeCat = opt.dataset.value;
      catLabel.textContent = opt.textContent.trim();
      catOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      closeAllDropdowns();

      // Badge
      if (activeCat === 'all') {
        activeBadge.style.display = 'none';
      } else {
        activeBadgeLabel.textContent = opt.textContent.trim();
        activeBadge.style.display = 'inline-flex';
      }
      applyFilters();
    });
  });

  clearCat.addEventListener('click', () => {
    activeCat = 'all';
    catLabel.textContent = 'All Items';
    catOptions.forEach(o => o.classList.remove('selected'));
    catOptions[0].classList.add('selected');
    activeBadge.style.display = 'none';
    applyFilters();
  });

  // ── Sort dropdown ──
  sortBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = sortMenu.classList.contains('open');
    closeAllDropdowns();
    if (!isOpen) {
      sortMenu.classList.add('open');
      sortChevron.style.transform = 'rotate(180deg)';
    }
  });

  sortOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      activeSort = opt.dataset.value;
      sortLabel.textContent = opt.textContent.trim();
      sortOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      closeAllDropdowns();
      applyFilters();
    });
  });

  // Close on outside click
  document.addEventListener('click', closeAllDropdowns);

  function closeAllDropdowns() {
    catMenu.classList.remove('open');
    sortMenu.classList.remove('open');
    catChevron.style.transform = 'rotate(0deg)';
    sortChevron.style.transform = 'rotate(0deg)';
  }

  // ── Filter + Sort logic ──
  function applyFilters() {
    const grid = document.getElementById('productGrid');
    let visible = [];

    cards.forEach(card => {
      const cat = card.dataset.cat;
      const name = card.dataset.name.toLowerCase();
      const catMatch = activeCat === 'all' || cat === activeCat;
      const searchMatch = searchQuery === '' || name.includes(searchQuery);

      if (catMatch && searchMatch) {
        card.classList.remove('hidden-item');
        visible.push(card);
      } else {
        card.classList.add('hidden-item');
      }
    });

    // Sort visible cards
    const sortedCards = [...visible].sort((a, b) => {
      const pa = parseInt(a.dataset.price);
      const pb = parseInt(b.dataset.price);
      if (activeSort === 'price-asc') return pa - pb;
      if (activeSort === 'price-desc') return pb - pa;
      return 0; // newest = original order
    });

    // Re-insert in sorted order (before noResults div)
    sortedCards.forEach(card => grid.insertBefore(card, noResults));

    // No results
    noResults.style.display = visible.length === 0 ? 'block' : 'none';

    // Count
    resultCount.textContent = visible.length === 1 ? '1 item' : `${visible.length} items`;
  }

  // Init
  applyFilters();

  // ===== CART STORAGE =====
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// ===== ADD TO CART =====
function addToCart(product) {
    let cart = getCart();

    let existing = cart.find(item => item.name === product.name);

    if (existing) {
        existing.qty += 1;
    } else {
        product.qty = 1;
        cart.push(product);
    }

    saveCart(cart);
    alert("Added to shopping bag!");
}

// ===== CLICK BUTTON EVENT =====
document.querySelectorAll(".product-card").forEach(card => {
    const btn = card.querySelector("button");

    btn.addEventListener("click", () => {
        const product = {
            name: card.dataset.name,
            price: parseFloat(card.dataset.price),
            category: card.dataset.cat,
            image: card.querySelector("img").src
        };

        addToCart(product);
    });
});

// ===== CART STORAGE =====
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// ===== RENDER CART =====
function renderCart() {
    const cart = getCart();
    const container = document.getElementById("cartItems");

    let subtotal = 0;

    // update count
    document.getElementById("cartCount").innerText =
        "Shopping Bag (" + cart.length + ")";

    if (cart.length === 0) {
        container.innerHTML = "<p>Your bag is empty</p>";
        document.getElementById("subtotal").innerText = "$0";
        document.getElementById("total").innerText = "$0";
        return;
    }

    container.innerHTML = "";

    cart.forEach((item, index) => {
        subtotal += item.price * item.qty;

        container.innerHTML += `
        <div class="flex gap-6 border-b border-zinc-700 pb-6">

            <img src="${item.image}" class="w-32 h-40 object-cover">

            <div class="flex-1 flex flex-col justify-between">

                <div class="flex justify-between">
                    <h3>${item.name}</h3>
                    <span>$${item.price}</span>
                </div>

                <div class="flex justify-between items-center mt-4">

                    <div class="flex gap-4 border px-3 py-1">
                        <button onclick="changeQty(${index}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button onclick="changeQty(${index}, 1)">+</button>
                    </div>

                    <button onclick="removeItem(${index})" class="text-red-400">
                        Remove
                    </button>

                </div>
            </div>

        </div>
        `;
    });

    document.getElementById("subtotal").innerText = "$" + subtotal;
    document.getElementById("total").innerText = "$" + subtotal;
}

// ===== CHANGE QTY =====
function changeQty(index, change) {
    let cart = getCart();

    cart[index].qty += change;

    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }

    saveCart(cart);
    renderCart();
}

// ===== REMOVE =====
function removeItem(index) {
    let cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCart();
}

// LOAD
renderCart();

