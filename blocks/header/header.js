export default function decorate(block) {
  // grab pieces
  const brand = block.querySelector('.header__brand');
  const nav = block.querySelector('.header__nav');
  let toggle = block.querySelector('.header__toggle');

  // create toggle if not present
  if (!toggle) {
    toggle = document.createElement('button');
    toggle.className = 'header__toggle';
    toggle.type = 'button';
    toggle.textContent = 'Menu';
    block.querySelector('.row').append(toggle);
  }

  // a11y
  if (nav && !nav.id) nav.id = 'nav-main';
  toggle.setAttribute('aria-controls', nav?.id || 'nav-main');
  toggle.setAttribute('aria-expanded', 'false');

  // open/close on click
  toggle.addEventListener('click', () => {
    const open = block.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  // close when clicking a link (mobile)
  nav?.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      block.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // tiny polish: if brand is missing, add a default
  if (!brand) {
    const a = document.createElement('a');
    a.className = 'header__brand';
    a.href = '/';
    a.textContent = 'Site';
    block.querySelector('.row').prepend(a);
  }
}