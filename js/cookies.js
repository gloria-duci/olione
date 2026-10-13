(() => {
  const STORAGE_KEY = "olione-cookie-consent";
  const GA_ID = "G-SNEWBDWGVL";

  const banner = document.querySelector("[data-cookie-banner]");
  if (!banner) return;

  const acceptBtn = banner.querySelector("[data-cookie-accept]");
  const rejectBtn = banner.querySelector("[data-cookie-reject]");

  const readConsent = () => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  };

  const writeConsent = (value) => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
  };

  const setBannerOpen = (open) => {
    banner.hidden = !open;
    banner.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("cookie-open", open);
  };

  const updateConsent = (granted) => {
    if (typeof gtag !== "function") return;
    gtag("consent", "update", {
      analytics_storage: granted ? "granted" : "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    if (granted) {
      gtag("config", GA_ID);
    }
  };

  const applyChoice = (choice) => {
    writeConsent(choice);
    updateConsent(choice === "accepted");
    setBannerOpen(false);
  };

  if (acceptBtn) {
    acceptBtn.addEventListener("click", () => applyChoice("accepted"));
  }
  if (rejectBtn) {
    rejectBtn.addEventListener("click", () => applyChoice("rejected"));
  }

  document.querySelectorAll("[data-cookie-open]").forEach((el) => {
    el.addEventListener("click", (event) => {
      event.preventDefault();
      setBannerOpen(true);
    });
  });

  const existing = readConsent();
  if (existing === "accepted" || existing === "rejected") {
    updateConsent(existing === "accepted");
    setBannerOpen(false);
  } else {
    setBannerOpen(true);
  }
})();
