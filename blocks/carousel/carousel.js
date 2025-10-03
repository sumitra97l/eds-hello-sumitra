import { getMetadata } from '../../scripts/aem.js';

async function fetchPlaceholders(locale) {
  // keep your existing fetch, but be defensive in case of network issues
  try { 
    const url = locale ? `/${locale}/placeholders.json` : '/placeholders.json';
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return {};
    return res.json();
  } catch (e) {
    // If fetching placeholders fails we’ll fall back to defaults below
    return {}; 
  }
}

const placeholders = await fetchPlaceholders(getMetadata('locale'));

const { btnNxt, btnPre } = placeholders || {}; 
const NEXT_LABEL = btnNxt || '›';               
const PREV_LABEL = btnPre || '‹';               

export default function decorate(block) {
  console.log('placeholders ---> ', placeholders, btnNxt, btnPre);

  // IMPORTANT: snapshot the rows BEFORE we start replacing nodes,
  // so we don't iterate a live NodeList while mutating it.
  const rows = [...block.children]; 

  rows.forEach((row, r) => { 
    if (r === 0) {
      const nextbtn = document.createElement('button');
      nextbtn.classList.add('btn', 'btn-next');
      nextbtn.setAttribute('type', 'button');          
      nextbtn.setAttribute('aria-label', 'Next slide'); 

      // Use placeholder label if available; otherwise fall back to arrow
      const node = document.createTextNode(NEXT_LABEL); 
      nextbtn.append(node);
      row.replaceWith(nextbtn);
    } else if (r === rows.length - 1) {
      const prebtn = document.createElement('button');
      prebtn.classList.add('btn', 'btn-prev');
      prebtn.setAttribute('type', 'button');            
      prebtn.setAttribute('aria-label', 'Previous slide'); 

      const node = document.createTextNode(PREV_LABEL); 
      prebtn.append(node);
      row.replaceWith(prebtn);
    } else {
      row.classList.add('slide');
      [...row.children].forEach((col, c) => {
        if (c === 1) {
          col.classList.add('slide-text');
        }
      });
    }
  });

  // Scope queries to THIS block so multiple carousels won’t conflict
  const slides = block.querySelectorAll('.slide'); 

  // Position slides horizontally
  slides.forEach((slide, indx) => {
    slide.style.transform = `translateX(${indx * 100}%)`;
  });

  const nextSlideBtn = block.querySelector('.btn-next'); 
  const prevSlideBtn = block.querySelector('.btn-prev'); 

  // Early exit (or hide controls) if there are < 2 slides
  if (slides.length <= 1) { 
    if (nextSlideBtn) nextSlideBtn.style.display = 'none';
    if (prevSlideBtn) prevSlideBtn.style.display = 'none';
    return; // nothing to slide
  }

  let curSlide = 0;
  const maxSlide = slides.length - 1;

  // Navigation: Next
  if (nextSlideBtn) { 
    nextSlideBtn.addEventListener('click', () => {
      curSlide = (curSlide === maxSlide) ? 0 : curSlide + 1; // same behavior
      slides.forEach((slide, indx) => {
        slide.style.transform = `translateX(${100 * (indx - curSlide)}%)`;
      });
    });
  }

  // Navigation: Prev
  if (prevSlideBtn) { 
    prevSlideBtn.addEventListener('click', () => {
      curSlide = (curSlide === 0) ? maxSlide : curSlide - 1; // same behavior
      slides.forEach((slide, indx) => {
        slide.style.transform = `translateX(${100 * (indx - curSlide)}%)`;
      });
    });
  }
}
