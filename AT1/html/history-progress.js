const timelines = Array.from(document.querySelectorAll(".history-timeline"));
const sectionsToPop = Array.from(document.querySelectorAll("[data-pop-on-read]"));

if (timelines.length > 0 || sectionsToPop.length > 0) {
  const timelineStates = timelines.map((timeline) => ({
    timeline,
    milestones: Array.from(timeline.children),
  }));
  let updateScheduled = false;

  const updateProgress = () => {
    const readingLine = window.innerHeight / 2;

    sectionsToPop.forEach((section) => {
      const bounds = section.getBoundingClientRect();
      if (
        !section.classList.contains("has-popped") &&
        bounds.top < window.innerHeight &&
        bounds.bottom <= readingLine
      ) {
        section.classList.add("has-popped");
      }
    });

    timelineStates.forEach(({ timeline, milestones }) => {
      const bounds = timeline.getBoundingClientRect();
      const progress = Math.max(
        0,
        Math.min(1, (readingLine - bounds.top) / bounds.height),
      );
      timeline.style.setProperty("--history-progress", progress);

      let activeIndex = -1;
      milestones.forEach((milestone, index) => {
        if (milestone.getBoundingClientRect().top <= readingLine) {
          activeIndex = index;
        }
      });
      milestones.forEach((milestone, index) => {
        milestone.classList.toggle("is-past", index < activeIndex);
        milestone.classList.toggle("is-current", index === activeIndex);
        if (index === activeIndex) {
          milestone.setAttribute("aria-current", "step");
        } else {
          milestone.removeAttribute("aria-current");
        }
      });
    });
  };

  const scheduleUpdate = () => {
    if (updateScheduled) {
      return;
    }

    updateScheduled = true;
    requestAnimationFrame(() => {
      updateScheduled = false;
      updateProgress();
    });
  };

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  updateProgress();
}
