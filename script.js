// ===== DOM Elements =====
const navbar = document.getElementById("navbar");
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");
const navLinks = document.querySelectorAll(".nav-link");
const reposGrid = document.getElementById("repos-grid");
const sections = document.querySelectorAll("section[id]");
const timelineItems = document.querySelectorAll(".timeline-item");

// ===== GitHub Username =====
const GITHUB_USERNAME = "charlie-179";

// ===== Language Colors =====
const languageColors = {
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#239120",
  Ruby: "#701516",
  Go: "#00ADD8",
  Rust: "#dea584",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  HTML: "#e34c26",
  CSS: "#1572B6",
  Shell: "#89e051",
  Vue: "#41b883",
  Dart: "#00B4AB",
  R: "#198CE7",
  Scala: "#c22d40",
  Lua: "#000080",
};

// ===== Navbar Scroll Effect =====
function handleNavbarScroll() {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}

window.addEventListener("scroll", handleNavbarScroll);

// ===== Mobile Menu Toggle =====
navToggle.addEventListener("click", () => {
  navToggle.classList.toggle("active");
  navMenu.classList.toggle("active");
});

// Close menu when clicking a link
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navToggle.classList.remove("active");
    navMenu.classList.remove("active");
  });
});

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
    navToggle.classList.remove("active");
    navMenu.classList.remove("active");
  }
});

// ===== Active Section Highlighting =====
function highlightActiveSection() {
  const scrollY = window.scrollY;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 150;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active");
        }
      });
    }
  });
}

window.addEventListener("scroll", highlightActiveSection);

// ===== Intersection Observer for Animations =====
const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.2,
};

const animationObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, observerOptions);

// Observe timeline items
timelineItems.forEach((item) => {
  animationObserver.observe(item);
});

// ===== GitHub API - Fetch Repositories =====
async function fetchGitHubRepos() {
  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch repositories");
    }

    const repos = await response.json();
    renderRepoCards(repos);
  } catch (error) {
    console.error("Error fetching repos:", error);
    renderRepoError();
  }
}

// ===== Render Repository Cards =====
function renderRepoCards(repos) {
  // Filter out forked repos and the portfolio repo itself, then take top 6
  const filteredRepos = repos
    .filter(
      (repo) => !repo.fork && repo.name !== `${GITHUB_USERNAME}.github.io`,
    )
    .slice(0, 6);

  if (filteredRepos.length === 0) {
    reposGrid.innerHTML = `
            <div class="repo-empty">
                <p>No repositories found yet. Check back soon!</p>
            </div>
        `;
    return;
  }

  reposGrid.innerHTML = filteredRepos
    .map(
      (repo, index) => `
        <div class="repo-card" style="animation: fadeInUp 0.5s ease forwards ${index * 0.1}s; opacity: 0;">
            <div class="repo-header">
                <svg class="repo-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                    <path d="M9 18c-4.51 2-5-2-7-2"/>
                </svg>
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-link" aria-label="View on GitHub">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                        <polyline points="15 3 21 3 21 9"/>
                        <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                </a>
            </div>
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-name">
                ${repo.name}
            </a>
            <p class="repo-description">
                ${repo.description || "No description available"}
            </p>
            <div class="repo-footer">
                ${
                  repo.language
                    ? `
                    <span class="repo-language">
                        <span class="language-dot" style="background-color: ${languageColors[repo.language] || "#858585"}"></span>
                        ${repo.language}
                    </span>
                `
                    : ""
                }
                <span class="repo-stat">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    ${repo.stargazers_count}
                </span>
                <span class="repo-stat">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="18" r="3"/>
                        <circle cx="6" cy="6" r="3"/>
                        <circle cx="18" cy="6" r="3"/>
                        <path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"/>
                        <path d="M12 12v3"/>
                    </svg>
                    ${repo.forks_count}
                </span>
            </div>
        </div>
    `,
    )
    .join("");
}

// ===== Render Error State =====
function renderRepoError() {
  reposGrid.innerHTML = `
        <div class="repo-card">
            <p class="repo-description" style="text-align: center;">
                Unable to load repositories at this time. 
                <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" rel="noopener noreferrer" style="color: var(--primary-light);">
                    Visit my GitHub profile
                </a>
            </p>
        </div>
    `;
}

// ===== Smooth Scroll for CTA =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// ===== Initialize =====
document.addEventListener("DOMContentLoaded", () => {
  // Fetch GitHub repos
  fetchGitHubRepos();

  // Initial scroll check
  handleNavbarScroll();
  highlightActiveSection();

  // Make first timeline item visible immediately if in view
  if (timelineItems.length > 0) {
    const firstItem = timelineItems[0];
    const rect = firstItem.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      firstItem.classList.add("visible");
    }
  }
});

// ===== Keyboard Navigation =====
document.addEventListener("keydown", (e) => {
  // Close mobile menu on Escape
  if (e.key === "Escape" && navMenu.classList.contains("active")) {
    navToggle.classList.remove("active");
    navMenu.classList.remove("active");
  }
});
