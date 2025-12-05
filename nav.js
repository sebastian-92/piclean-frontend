// Bulma-compatible navbar burger toggle
document.addEventListener('DOMContentLoaded', function () {
  const burgers = Array.from(document.querySelectorAll('#navToggle'));
  if (!burgers.length) return;
  burgers.forEach((burger) => {
    const targetId = burger.dataset.target;
    let target = targetId ? document.getElementById(targetId) : null;
    // fallback: look for nearest .navbar-menu sibling
    if (!target) {
      const navbar = burger.closest('.navbar');
      if (navbar) target = navbar.querySelector('.navbar-menu');
    }
    if (!target) {
      console.warn('Navbar burger found but no target .navbar-menu for', burger);
    }
    burger.addEventListener('click', function () {
      const active = burger.classList.toggle('is-active');
      if (target) target.classList.toggle('is-active');
      burger.setAttribute('aria-expanded', active ? 'true' : 'false');
    });
    // close when clicking a navbar-item in mobile
    if (target) {
      target.addEventListener('click', (e) => {
        if (e.target.closest('.navbar-item') && window.innerWidth <= 640) {
          target.classList.remove('is-active');
          burger.classList.remove('is-active');
          burger.setAttribute('aria-expanded', 'false');
        }
      });
    }
  });
});
