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

document.addEventListener("DOMContentLoaded", () => {
  const art = document.querySelector(".ft-art--boxes");
  if (!art) return;

  const routes = [
    { fly: ".ft-fly--r1", box: ".ft-box--red" },
    { fly: ".ft-fly--r2", box: ".ft-box--red" },
    { fly: ".ft-fly--o1", box: ".ft-box--orange" },
    { fly: ".ft-fly--g1", box: ".ft-box--green" },
    { fly: ".ft-fly--g2", box: ".ft-box--green" }
  ];

  let running = false;

  function randomStart(containerRect) {
    const side = Math.random();
    const w = containerRect.width;
    const h = containerRect.height * 0.55;

    if (side < 0.33) {
      return {
        x: Math.random() * w,
        y: -20
      };
    }

    if (side < 0.66) {
      return {
        x: -20,
        y: Math.random() * h
      };
    }

    return {
      x: w + 20,
      y: Math.random() * h
    };
  }

  function randomTargetInsideBox(boxRect, artRect) {
    const padX = boxRect.width * 0.22;
    const padY = boxRect.height * 0.22;

    return {
      x:
        boxRect.left -
        artRect.left +
        padX +
        Math.random() * (boxRect.width - padX * 2),
      y:
        boxRect.top -
        artRect.top +
        padY +
        Math.random() * (boxRect.height - padY * 2)
    };
  }

  function pulseBox(box) {
    box.classList.add("is-hit");
    setTimeout(() => box.classList.remove("is-hit"), 360);

    const dots = box.querySelectorAll(".ft-dot");
    if (!dots.length) return;

    const dot = dots[Math.floor(Math.random() * dots.length)];
    dot.classList.add("is-active");
    setTimeout(() => dot.classList.remove("is-active"), 420);
  }

  function launch(route) {
    if (!running) return;

    const fly = art.querySelector(route.fly);
    const box = art.querySelector(route.box);
    if (!fly || !box) return;

    const artRect = art.getBoundingClientRect();
    const boxRect = box.getBoundingClientRect();

    const start = randomStart(artRect);
    const target = randomTargetInsideBox(boxRect, artRect);

    const tx = target.x - start.x;
    const ty = target.y - start.y;
    const dur = 1.4 + Math.random() * 0.8;

    fly.style.left = `${start.x}px`;
    fly.style.top = `${start.y}px`;
    fly.style.setProperty("--tx", `${tx}px`);
    fly.style.setProperty("--ty", `${ty}px`);
    fly.style.setProperty("--dur", `${dur}s`);

    fly.classList.remove("is-flying");
    void fly.offsetWidth; // force reflow
    fly.classList.add("is-flying");

    setTimeout(() => {
      pulseBox(box);

      if (!running) return;

      const nextDelay = 280 + Math.random() * 900;
      setTimeout(() => launch(route), nextDelay);
    }, dur * 1000);
  }

  function startAnimation() {
    if (running) return;
    running = true;

    routes.forEach((route, index) => {
      setTimeout(() => launch(route), index * 260);
    });
  }

  function stopAnimation() {
    running = false;
    art.querySelectorAll(".ft-fly").forEach((fly) => {
      fly.classList.remove("is-flying");
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startAnimation();
        } else {
          stopAnimation();
        }
      });
    },
    {
      threshold: 0.25
    }
  );

  observer.observe(art);

  window.addEventListener("resize", () => {
    if (!running) return;
    stopAnimation();
    setTimeout(startAnimation, 150);
  });
});
