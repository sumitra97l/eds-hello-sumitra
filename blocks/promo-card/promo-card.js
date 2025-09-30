export default function decorate(block) {
  // Accessibility: if CTA is an <a>, add role=button for screen readers
  const cta = block.querySelector('.promo-card__cta');
  if (cta && cta.tagName === 'A') {
    cta.setAttribute('role', 'button');
  }

  // Small behavior: if there’s no image, collapse the media column
  const img = block.querySelector('.promo-card__media img');
  if (!img || !img.getAttribute('src')) {
    const media = block.querySelector('.promo-card__media');
    if (media) media.remove();
    block.style.gridTemplateColumns = '1fr';
  }
}
