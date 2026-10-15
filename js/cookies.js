(() => {
  const STORAGE_KEY = "olione-cookie-consent";
  const GA_ID = "G-SNEWBDWGVL";

  const banner = document.querySelector("[data-cookie-banner]");
  if (!banner) return;

  const acceptBtn = banner.querySelector("[data-cookie-accept]");
  const rejectBtn = banner.querySelector("[data-cookie-reject]");

  let gaScriptPromise = null;

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

  const loadGaScript = () => {
    if (window.__olioneGaLoaded) return Promise.resolve();
    if (gaScriptPromise) return gaScriptPromise;
    gaScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      script.onload = () => {
        window.__olioneGaLoaded = true;
        gtag("js", new Date());
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
    return gaScriptPromise;
  };

  const updateConsent = (granted) => {
    if (!granted) {
      if (typeof gtag === "function") {
        gtag("consent", "update", {
          analytics_storage: "denied",
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
        });
      }
      return;
    }

    loadGaScript().then(() => {
      gtag("consent", "update", {
        analytics_storage: "granted",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
      gtag("config", GA_ID);
    });
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
