export default function decorate(block) {
  // add a tiny interaction: clicking CTA toggles accent class
  const cta = block.querySelector('a');
  if (cta) {
    cta.addEventListener('click', (e) => {
      e.preventDefault();
      block.classList.toggle('is-accent');
    });
  }
}