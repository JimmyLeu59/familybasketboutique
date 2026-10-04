(() => {
  "use strict";

  const products = window.FAMILY_BASKET_PRODUCTS;
  const grid = document.querySelector("#product-grid");
  const count = document.querySelector("#catalog-count");
  const filterButtons = document.querySelectorAll(".filter-button");
  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector("#site-nav");
  const year = document.querySelector("#current-year");

  if (!Array.isArray(products) || !grid || !count) {
    throw new Error("Impossible d'initialiser le catalogue Family Basket.");
  }

  const escapeHtml = (value) =>
    String(value).replace(/[&<>"']/g, (character) => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      };
      return entities[character];
    });

  const formatPrice = (price) => {
    if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
      return "Prix à confirmer";
    }
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR"
    }).format(price);
  };

  const renderProducts = (category = "all") => {
    const visibleProducts = products.filter(
      (product) => category === "all" || product.category === category
    );

    grid.innerHTML = visibleProducts.map((product) => {
      const hasOrderUrl = typeof product.orderUrl === "string" &&
        /^https:\/\/(www\.)?helloasso\.com\//i.test(product.orderUrl);
      const safeId = escapeHtml(product.id);
      const orderAction = hasOrderUrl
        ? `<a class="product-order" href="${escapeHtml(product.orderUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Commander ${escapeHtml(product.name)} sur HelloAsso">Commander <span aria-hidden="true">↗</span></a>`
        : `<button class="product-order" type="button" disabled aria-label="Lien de commande à venir pour ${escapeHtml(product.name)}">Bientôt disponible</button>`;

      return `
        <article class="product-card" data-product-id="${safeId}">
          <div
            class="product-art"
            style="--product-bg:${escapeHtml(product.background)};--product-accent:${escapeHtml(product.accent)};--product-accent-secondary:${escapeHtml(product.secondary)}"
            aria-hidden="true"
          >
            <span class="product-label">${escapeHtml(product.label)}</span>
            <span class="product-emoji">${escapeHtml(product.emoji)}</span>
          </div>
          <div class="product-info">
            <p class="product-category">${escapeHtml(product.categoryLabel)}</p>
            <h3>${escapeHtml(product.name)}</h3>
            <p class="product-description">${escapeHtml(product.description)}</p>
            <div class="product-footer">
              <span class="product-price">${escapeHtml(formatPrice(product.price))}</span>
              ${orderAction}
            </div>
          </div>
        </article>`;
    }).join("");

    count.textContent = `${visibleProducts.length} article${visibleProducts.length > 1 ? "s" : ""}`;
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.category;
      if (!category) {
        return;
      }
      filterButtons.forEach((filterButton) => {
        const isActive = filterButton === button;
        filterButton.classList.toggle("is-active", isActive);
        filterButton.setAttribute("aria-pressed", String(isActive));
      });
      renderProducts(category);
    });
  });

  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
      const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isExpanded));
      menuToggle.setAttribute("aria-label", isExpanded ? "Ouvrir le menu" : "Fermer le menu");
      siteNav.classList.toggle("is-open", !isExpanded);
    });

    siteNav.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest("a")) {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Ouvrir le menu");
        siteNav.classList.remove("is-open");
      }
    });
  }

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  renderProducts();
})();
