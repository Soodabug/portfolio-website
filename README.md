# Portfolio

My personal site: https://soodabug.github.io/portfolio-website/

Plain HTML, CSS and JavaScript, no framework and no build step. GitHub Pages serves the files as they are.

## How it works

- `index.html` has the fixed parts of the page.
- `data/projects.json` holds the projects (code, design and brand work). `app.js` reads it and builds the lists, so adding a project means adding an object to that file.
- `style.css` is one stylesheet. The fonts are in `assets/fonts`, nothing is loaded from other sites.
- Sections fade in the first time they are scrolled into view. With "reduce motion" switched on in the system, nothing moves.

## Run it

`fetch` needs a server, so opening the file directly will not load the projects.

```bash
python -m http.server 8000
```

Then open http://localhost:8000.
