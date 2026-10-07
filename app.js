// Renders the project lists from data/projects.json and reveals sections on scroll.

const codeList = document.getElementById("codeList");
const designList = document.getElementById("designList");
const brandList = document.getElementById("brandList");

// Small helper: el("p", { class: "x" }, "text" or child nodes...)
function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [name, value] of Object.entries(attrs)) {
    if (value !== undefined && value !== null) node.setAttribute(name, value);
  }
  for (const child of children) {
    if (child !== undefined && child !== null) node.append(child);
  }
  return node;
}

function externalLink(href, text, className) {
  return el(
    "a",
    { href, class: className, target: "_blank", rel: "noopener noreferrer" },
    text,
  );
}

function picture(src, alt, className) {
  return el(
    "div",
    { class: className },
    el("img", { src, alt: alt || "", loading: "lazy", decoding: "async" }),
  );
}

function stackList(stack) {
  return el(
    "ul",
    { class: "stack", "aria-label": "Built with" },
    ...stack.map((tech) => el("li", {}, tech)),
  );
}

function codeProject(project, index) {
  const featured = index === 0;

  const text = el(
    "div",
    { class: "projectText" },
    el("p", { class: "kind" }, project.kind),
    el("h3", {}, project.title),
    el("p", { class: "projectDesc" }, project.description),
    featured && project.points
      ? el("ul", { class: "points" }, ...project.points.map((p) => el("li", {}, p)))
      : null,
    stackList(project.stack),
    el(
      "div",
      { class: "projectLinks" },
      externalLink(project.live, "Open it", "button small"),
      externalLink(project.code, "Read the code", "button small ghost"),
    ),
  );

  return el(
    "article",
    { class: featured ? "project featured reveal" : "project reveal" },
    picture(project.image, project.alt, "shot"),
    text,
  );
}

function designProject(project) {
  return el(
    "article",
    { class: "designCard reveal" },
    project.image ? picture(project.image, project.alt, "designShot") : null,
    el(
      "div",
      { class: "designText" },
      el("p", { class: "kind" }, project.kind),
      el("h3", {}, project.title),
      el("p", {}, project.description),
      project.link ? externalLink(project.link, project.linkLabel, "textLink") : null,
    ),
  );
}

function brandPiece(piece) {
  return el(
    "figure",
    { class: "brandPiece reveal" },
    el("img", {
      src: piece.image,
      alt: `${piece.title}: ${piece.kind}`,
      loading: "lazy",
      decoding: "async",
    }),
    el("figcaption", {}, el("strong", {}, piece.title), ` ${piece.kind}`),
  );
}

// Sections fade up the first time they scroll into view.
// Without IntersectionObserver (or with reduced motion) everything is simply visible.
function revealOnScroll() {
  const items = document.querySelectorAll(".reveal");
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (still || !("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("in"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -8% 0px" },
  );
  items.forEach((item) => observer.observe(item));
}

async function loadProjects() {
  try {
    const response = await fetch("data/projects.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    codeList.replaceChildren(...data.code.map(codeProject));
    designList.replaceChildren(...data.design.map(designProject));
    brandList.replaceChildren(...data.brand.map(brandPiece));
  } catch (error) {
    console.error("Could not load projects", error);
    codeList.replaceChildren(
      el(
        "p",
        { class: "loading" },
        "The projects could not be loaded. You can find them on ",
        externalLink("https://github.com/Soodabug", "GitHub", "textLink"),
        ".",
      ),
    );
  }

  revealOnScroll();
}

loadProjects();
