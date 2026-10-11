
/*
 * MY DRIVE CONFIGURATION
 *
 * This is public browser code.
 * Do not put GitHub tokens or secrets in this file.
 *
 * The login below is a convenience screen only.
 * It is not secure authentication.
 */

const CONFIG = {
  // Replace with your GitHub username:
  githubOwner: "elabnpd",

  // Name of your private file-storage repository:
  storageRepo: "DriveNpd",

  // Convenience-only login credentials:
  sharedUsername: "mydrive",
  sharedPassword: "12345678",

  // Folder shortcuts:
  folders: [
    { name: "Documents", path: "Documents", icon: "📄" },
    { name: "Projects", path: "Projects", icon: "🧩" },
    { name: "Electronics", path: "Electronics", icon: "⚡" },
    { name: "College", path: "College", icon: "🎓" },
    { name: "Personal", path: "Personal", icon: "🗂️" },
    { name: "Images", path: "Images", icon: "🖼️" }
  ]
};

const $ = (id) => document.getElementById(id);

function repositoryURL() {
  return "https://github.com/" +
    encodeURIComponent(CONFIG.githubOwner) + "/" +
    encodeURIComponent(CONFIG.storageRepo);
}

function uploadURL() {
  return repositoryURL() + "/upload/main";
}

function folderURL(path) {
  const encodedPath = path
    .split("/")
    .map(encodeURIComponent)
    .join("/");

  return repositoryURL() + "/tree/main/" + encodedPath;
}

function createFolderURL() {
  return repositoryURL() + "/new/main/Documents";
}

function configureLinks() {
  $("allFilesLink").href = repositoryURL();
  $("browseLink").href = repositoryURL();
  $("uploadLink").href = uploadURL();
  $("createFolderLink").href = createFolderURL();

  renderFolders(CONFIG.folders);
}

function renderFolders(folders) {
  const grid = $("folderGrid");
  grid.replaceChildren();

  folders.forEach((folder) => {
    const link = document.createElement("a");
    link.className = "folder";
    link.href = folderURL(folder.path);
    link.target = "_blank";
    link.rel = "noopener";

    const icon = document.createElement("span");
    icon.className = "folder-icon";
    icon.textContent = folder.icon;

    const title = document.createElement("strong");
    title.textContent = folder.name;

    const hint = document.createElement("small");
    hint.textContent = "Open on GitHub ↗";

    link.append(icon, title, hint);
    grid.appendChild(link);
  });

  $("noFolders").hidden = folders.length !== 0;
}

function showDashboard() {
  $("loginView").hidden = true;
  $("driveView").hidden = false;

  // Convenience state for this browser tab only.
  sessionStorage.setItem("driveLoggedIn", "yes");
}

function showLogin() {
  $("driveView").hidden = true;
  $("loginView").hidden = false;
  sessionStorage.removeItem("driveLoggedIn");
}

$("loginForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const username = $("username").value.trim();
  const password = $("password").value;

  if (
    username === CONFIG.sharedUsername &&
    password === CONFIG.sharedPassword
  ) {
    $("loginError").hidden = true;
    showDashboard();
  } else {
    $("loginError").hidden = false;
  }
});

$("logoutBtn").addEventListener("click", showLogin);

$("folderSearch").addEventListener("input", (event) => {
  const query = event.target.value.trim().toLowerCase();

  const matchingFolders = CONFIG.folders.filter((folder) =>
    folder.name.toLowerCase().includes(query)
  );

  renderFolders(matchingFolders);
});

configureLinks();

// Restore the convenience session for this tab.
if (sessionStorage.getItem("driveLoggedIn") === "yes") {
  showDashboard();
}
