// ── Formspree endpoint ──────────────────────────────────────────────────────
// https://formspree.io でフォームを作成し、エンドポイントURLを貼り付けてください
// 例: "https://formspree.io/f/abcd1234"
const FORMSPREE_ENDPOINT = "";

// ── Scroll animations ───────────────────────────────────────────────────────
const animateObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        animateObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll("[data-animate]").forEach((el) => {
  animateObserver.observe(el);
});

// ── Nav active state ────────────────────────────────────────────────────────
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".site-nav a[href^='#']");

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
        });
      }
    });
  },
  { rootMargin: "-30% 0px -60% 0px" }
);

sections.forEach((section) => navObserver.observe(section));

// ── Form submission ──────────────────────────────────────────────────────────
const form = document.getElementById("contact-form");
const note = document.getElementById("form-note");
const submitBtn = form ? form.querySelector("[type='submit']") : null;

if (form && note) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name || !email || !message) {
      note.textContent = "未入力の項目があります。必要項目を入力してください。";
      note.className = "form-note is-error";
      return;
    }

    // Formspree 未設定時はデモ動作
    if (!FORMSPREE_ENDPOINT) {
      note.textContent = "送信を受け付けました（デモ）。本番運用時は FORMSPREE_ENDPOINT を設定してください。";
      note.className = "form-note is-success";
      form.reset();
      return;
    }

    submitBtn.disabled = true;
    note.textContent = "送信中...";
    note.className = "form-note";

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });

      if (res.ok) {
        note.textContent = "送信が完了しました。2〜3営業日以内にご連絡します。";
        note.className = "form-note is-success";
        form.reset();
      } else {
        throw new Error("send_failed");
      }
    } catch {
      note.textContent = "送信に失敗しました。時間をおいて再度お試しください。";
      note.className = "form-note is-error";
    } finally {
      submitBtn.disabled = false;
    }
  });
}
