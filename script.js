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
            <div class="repo-card">
                <p class="repo-description">$ ls: directory empty. No repositories found.</p>
            </div>
        `;
    return;
  }

  reposGrid.innerHTML = filteredRepos
    .map(
      (repo, index) => `
        <div class="repo-card">
            <div class="repo-header">
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-name">${repo.name}</a>
            </div>
            <p class="repo-description">${repo.description || "No description"}</p>
            <div class="repo-footer">
                ${
                  repo.language
                    ? `<span class="repo-language">${repo.language}</span>`
                    : ""
                }
                <span class="repo-stat">★ ${repo.stargazers_count}</span>
                <span class="repo-stat">⑂ ${repo.forks_count}</span>
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
            <p class="repo-description">ERROR: Failed to fetch repositories. <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" rel="noopener noreferrer" style="color: var(--term-cyan);">Try manually → github.com/${GITHUB_USERNAME}</a></p>
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

// ===== See More Toggle =====
const seeMoreBtn = document.getElementById("see-more-btn");
const timeline = document.getElementById("timeline");

if (seeMoreBtn && timeline) {
  seeMoreBtn.addEventListener("click", () => {
    timeline.classList.toggle("expanded");

    // Update button text
    const textSpan = seeMoreBtn.querySelector(".see-more-text");
    if (timeline.classList.contains("expanded")) {
      textSpan.textContent = "[ See Less ]";
      // Trigger staggered animation for newly visible items
      const hiddenItems = timeline.querySelectorAll(
        ".timeline-item:nth-child(n+4)",
      );
      hiddenItems.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add("visible");
        }, index * 150);
      });
    } else {
      textSpan.textContent = "[ See More ]";
    }
  });
}
