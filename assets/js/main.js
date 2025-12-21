/**
 * DSC Community - Main JavaScript
 * Futuristic Design System
 */

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  initPlatformDetection();
  initTheme();
  initHeader();
  initSearch();
  initCodeHighlight();
  initSmoothScroll();
  initAnimations();
});

/**
 * Platform Detection
 * Adds 'is-mac' class to html element for platform-specific UI
 */
function initPlatformDetection() {
  const isMac =
    navigator.platform.toUpperCase().indexOf("MAC") >= 0 ||
    navigator.userAgent.toUpperCase().indexOf("MAC") >= 0;
  if (isMac) {
    document.documentElement.classList.add("is-mac");
  }
}

/**
 * Theme Management
 */
function initTheme() {
  const theme =
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");
  setTheme(theme);
  updateThemeToggle(theme);

  // Listen for system theme changes
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (!localStorage.getItem("theme")) {
        setTheme(e.matches ? "dark" : "light");
      }
    });
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  updateThemeToggle(theme);
}

function updateThemeToggle(theme) {
  const sunIcon = document.querySelector(".sun-icon");
  const moonIcon = document.querySelector(".moon-icon");

  if (sunIcon && moonIcon) {
    if (theme === "dark") {
      sunIcon.style.display = "none";
      moonIcon.style.display = "block";
    } else {
      sunIcon.style.display = "block";
      moonIcon.style.display = "none";
    }
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  localStorage.setItem("theme", next);
  setTheme(next);
}

// Expose globally
window.toggleTheme = toggleTheme;

/**
 * Header Scroll Effects
 */
function initHeader() {
  const header = document.getElementById("siteHeader");
  if (!header) return;

  let lastScroll = 0;

  window.addEventListener(
    "scroll",
    () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }

      lastScroll = currentScroll;
    },
    { passive: true }
  );
}

/**
 * Mobile Menu
 */
function toggleMobileMenu() {
  const nav = document.getElementById("mainNav");
  const toggle = document.getElementById("menuToggle");

  if (nav && toggle) {
    nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", nav.classList.contains("open"));
  }
}

window.toggleMobileMenu = toggleMobileMenu;

/**
 * Search Modal
 */
let searchIndex = [];

function initSearch() {
  // Build search index from page data
  buildSearchIndex();

  // Keyboard shortcut
  document.addEventListener("keydown", (e) => {
    // Cmd/Ctrl + K to open search
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      openSearchModal();
    }

    // Escape to close
    if (e.key === "Escape") {
      closeSearchModal();
    }
  });

  // Close on backdrop click
  const modal = document.getElementById("searchModal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeSearchModal();
      }
    });
  }

  // Search input handler
  const input = document.getElementById("searchInput");
  if (input) {
    input.addEventListener("input", debounce(handleSearch, 200));
    input.addEventListener("keydown", handleSearchNavigation);
  }
}

function buildSearchIndex() {
  // This will be populated by Hugo template data
  // For now, we'll create a basic index from DOM elements
  const links = document.querySelectorAll("a[href]");
  const seen = new Set();

  links.forEach((link) => {
    const href = link.getAttribute("href");
    const text = link.textContent.trim();

    if (href && text && href.startsWith("/") && !seen.has(href)) {
      seen.add(href);
      searchIndex.push({
        title: text,
        url: href,
        section: getSectionFromUrl(href),
      });
    }
  });
}

function getSectionFromUrl(url) {
  const parts = url.split("/").filter(Boolean);
  if (parts.length > 0) {
    return parts[0].replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
  }
  return "Page";
}

function openSearchModal() {
  const modal = document.getElementById("searchModal");
  const input = document.getElementById("searchInput");

  if (modal) {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    if (input) {
      setTimeout(() => input.focus(), 100);
    }
  }
}

function closeSearchModal() {
  const modal = document.getElementById("searchModal");
  const input = document.getElementById("searchInput");

  if (modal) {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (input) {
      input.value = "";
    }

    // Clear results
    const results = document.getElementById("searchResults");
    if (results) {
      results.innerHTML = "";
    }
  }
}

window.openSearchModal = openSearchModal;
window.closeSearchModal = closeSearchModal;

function handleSearch(e) {
  const query = e.target.value.toLowerCase().trim();
  const results = document.getElementById("searchResults");

  if (!results) return;

  if (!query) {
    results.innerHTML = "";
    return;
  }

  const matches = searchIndex
    .filter((item) => item.title.toLowerCase().includes(query))
    .slice(0, 10);

  if (matches.length === 0) {
    results.innerHTML = `
      <div style="padding: var(--space-6); text-align: center; color: var(--text-tertiary);">
        No results found for "${query}"
      </div>
    `;
    return;
  }

  results.innerHTML = matches
    .map(
      (item, index) => `
    <a href="${item.url}" class="search-result-item${
        index === 0 ? " focused" : ""
      }" data-index="${index}">
      <div class="search-result-icon">
        <i class="ri-file-text-line"></i>
      </div>
      <div class="search-result-content">
        <div class="search-result-title">${highlightMatch(
          item.title,
          query
        )}</div>
        <div class="search-result-path">${item.section}</div>
      </div>
    </a>
  `
    )
    .join("");
}

function highlightMatch(text, query) {
  const regex = new RegExp(`(${escapeRegex(query)})`, "gi");
  return text.replace(
    regex,
    '<mark style="background: rgba(59, 130, 246, 0.3); color: inherit; padding: 0 2px; border-radius: 2px;">$1</mark>'
  );
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function handleSearchNavigation(e) {
  const results = document.getElementById("searchResults");
  if (!results) return;

  const items = results.querySelectorAll(".search-result-item");
  if (items.length === 0) return;

  const focused = results.querySelector(".search-result-item.focused");
  let focusedIndex = focused ? parseInt(focused.dataset.index) : -1;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    focusedIndex = (focusedIndex + 1) % items.length;
    updateFocus(items, focusedIndex);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    focusedIndex = focusedIndex <= 0 ? items.length - 1 : focusedIndex - 1;
    updateFocus(items, focusedIndex);
  } else if (e.key === "Enter" && focused) {
    e.preventDefault();
    window.location.href = focused.getAttribute("href");
  }
}

function updateFocus(items, index) {
  items.forEach((item, i) => {
    item.classList.toggle("focused", i === index);
  });

  // Scroll into view
  const focused = items[index];
  if (focused) {
    focused.scrollIntoView({ block: "nearest" });
  }
}

/**
 * Code Highlighting
 */
function initCodeHighlight() {
  if (typeof hljs !== "undefined") {
    hljs.highlightAll();
  }
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });

        // Update URL
        history.pushState(null, null, targetId);
      }
    });
  });
}

/**
 * Intersection Observer for Animations
 */
function initAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in-up");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  document
    .querySelectorAll(".card, .feature-card, .timeline-card")
    .forEach((el) => {
      el.style.opacity = "0";
      observer.observe(el);
    });
}

/**
 * Utility: Debounce
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Timeline Year Groups Toggle (for Community Calls)
 */
function toggleYearGroup(year) {
  const group = document.querySelector(`[data-year="${year}"]`);
  if (group) {
    group.classList.toggle("collapsed");
  }
}

window.toggleYearGroup = toggleYearGroup;
