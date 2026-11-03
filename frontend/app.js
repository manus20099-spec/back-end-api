const form = document.querySelector("#user-form");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const submitButton = document.querySelector("#submit-button");
const formMessage = document.querySelector("#form-message");
const userList = document.querySelector("#user-list");
const listMessage = document.querySelector("#list-message");
const directoryCount = document.querySelector("#directory-count");
const refreshButton = document.querySelector("#refresh-button");

function showFormMessage(message, kind = "success") {
  formMessage.textContent = message;
  formMessage.dataset.kind = kind;
}

async function requestUsers(options) {
  const response = await fetch("/users/", {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.errorMsg || result.error || `Request failed (${response.status})`);
  }

  return result;
}

function renderUsers(users) {
  userList.replaceChildren();
  directoryCount.textContent = `${users.length} ${users.length === 1 ? "person" : "people"} in your directory`;

  if (users.length === 0) {
    const emptyState = document.createElement("li");
    emptyState.className = "empty-state";
    emptyState.textContent = "No users yet. Add the first person using the form.";
    userList.append(emptyState);
    return;
  }

  for (const user of users) {
    const item = document.createElement("li");
    item.className = "user-card";

    const avatar = document.createElement("span");
    avatar.className = "avatar";
    avatar.setAttribute("aria-hidden", "true");
    avatar.textContent = user.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();

    const details = document.createElement("div");
    details.className = "user-details";

    const name = document.createElement("p");
    name.className = "user-name";
    name.textContent = user.name;

    const email = document.createElement("p");
    email.className = "user-email";
    email.textContent = user.email;

    details.append(name, email);
    item.append(avatar, details);
    userList.append(item);
  }
}

async function loadUsers() {
  listMessage.textContent = "";
  directoryCount.textContent = "Loading users…";
  userList.replaceChildren();

  const loadingState = document.createElement("li");
  loadingState.className = "empty-state";
  loadingState.textContent = "Connecting to the user directory…";
  userList.append(loadingState);

  try {
    const result = await requestUsers();
    renderUsers(result.data);
  } catch (error) {
    directoryCount.textContent = "Directory unavailable";
    userList.replaceChildren();
    listMessage.textContent = error.message;
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  submitButton.disabled = true;
  showFormMessage("Adding user…");

  try {
    await requestUsers({
      method: "POST",
      body: JSON.stringify({
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
      }),
    });
    form.reset();
    showFormMessage("User added to the directory.");
    await loadUsers();
  } catch (error) {
    showFormMessage(error.message, "error");
  } finally {
    submitButton.disabled = false;
  }
});

refreshButton.addEventListener("click", loadUsers);
loadUsers();
