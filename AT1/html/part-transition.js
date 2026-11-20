const partImages = {
  "1": "images/JJBA%20part1.webp",
  "2": "images/JJBA%20part2.webp",
  "3": "images/JJBA%20part3.webp",
  "4": "images/JJBA%20part4.webp",
  "5": "images/JJBA%20part5.webp",
  "6": "images/JJBA%20part6.webp",
  "7": "images/JJBA%20part7.webp",
  "8": "images/JJBA%20part8.webp",
  "9": "images/JJBA%20part9.webp",
};

const pageUrl = new URL(window.location.href);
const partImage = partImages[document.body.dataset.part];

if (document.body.dataset.part) {
  document.addEventListener("click", (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const link = event.target.closest("a[href]");
    if (!link || link.target === "_blank") {
      return;
    }

    const destination = new URL(link.href);
    if (
      destination.origin !== window.location.origin ||
      destination.pathname !== new URL("home.html", document.baseURI).pathname
    ) {
      return;
    }

    event.preventDefault();
    destination.hash = "parts";
    window.location.assign(destination.href);
  });
}

document.addEventListener("click", (event) => {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }

  const link = event.target.closest(".part-link");
  const card = link?.querySelector(".part-card[data-part]");

  if (
    !link ||
    !card ||
    link.target === "_blank" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  event.preventDefault();

  const image = window.getComputedStyle(card);
  const imageUrl = image.backgroundImage.match(/^url\(["']?(.*?)["']?\)$/)?.[1];
  if (!imageUrl) {
    window.location.assign(link.href);
    return;
  }

  let navigated = false;
  const navigate = () => {
    if (navigated) {
      return;
    }
    navigated = true;
    window.location.assign(link.href);
  };

  const imageProbe = new Image();
  imageProbe.addEventListener("load", () => {
    const bounds = card.getBoundingClientRect();
    const coverScale = Math.max(
      bounds.width / imageProbe.naturalWidth,
      bounds.height / imageProbe.naturalHeight,
    );
    const containScale = Math.min(
      window.innerWidth / imageProbe.naturalWidth,
      window.innerHeight / imageProbe.naturalHeight,
    );
    const transition = document.createElement("div");
    transition.className = "part-transition";
    transition.setAttribute("aria-hidden", "true");
    Object.assign(transition.style, {
      top: `${bounds.top}px`,
      left: `${bounds.left}px`,
      width: `${bounds.width}px`,
      height: `${bounds.height}px`,
      backgroundImage: image.backgroundImage,
      backgroundPosition: "center",
    });
    transition.style.setProperty(
      "--start-background-size",
      `${imageProbe.naturalWidth * coverScale}px ${imageProbe.naturalHeight * coverScale}px`,
    );
    transition.style.setProperty(
      "--target-background-size",
      `${imageProbe.naturalWidth * containScale}px ${imageProbe.naturalHeight * containScale}px`,
    );

    document.body.append(transition);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => transition.classList.add("is-expanding"));
    });

    transition.addEventListener("transitionend", (transitionEvent) => {
      if (transitionEvent.propertyName === "width") {
        navigate();
      }
    });
    window.setTimeout(navigate, 1700);
  }, { once: true });

  imageProbe.addEventListener("error", navigate, { once: true });
  imageProbe.src = new URL(imageUrl, document.baseURI).href;
});

if (pageUrl.searchParams.has("intro")) {
  pageUrl.searchParams.delete("intro");
  window.history.replaceState(null, "", pageUrl);

  if (
    partImage &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const intro = document.createElement("div");
    intro.className = "part-intro";
    intro.setAttribute("aria-hidden", "true");
    intro.style.backgroundImage = `url("${partImage}")`;
    document.body.append(intro);

    intro.addEventListener("transitionend", (event) => {
      if (event.propertyName === "opacity") {
        intro.remove();
      }
    });
    window.setTimeout(() => intro.classList.add("is-fading"), 150);
    window.setTimeout(() => intro.remove(), 550);
  }
}
