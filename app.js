document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startBtn");
  const logoWrap = document.getElementById("logoWrap");
  const heroContent = document.getElementById("heroContent");
  const transitionLayer = document.getElementById("transitionLayer");
  const servicesSection = document.getElementById("services");

  let isAnimating = false;

  if (!startBtn || !logoWrap || !heroContent || !transitionLayer || !servicesSection) {
    return;
  }

  startBtn.addEventListener("click", () => {
    if (isAnimating) return;
    isAnimating = true;

    // Lock scroll during animation
    document.body.classList.add("transitioning");

    // Fade out hero content
    heroContent.classList.add("is-exiting");

    // Scale logo (warp effect)
    logoWrap.classList.add("is-warping");

    // Activate transition visuals
    transitionLayer.classList.add("is-active");

    // Scroll to next section mid-animation
    setTimeout(() => {
      servicesSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 520);

    // Clean up transition layer + unlock scroll
    setTimeout(() => {
      transitionLayer.classList.remove("is-active");
      document.body.classList.remove("transitioning");
      isAnimating = false;
    }, 1300);

    // Reset hero state (in case user scrolls back up)
    setTimeout(() => {
      heroContent.classList.remove("is-exiting");
      logoWrap.classList.remove("is-warping");
    }, 1500);
  });
});
