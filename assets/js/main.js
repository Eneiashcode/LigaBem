document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      // Aqui só simulamos o login
      window.location.href = "dashboard.html";
    });
  }
});

// Registro do Service Worker (já deixa o app como PWA)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js")
      .then(reg => console.log("✅ SW registrado:", reg.scope))
      .catch(err => console.error("❌ Erro SW:", err));
  });
}
