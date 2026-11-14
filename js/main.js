(function () {
    const LANG_DATA = {
        ar: { name: "العربية", flag: "🇪🇬", dir: "rtl" },
        en: { name: "English", flag: "🇬🇧", dir: "ltr" },
        ru: { name: "Русский", flag: "🇷🇺", dir: "ltr" },
        de: { name: "Deutsch", flag: "🇩🇪", dir: "ltr" },
        fr: { name: "Français", flag: "🇫🇷", dir: "ltr" }
    };

    const DEFAULT_LANG = "en";
    const STORAGE_KEY = "algamel_lang";
    const OWNER_WHATSAPP = "201024267088";

    let currentLang = DEFAULT_LANG;

    const langBtn = document.getElementById("langBtn");
    const langMenu = document.getElementById("langMenu");
    const currentLangFlag = document.getElementById("currentLangFlag");
    const currentLangName = document.getElementById("currentLangName");
    const langItems = document.querySelectorAll(".lang-switcher__item");

    const navToggle = document.getElementById("navToggle");
    const navMenu = document.getElementById("navMenu");
    const mainNav = document.getElementById("mainNav");

    const inquiryForm = document.getElementById("inquiryForm");
    const submitBtn = document.getElementById("submitBtn");
    const formStatus = document.getElementById("formStatus");

    function getInitialLanguage() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && LANG_DATA[saved]) {
            return saved;
        }

        const browserLang = (navigator.language || navigator.userLanguage || "").toLowerCase();
        if (browserLang.startsWith("ar")) return "ar";
        if (browserLang.startsWith("ru")) return "ru";
        if (browserLang.startsWith("de")) return "de";
        if (browserLang.startsWith("fr")) return "fr";
        return DEFAULT_LANG;
    }

    function setLanguage(lang) {
        if (!translations[lang]) {
            lang = DEFAULT_LANG;
        }

        currentLang = lang;
        const config = LANG_DATA[lang];

        // Update root attributes
        document.documentElement.lang = lang;
        document.documentElement.dir = config.dir;

        // Update title and meta description
        if (translations[lang].meta_title) {
            document.title = translations[lang].meta_title;
        }
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && translations[lang].meta_desc) {
            metaDesc.setAttribute("content", translations[lang].meta_desc);
        }

        // Update text content for elements with data-i18n
        document.querySelectorAll("[data-i18n]").forEach((el) => {
            const key = el.getAttribute("data-i18n");
            if (translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });

        // Update placeholder for elements with data-i18n-placeholder
        document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
            const key = el.getAttribute("data-i18n-placeholder");
            if (translations[lang][key]) {
                el.placeholder = translations[lang][key];
            }
        });

        // Update aria-label for elements with data-i18n-aria
        document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
            const key = el.getAttribute("data-i18n-aria");
            if (translations[lang][key]) {
                el.setAttribute("aria-label", translations[lang][key]);
            }
        });

        // Update UI switcher state
        if (currentLangFlag) currentLangFlag.textContent = config.flag;
        if (currentLangName) currentLangName.textContent = config.name;

        langItems.forEach((item) => {
            const itemLang = item.getAttribute("data-lang");
            if (itemLang === lang) {
                item.classList.add("active");
                item.setAttribute("aria-selected", "true");
            } else {
                item.classList.remove("active");
                item.setAttribute("aria-selected", "false");
            }
        });

        // Save preference
        try {
            localStorage.setItem(STORAGE_KEY, lang);
        } catch (e) {
            // LocalStorage might be disabled in private mode
        }
    }

    // Language Dropdown Control
    function closeLangMenu() {
        if (!langMenu || !langBtn) return;
        langMenu.classList.remove("is-open");
        langBtn.setAttribute("aria-expanded", "false");
    }

    function openLangMenu() {
        if (!langMenu || !langBtn) return;
        langMenu.classList.add("is-open");
        langBtn.setAttribute("aria-expanded", "true");
    }

    function toggleLangMenu() {
        if (!langMenu) return;
        if (langMenu.classList.contains("is-open")) {
            closeLangMenu();
        } else {
            openLangMenu();
        }
    }

    // Mobile Navigation Control
    function closeNavMenu() {
        if (!navToggle || !navMenu) return;
        navMenu.classList.remove("is-open");
        navToggle.classList.remove("is-active");
        navToggle.setAttribute("aria-expanded", "false");
    }

    function openNavMenu() {
        if (!navToggle || !navMenu) return;
        navMenu.classList.add("is-open");
        navToggle.classList.add("is-active");
        navToggle.setAttribute("aria-expanded", "true");
    }

    function toggleNavMenu() {
        if (!navMenu) return;
        if (navMenu.classList.contains("is-open")) {
            closeNavMenu();
        } else {
            openNavMenu();
        }
    }

    // Event Listeners for Language Menu
    if (langBtn) {
        langBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            toggleLangMenu();
            closeNavMenu();
        });
    }

    langItems.forEach((item) => {
        item.addEventListener("click", function (e) {
            e.stopPropagation();
            const selectedLang = this.getAttribute("data-lang");
            if (selectedLang) {
                setLanguage(selectedLang);
            }
            closeLangMenu();
        });
    });

    // Mobile nav toggle
    if (navToggle) {
        navToggle.addEventListener("click", function (e) {
            e.stopPropagation();
            toggleNavMenu();
            closeLangMenu();
        });
    }

    document.querySelectorAll(".nav__link").forEach((link) => {
        link.addEventListener("click", function () {
            closeNavMenu();
            closeLangMenu();
        });
    });

    // Close any open menu when clicking anywhere on the document
    document.addEventListener("click", function (e) {
        if (langMenu && !langMenu.contains(e.target) && langBtn && !langBtn.contains(e.target)) {
            closeLangMenu();
        }
        if (mainNav && !mainNav.contains(e.target)) {
            closeNavMenu();
        }
    });

    // Close menus on Escape key
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            closeLangMenu();
            closeNavMenu();
        }
    });

    // Close language menu on scroll for cleaner UX
    window.addEventListener("scroll", function () {
        closeLangMenu();
    }, { passive: true });

    // =========================================================================
    // Form Submission: Silent Background Send via Email (Formspree)
    // =========================================================================
    if (inquiryForm) {
        inquiryForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const originalBtnText = submitBtn ? submitBtn.textContent : "Send inquiry";
            const sendingText = (translations[currentLang] && translations[currentLang].form_sending) || "Sending...";
            const successText = (translations[currentLang] && translations[currentLang].form_success) || "Thank you! Your inquiry has been sent successfully. We will get in touch with you shortly.";
            const errorText = (translations[currentLang] && translations[currentLang].form_error) || "An error occurred while sending. Please try again or reach out to us directly.";

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = sendingText;
            }

            if (formStatus) {
                formStatus.style.display = "none";
            }

            // Send form data silently in the background via Formspree
            const fullName = (inquiryForm.full_name?.value || "").trim();
            const product = (inquiryForm.product?.value || "").trim();
            const country = (inquiryForm.country?.value || "").trim();
            const clientEmail = (inquiryForm.email?.value || "").trim();

            const formData = new FormData(inquiryForm);

            // Generate a unique subject for every submission so Gmail NEVER groups them into the same conversation/thread
            const randomCode = Math.floor(1000 + Math.random() * 9000);
            const subjectTitle = `طلب تسعير جديد: ${fullName || 'عميل'} - ${product || 'منتج'} [${country || 'تصدير'}] (#${randomCode})`;
            formData.set("_subject", subjectTitle);

            if (clientEmail) {
                formData.set("_replyto", clientEmail);
            }

            try {
                const response = await fetch("https://formspree.io/f/xykqdobr", {
                    method: "POST",
                    body: formData,
                    headers: { "Accept": "application/json" }
                });

                if (response.ok) {
                    if (formStatus) {
                        formStatus.className = "form__status form__status--success";
                        formStatus.style.display = "block";
                        formStatus.innerHTML = `<p>✅ ${successText}</p>`;
                        formStatus.scrollIntoView({ behavior: "smooth", block: "nearest" });
                    }
                    inquiryForm.reset();
                } else {
                    throw new Error("Server responded with error status");
                }
            } catch (err) {
                console.error("Form submission error:", err);
                if (formStatus) {
                    formStatus.className = "form__status form__status--error";
                    formStatus.style.display = "block";
                    formStatus.innerHTML = `<p>❌ ${errorText}</p>`;
                    formStatus.scrollIntoView({ behavior: "smooth", block: "nearest" });
                }
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                }
            }
        });
    }

    // Initialize on DOM load
    document.addEventListener("DOMContentLoaded", function () {
        const initialLang = getInitialLanguage();
        setLanguage(initialLang);
    });
})();
