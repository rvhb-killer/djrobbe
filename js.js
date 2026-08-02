const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    } else {
      // Optional: remove class to animate out when scrolling back up
      entry.target.classList.remove('show'); 
    }
  });
 }, {
    threshold: 0.3
  });

// Target all elements with class .hidden
const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));

  });
});
