/*
  JavaScript voor eenvoudige interacties in de IRIS‑remake.  
  Momenteel wordt alleen het mobiele menu ondersteund.  
*/

document.addEventListener('DOMContentLoaded', function () {
  const navToggle = document.createElement('button');
  navToggle.classList.add('nav-toggle');
  navToggle.setAttribute('aria-label', 'Open menu');
  navToggle.innerHTML = '&#9776;';

  const navContainer = document.querySelector('.nav-container');
  const mainNav = document.querySelector('.main-nav');
  const actions = document.querySelector('.actions');

  // Voeg de toggle knop toe vóór de navigatie in de DOM
  navContainer.insertBefore(navToggle, mainNav);

  navToggle.addEventListener('click', function () {
    mainNav.classList.toggle('open');
    actions.classList.toggle('open');
    
  });
});

/* ── Bar chart toggle: With / Without IRIS ── */
(function () {
  const btns    = document.querySelectorAll('.ft-toggle-btn');
  const bar3Gold = document.getElementById('bar3-gold');
  const bar3Iris = document.getElementById('bar3-iris');
  const bar3Fill = document.getElementById('bar3-fill');
  const irisLegend = document.getElementById('iris-legend');
  const irisLegendLabel = document.getElementById('iris-legend-label');
 
  function setState(state) {
    btns.forEach(b => b.classList.toggle('ft-toggle-btn--active', b.dataset.state === state));
 
    if (state === 'with') {
      bar3Gold.style.height = '0%';
      bar3Iris.style.height = '100%';
      bar3Fill.textContent = '10%';
      bar3Fill.classList.add('ft-bar-pct--iris');
      irisLegend.style.display = 'inline-block';
      irisLegendLabel.style.display = 'inline';
    } else {
      bar3Gold.style.height = '0%';
      bar3Iris.style.height = '0%';
      bar3Fill.textContent = '0%';
      bar3Fill.classList.remove('ft-bar-pct--iris');
      irisLegend.style.display = 'none';
      irisLegendLabel.style.display = 'none';
    }
  }
 
  btns.forEach(btn => btn.addEventListener('click', () => setState(btn.dataset.state)));
})();