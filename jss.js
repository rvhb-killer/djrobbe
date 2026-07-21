document.addEventListener("DOMContentLoaded", () => {
  const chartCard = document.getElementById("irisChartCard");
  let hasPlayed = false;

  function animateCounter(el, target, duration = 1200, delay = 0) {
    setTimeout(() => {
      const startTime = performance.now();

      function update(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        const value = Math.round(target * eased);
        el.textContent = value + "%";

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target + "%";
        }
      }

      requestAnimationFrame(update);
    }, delay);
  }

  function animateBars(selector, delayBase = 0, duration = 1200, stagger = 180, skipFutureSpecial = false) {
    const bars = document.querySelectorAll(selector);

    bars.forEach((bar, index) => {
      const target = parseFloat(bar.dataset.target || 0);

      if (skipFutureSpecial && bar.classList.contains("js-bar-future")) {
        return;
      }

      setTimeout(() => {
        bar.style.height = target + "%";
      }, delayBase + index * stagger);
    });
  }

  function resetBars() {
    document.querySelectorAll(".js-bar, .js-bar-right").forEach(bar => {
      bar.style.height = "0%";
    });

    document.querySelectorAll(".js-count, .js-count-right").forEach(el => {
      el.textContent = "0%";
    });

    chartCard.classList.remove("is-animating");
  }

  function playChartAnimation() {
    if (hasPlayed) return;
    hasPlayed = true;

    chartCard.classList.add("is-animating");

    // Left side: reality today
    animateBars(".js-bar", 120, 1000, 160);
    document.querySelectorAll(".js-count").forEach((el, index) => {
      animateCounter(el, parseInt(el.dataset.target, 10), 1000, 120 + index * 160);
    });

    // Right side: target with IRIS
    animateBars(".js-bar-right", 1450, 1100, 180, true);
    document.querySelectorAll(".js-count-right").forEach((el, index) => {
      const target = parseInt(el.dataset.target, 10);

      // future gets slightly later timing for extra emphasis
      const extraDelay = index === 2 ? 2050 : 1450 + index * 180;
      animateCounter(el, target, 1100, extraDelay);
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        playChartAnimation();
      }
    });
  }, {
    threshold: 0.35
  });

  resetBars();
  observer.observe(chartCard);
});

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

