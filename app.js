const projectGrid = document.getElementById("projectGrid");
const spotlightTitle = document.getElementById("spotlightTitle");
const spotlightDescription = document.getElementById("spotlightDescription");
const spotlightLive = document.getElementById("spotlightLive");
const spotlightCode = document.getElementById("spotlightCode");
const spotlightTag = document.getElementById("spotlightTag");

const form = document.getElementById("contactForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const messageError = document.getElementById("messageError");
const charCount = document.getElementById("charCount");

document.addEventListener("DOMContentLoaded", () => {
  loadProjects();
  setupForm();
});

async function loadProjects() {
  try {
    const response = await fetch("./data/projects.json");

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const projects = await response.json();
    console.log(projects);

    if (!Array.isArray(projects) || projects.length === 0) {
      throw new Error("projects.json is empty or not an array");
    }

    renderProjects(projects);
    updateSpotlight(projects[0]);
  } catch (error) {
    console.error("Project loading error:", error);

    if (spotlightTitle) {
      spotlightTitle.textContent = "Could not load projects";
    }

    if (spotlightDescription) {
      spotlightDescription.textContent =
        "Check app.js, projects.json, and the file path.";
    }

    if (spotlightLive) spotlightLive.style.display = "none";
    if (spotlightCode) spotlightCode.style.display = "none";
  }
}

function renderProjects(projects) {
  if (!projectGrid) return;

  projectGrid.innerHTML = "";

  projects.forEach((project) => {
    const card = document.createElement("article");
    card.className = "project-card";

    card.innerHTML = `
      <span class="tag">${project.stack || "Project"}</span>
      <h4>${project.title || "Untitled Project"}</h4>
      <p>${project.summary || "No summary available."}</p>
    `;

    card.addEventListener("click", () => {
      updateSpotlight(project);
    });

    projectGrid.appendChild(card);
  });
}

function updateSpotlight(project) {
  if (!project) return;

  if (spotlightTitle) {
    spotlightTitle.textContent = project.title || "Untitled Project";
  }

  if (spotlightDescription) {
    spotlightDescription.textContent =
      project.description || "No description available.";
  }

  if (spotlightTag) {
    spotlightTag.textContent = project.stack || "Project";
  }

  if (spotlightLive) {
    if (project.live && project.live !== "#") {
      spotlightLive.href = project.live;
      spotlightLive.style.display = "inline-flex";
    } else {
      spotlightLive.style.display = "none";
    }
  }

  if (spotlightCode) {
    if (project.code && project.code !== "#") {
      spotlightCode.href = project.code;
      spotlightCode.style.display = "inline-flex";
    } else {
      spotlightCode.style.display = "none";
    }
  }
}

function setupForm() {
  if (!form) return;

  updateCharCount();

  if (messageInput) {
    messageInput.addEventListener("input", updateCharCount);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors();

    const name = nameInput ? nameInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";
    const message = messageInput ? messageInput.value.trim() : "";

    let isValid = true;

    if (name.length < 2) {
      if (nameError) nameError.textContent = "Please enter your name.";
      isValid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (emailError) emailError.textContent = "Please enter a valid email.";
      isValid = false;
    }

    if (message.length < 10) {
      if (messageError) {
        messageError.textContent = "Message must be at least 10 characters.";
      }
      isValid = false;
    }

    if (isValid) {
      alert("Thanks! Your message passed validation.");
      form.reset();
      updateCharCount();
    }
  });
}

function updateCharCount() {
  if (charCount && messageInput) {
    charCount.textContent = `${messageInput.value.length}/300`;
  }
}

function clearErrors() {
  if (nameError) nameError.textContent = "";
  if (emailError) emailError.textContent = "";
  if (messageError) messageError.textContent = "";
}
