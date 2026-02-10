# Charlie Miller | Portfolio

A creative, modern portfolio website built with vanilla HTML, CSS, and JavaScript.

## Features

- **Responsive Design** - Works seamlessly across desktop, tablet, and mobile
- **Dynamic GitHub Repos** - Automatically fetches and displays repositories via GitHub API
- **Creative Animations** - Smooth scroll-triggered animations and floating geometric shapes
- **Glassmorphism UI** - Modern card designs with backdrop blur effects
- **Accessible** - Respects reduced motion preferences and includes keyboard navigation

## Sections

- **Hero** - Bold landing with gradient text and animated background shapes
- **About** - Introduction and skills overview
- **Repos** - Dynamically loaded GitHub repositories with language indicators
- **Experience** - Timeline-style work/project history

## Local Development

```bash
# Start a local server
python3 -m http.server 8080

# Or use any static file server
npx serve
```

Then open `http://localhost:8080` in your browser.

## Deployment

This site is designed for GitHub Pages. Simply push to the `main` branch and it will be available at `https://charlie-179.github.io`.

## Technologies

- HTML5 semantic markup
- CSS3 (custom properties, flexbox, grid, animations)
- Vanilla JavaScript (Fetch API, Intersection Observer)
- Google Fonts (Space Grotesk, Inter)
