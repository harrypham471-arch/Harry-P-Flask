const toggleButton = document.querySelector('[data-bs-toggle="drawer"]');
const drawer = document.querySelector(toggleButton.dataset.bsTarget);
const closeButton = drawer.querySelector('[data-bs-dismiss="drawer"]');

toggleButton.addEventListener("click", () => {
  if (!drawer.open) {
    drawer.showModal();
    toggleButton.setAttribute("aria-expanded", "true");
  }
});

closeButton.addEventListener("click", () => {
  drawer.close();
});

drawer.addEventListener("click", (event) => {
  if (event.target === drawer) {
    drawer.close();
  }
});

drawer.addEventListener("close", () => {
  toggleButton.setAttribute("aria-expanded", "false");
});
