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

        // Dynamically update Open Graph & Twitter meta tags for selected language
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle && translations[lang].meta_title) {
            ogTitle.setAttribute("content", translations[lang].meta_title);
        }
        const twitterTitle = document.querySelector('meta[name="twitter:title"]');
        if (twitterTitle && translations[lang].meta_title) {
            twitterTitle.setAttribute("content", translations[lang].meta_title);
        }
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc && translations[lang].meta_desc) {
            ogDesc.setAttribute("content", translations[lang].meta_desc);
        }
        const twitterDesc = document.querySelector('meta[name="twitter:description"]');
        if (twitterDesc && translations[lang].meta_desc) {
            twitterDesc.setAttribute("content", translations[lang].meta_desc);
        }
        const ogLocale = document.querySelector('meta[property="og:locale"]');
        if (ogLocale) {
            const localeMap = {
                ar: "ar_EG",
                en: "en_US",
                ru: "ru_RU",
                de: "de_DE",
                fr: "fr_FR"
            };
            ogLocale.setAttribute("content", localeMap[lang] || "en_US");
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

    // Seasonal Export Calendar Controls
    function initSeasonCalendar() {
        const calendarTable = document.getElementById("calendarTable");
        if (!calendarTable) return;

        // 1. Highlight real-world current month
        const currentMonth = new Date().getMonth() + 1; // 1 to 12
        calendarTable.querySelectorAll(`[data-month="${currentMonth}"]`).forEach((cell) => {
            cell.classList.add("is-current-month");
        });

        // 2. Filter buttons
        const filterBtns = document.querySelectorAll(".calendar-filter-btn");
        const rows = calendarTable.querySelectorAll(".cal-row");

        filterBtns.forEach((btn) => {
            btn.addEventListener("click", function () {
                filterBtns.forEach((b) => {
                    b.classList.remove("active");
                    b.setAttribute("aria-selected", "false");
                });
                this.classList.add("active");
                this.setAttribute("aria-selected", "true");

                const filter = this.getAttribute("data-filter");

                rows.forEach((row) => {
                    const category = row.getAttribute("data-category");
                    const monthsStr = row.getAttribute("data-months") || "";
                    const months = monthsStr
                        .split(",")
                        .map((m) => parseInt(m.trim(), 10))
                        .filter((n) => !isNaN(n));

                    let shouldShow = true;
                    if (filter === "fruits" || filter === "vegetables") {
                        shouldShow = (category === filter);
                    } else if (filter === "now") {
                        shouldShow = months.includes(currentMonth);
                    }

                    row.classList.toggle("is-hidden", !shouldShow);
                });
            });
        });

        // 3. One-click RFQ button from Calendar
        const rfqBtns = calendarTable.querySelectorAll(".cal-rfq-btn");
        const productInput = document.getElementById("product");

        rfqBtns.forEach((btn) => {
            btn.addEventListener("click", function () {
                const row = this.closest(".cal-row");
                const cropNameEl = row ? row.querySelector(".cal-crop__name") : null;
                const cropName = (cropNameEl && cropNameEl.textContent ? cropNameEl.textContent.trim() : "") || this.getAttribute("data-crop") || "";

                if (productInput && cropName) {
                    productInput.value = cropName;
                    const event = new Event("input", { bubbles: true });
                    productInput.dispatchEvent(event);

                    // Visual pulse indicator on the input
                    productInput.style.transition = "box-shadow 0.3s ease, border-color 0.3s ease";
                    productInput.style.borderColor = "#28b485";
                    productInput.style.boxShadow = "0 0 0 3px rgba(40, 180, 133, 0.35)";
                    setTimeout(() => {
                        productInput.style.borderColor = "";
                        productInput.style.boxShadow = "";
                    }, 1800);
                }

                const inquirySec = document.getElementById("inquiry");
                if (inquirySec) {
                    inquirySec.scrollIntoView({ behavior: "smooth" });
                    setTimeout(() => {
                        const nameInput = document.getElementById("name");
                        if (nameInput) nameInput.focus();
                    }, 500);
                }
            });
        });
    }

    // Visual Tour & Harvest Gallery Controls
    function initGallery() {
        const galleryGrid = document.getElementById("galleryGrid");
        const lightbox = document.getElementById("galleryLightbox");
        if (!galleryGrid || !lightbox) return;

        const filterBtns = document.querySelectorAll(".gallery-filter-btn");
        const cards = Array.from(galleryGrid.querySelectorAll(".gallery-card"));

        const lightboxImg = document.getElementById("lightboxImg");
        const lightboxBadge = document.getElementById("lightboxBadge");
        const lightboxTitle = document.getElementById("lightboxTitle");
        const lightboxDesc = document.getElementById("lightboxDesc");
        const lightboxCounter = document.getElementById("lightboxCounter");
        const lightboxClose = document.getElementById("lightboxClose");
        const lightboxPrev = document.getElementById("lightboxPrev");
        const lightboxNext = document.getElementById("lightboxNext");
        const lightboxBackdrop = document.getElementById("lightboxBackdrop");

        let currentFilteredCards = [...cards];
        let activeIndex = 0;

        // 1. Category Filtering
        filterBtns.forEach((btn) => {
            btn.addEventListener("click", function () {
                filterBtns.forEach((b) => {
                    b.classList.remove("active");
                    b.setAttribute("aria-selected", "false");
                });
                this.classList.add("active");
                this.setAttribute("aria-selected", "true");

                const filter = this.getAttribute("data-filter");

                cards.forEach((card) => {
                    const category = card.getAttribute("data-category");
                    const shouldShow = (filter === "all" || category === filter);
                    card.classList.toggle("is-hidden", !shouldShow);
                });

                currentFilteredCards = cards.filter((card) => !card.classList.contains("is-hidden"));
            });
        });

        // 2. Lightbox Open / Navigation / Close
        function showLightbox(index) {
            if (currentFilteredCards.length === 0) return;
            if (index < 0) index = currentFilteredCards.length - 1;
            if (index >= currentFilteredCards.length) index = 0;

            activeIndex = index;
            const targetCard = currentFilteredCards[activeIndex];

            const imgEl = targetCard.querySelector(".gallery-card__img");
            const badgeEl = targetCard.querySelector(".gallery-card__badge");
            const titleEl = targetCard.querySelector(".gallery-card__title");
            const descEl = targetCard.querySelector(".gallery-card__desc");

            if (lightboxImg && imgEl) {
                lightboxImg.src = imgEl.src;
                lightboxImg.alt = imgEl.alt || "";
            }
            if (lightboxBadge && badgeEl) {
                lightboxBadge.textContent = badgeEl.textContent;
            }
            if (lightboxTitle && titleEl) {
                lightboxTitle.textContent = titleEl.textContent;
            }
            if (lightboxDesc && descEl) {
                lightboxDesc.textContent = descEl.textContent;
            }
            if (lightboxCounter) {
                lightboxCounter.textContent = `${activeIndex + 1} / ${currentFilteredCards.length}`;
            }

            lightbox.classList.add("is-open");
            lightbox.style.display = "flex";
            document.body.style.overflow = "hidden";
        }

        function closeLightbox() {
            lightbox.classList.remove("is-open");
            lightbox.style.display = "none";
            document.body.style.overflow = "";
            if (lightboxImg) lightboxImg.src = "";
        }

        function nextLightbox() {
            showLightbox(activeIndex + 1);
        }

        function prevLightbox() {
            showLightbox(activeIndex - 1);
        }

        // Card Clicks (using event delegation)
        galleryGrid.addEventListener("click", function (e) {
            const card = e.target.closest(".gallery-card");
            if (!card) return;

            const idx = currentFilteredCards.indexOf(card);
            if (idx !== -1) {
                showLightbox(idx);
            }
        });

        // Keyboard accessibility on cards (Enter or Space)
        galleryGrid.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") {
                const card = e.target.closest(".gallery-card");
                if (!card) return;
                e.preventDefault();
                const idx = currentFilteredCards.indexOf(card);
                if (idx !== -1) {
                    showLightbox(idx);
                }
            }
        });

        // Lightbox button controls
        if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
        if (lightboxBackdrop) lightboxBackdrop.addEventListener("click", closeLightbox);
        if (lightboxNext) lightboxNext.addEventListener("click", nextLightbox);
        if (lightboxPrev) lightboxPrev.addEventListener("click", prevLightbox);

        // Keyboard navigation (Esc, ArrowLeft, ArrowRight)
        document.addEventListener("keydown", function (e) {
            if (!lightbox.classList.contains("is-open")) return;
            if (e.key === "Escape") {
                closeLightbox();
            } else if (e.key === "ArrowRight") {
                const isRtl = document.documentElement.dir === "rtl";
                if (isRtl) prevLightbox();
                else nextLightbox();
            } else if (e.key === "ArrowLeft") {
                const isRtl = document.documentElement.dir === "rtl";
                if (isRtl) nextLightbox();
                else prevLightbox();
            }
        });
    }

    // Company Export Catalog Modal Controls
    function initCatalog() {
        const modal = document.getElementById("catalogModal");
        if (!modal) return;

        const openBtns = [
            document.getElementById("heroCatalogBtn"),
            document.getElementById("navCatalogBtn")
        ].filter(Boolean);

        const closeBtn = document.getElementById("catalogModalClose");
        const backdrop = document.getElementById("catalogModalBackdrop");
        const printBtn = document.getElementById("catalogPrintBtn");
        const quoteBtn = document.getElementById("catalogQuoteBtn");

        function openModal() {
            modal.classList.add("is-open");
            modal.style.display = "flex";
            document.body.style.overflow = "hidden";
        }

        function closeModal() {
            modal.classList.remove("is-open");
            modal.style.display = "none";
            document.body.style.overflow = "";
        }

        openBtns.forEach((btn) => {
            btn.addEventListener("click", function (e) {
                e.preventDefault();
                openModal();
            });
        });

        if (closeBtn) closeBtn.addEventListener("click", closeModal);
        if (backdrop) backdrop.addEventListener("click", closeModal);

        if (printBtn) {
            printBtn.addEventListener("click", function () {
                window.open("catalog.html", "_blank");
            });
        }

        if (quoteBtn) {
            quoteBtn.addEventListener("click", function () {
                closeModal();
                const inquirySec = document.getElementById("inquiry");
                if (inquirySec) {
                    inquirySec.scrollIntoView({ behavior: "smooth" });
                    setTimeout(() => {
                        const nameInput = document.getElementById("name");
                        if (nameInput) nameInput.focus();
                    }, 500);
                }
            });
        }

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape" && modal.classList.contains("is-open")) {
                closeModal();
            }
        });
    }

    // App Initialization (handles both loading and already-loaded DOM)
    function initApp() {
        const initialLang = getInitialLanguage();
        setLanguage(initialLang);
        initSeasonCalendar();
        initGallery();
        initCatalog();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initApp);
    } else {
        initApp();
    }
})();
