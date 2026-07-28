import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/all";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(CustomEase, SplitText, ScrollTrigger);

// Prevent mobile address-bar resize triggers from causing screen flashing
ScrollTrigger.config({ ignoreMobileResize: true });

// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
  smoothWheel: true,
  syncTouch: false,
  wheelMultiplier: 1.0,
  touchMultiplier: 1.5,
});
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(1000, 16);

// --- FAST PRELOADER & HERO REVEAL (SUB-1S UNVEIL FOR FAST LCP) ---
CustomEase.create("hop", "0.8, 0, 0.2, 1");
CustomEase.create("hop2", "0.9, 0, 0.1, 1");

const splitText = (selector, type, className, mask = true) => {
  return SplitText.create(selector, {
    type: type,
    [`${type}Class`]: className,
    ...(mask && { mask: type }),
  });
};

splitText(".preloader-header h1", "chars", "char");
splitText("nav a", "words", "word");
splitText(".header h1", "words", "word", false);
splitText(".hero-footer p", "words", "word");

const preloaderImgInitRotations = [7.5, -2.5, -10, 12.5, -5, 5];
gsap.set(".preloader-img", {
  rotate: (i) => preloaderImgInitRotations[i],
});

const tl = gsap.timeline({
  delay: 0.1,
  onComplete: () => {
    ScrollTrigger.refresh();
  },
});

tl.to(".preloader-img", {
  scale: 1,
  clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  duration: 0.4,
  ease: "hop",
  stagger: 0.04,
});

tl.to(
  ".preloader-header h1 .char",
  {
    y: "0%",
    duration: 0.4,
    ease: "hop2",
    stagger: { each: 0.025, from: "random" },
  },
  "0.1",
);

tl.to(
  ".preloader-counter p",
  {
    y: "0%",
    duration: 0.3,
    ease: "hop2",
    onStart: () => {
      const counterEl = document.querySelector(".preloader-counter p");
      const counter = { value: 0 };

      gsap.to(counter, {
        value: 100,
        duration: 0.5,
        ease: "power2.inOut",
        onUpdate: () => {
          if (counterEl) {
            counterEl.textContent = String(Math.round(counter.value)).padStart(
              3,
              "0",
            );
          }
        },
      });
    },
  },
  "<",
);

tl.to(
  ".preloader-counter p",
  {
    y: "-100%",
    duration: 0.3,
    ease: "hop2",
  },
  0.65,
);

tl.to(
  ".preloader-header h1 .char",
  {
    y: "-100%",
    duration: 0.3,
    ease: "hop2",
    stagger: { each: 0.02, from: "random" },
  },
  0.65,
);

tl.to(
  ".preloader-images .preloader-img",
  {
    scale: 0,
    clipPath: "polygon(20% 20%, 80% 20%, 80% 80%, 20% 80%)",
    duration: 0.4,
    ease: "hop2",
    stagger: -0.03,
  },
  0.75,
);

tl.to(
  ".preloader",
  {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
    duration: 0.4,
    ease: "hop2",
    onComplete: () => {
      const preEl = document.querySelector(".preloader");
      if (preEl) preEl.style.display = "none";
      ScrollTrigger.refresh();
    },
  },
  0.95,
);

tl.to(
  ".header h1 .word",
  {
    y: "0%",
    duration: 0.6,
    ease: "hop",
    stagger: 0.05,
  },
  1.05,
);

tl.to(
  "nav a .word",
  {
    y: "0%",
    duration: 0.5,
    ease: "hop",
    stagger: 0.03,
  },
  1.1,
);

tl.to(
  ".hero-footer p .word",
  {
    y: "0%",
    duration: 0.5,
    ease: "hop",
    stagger: 0.03,
  },
  1.1,
);

// --- SWIRLING IMAGE COSMOS LAYOUT INIT ---
const initCosmos = () => {
  const container = document.querySelector(".hero-cosmos-container");
  if (!container) return;

  const cosmosRings = container.querySelectorAll(".cosmos");
  const totalRings = cosmosRings.length;
  const cycleDuration = 24.0;

  cosmosRings.forEach((ring, rIndex) => {
    const baseAngle = (360 / totalRings) * rIndex;
    ring.style.transform = `rotate(${baseAngle}deg)`;

    const items = ring.querySelectorAll(".cosmos-item");
    const totalItems = items.length;

    items.forEach((item, iIndex) => {
      const delay = (iIndex * (cycleDuration / totalItems)) + (rIndex * 0.3);
      item.style.animationDelay = `${delay}s`;
    });
  });
};

initCosmos();

// --- OPTIMIZED CANVASES & SECTION STATE MANAGEMENT ---
const sectionIdleTweens = {};
const particleSystems = {};

function createParticleSystem(canvasId, sectionEl, options = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || !sectionEl) return null;

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = sectionEl.offsetWidth || window.innerWidth);
  let height = (canvas.height = sectionEl.offsetHeight || window.innerHeight);

  const spriteCanvas = document.createElement("canvas");
  spriteCanvas.width = 32;
  spriteCanvas.height = 32;
  const sCtx = spriteCanvas.getContext("2d");
  const grad = sCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, options.centerColor || "rgba(255, 235, 150, 1)");
  grad.addColorStop(0.4, options.glowColor || "rgba(255, 215, 0, 0.6)");
  grad.addColorStop(1, "rgba(255, 215, 0, 0)");
  sCtx.fillStyle = grad;
  sCtx.fillRect(0, 0, 32, 32);

  const particleCount = options.count || 20;
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 1.5,
      speedY: -(Math.random() * (options.speedYMax || 0.5) + (options.speedYMin || 0.2)),
      speedX: Math.random() * 0.4 - 0.2,
      oscillationSpeed: Math.random() * 0.03 + 0.01,
      angle: Math.random() * Math.PI * 2,
      alpha: Math.random() * 0.6 + 0.3,
    });
  }

  let animFrameId = null;
  let isRunning = false;

  function render() {
    if (!isRunning) return;
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.angle += p.oscillationSpeed;
      p.x += Math.sin(p.angle) * 0.35 + p.speedX;
      p.y += p.speedY;

      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }

      ctx.globalAlpha = p.alpha;
      const size = p.radius * 4;
      ctx.drawImage(spriteCanvas, p.x - size / 2, p.y - size / 2, size, size);
    }
    ctx.globalAlpha = 1;

    animFrameId = requestAnimationFrame(render);
  }

  let lastWinWidth = window.innerWidth;
  const handleResize = () => {
    if (window.innerWidth !== lastWinWidth) {
      lastWinWidth = window.innerWidth;
      width = canvas.width = sectionEl.offsetWidth || window.innerWidth;
      height = canvas.height = sectionEl.offsetHeight || window.innerHeight;
    }
  };
  window.addEventListener("resize", handleResize, { passive: true });

  return {
    start() {
      if (!isRunning) {
        isRunning = true;
        render();
      }
    },
    stop() {
      isRunning = false;
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
    },
  };
}

// --- SCROLL WAVE IMAGE GALLERY — 5 WEDDING FUNCTION SECTIONS ---
const FUNCTIONS_DATA = [
  {
    id: "haldi",
    badge: "",
    title: "Haldi Ceremony",
    tagline: "A golden splash of turmeric, laughter & family blessings for Maheen & Tanvi",
    day: "MON",
    date: "June 2 2027",
    time: "10:00 AM onwards",
    venue: "Courtyard Villa Lawn",
    dressSub: "Shades of Sun & Gold",
    dressDetail: "Yellow Kurta, Floral Sarees or Bright Ethnic Wear",
    images: [],
  },
  {
    id: "mehendi",
    badge: "",
    title: "Mehendi Night",
    tagline: "An afternoon of intricate henna, music & vibrant colors celebrating Maheen & Tanvi",
    day: "TUE",
    date: "June 3 2027",
    time: "03:00 PM onwards",
    venue: "Mango Grove Garden",
    dressSub: "Vibrant Festive Shades",
    dressDetail: "Green, Floral Prints, Lehengas or Indo-Western",
    images: [],
  },
  {
    id: "sangeet",
    badge: "",
    title: "Sangeet Night",
    tagline: "A magical night of dance, music & celebration with Maheen & Tanvi",
    day: "WED",
    date: "June 4 2027",
    time: "07:30 PM onwards",
    venue: "Uttar Garden Lawn",
    dressSub: "Embracing Heritage & Glamour",
    dressDetail: "Bandhani, Patola, Leheriya or Mirrorwork Ethnic Wear",
    images: [],
  },
  {
    id: "wedding",
    badge: "",
    title: "Wedding Ceremony",
    tagline: "The sacred union of Maheen & Tanvi under divine blessings & holy fire",
    day: "THU",
    date: "June 5 2027",
    time: "05:00 PM onwards",
    venue: "The Royal Palace Mandap",
    dressSub: "Traditional Royal Elegance",
    dressDetail: "Classic Sherwanis, Kanjeevarams or Regal Silks",
    images: [],
  },
  {
    id: "reception",
    badge: "",
    title: "Grand Reception",
    tagline: "An enchanting evening celebrating the new journey of Maheen & Tanvi",
    day: "FRI",
    date: "June 6 2027",
    time: "08:00 PM onwards",
    venue: "Grand Imperial Ballroom",
    dressSub: "Black Tie & Royal Glamour",
    dressDetail: "Tuxedos, Evening Gowns or Designer Lehengas",
    images: [],
  },
];

const CONFIG = {
  waves: {
    base: { amp: 0.1, freq: 1.0, speed: 1.0, phase: 5.0 },
    flow: { amp: 0.15, freq: 5.0, speed: 5.0, phase: 10.0 },
    detail: { amp: 0.025, freq: 5.0, speed: 1.5, phase: 2.5 },
  },
  clipMax: 20,
  clipPower: 2,
};

const IMAGE_BASE_HEIGHT = 375;
const ASPECT_RATIOS = ["3/2", "4/3", "5/4", "7/5"];

const spotlightImagesContainer = document.querySelector(".spotlight-images");

if (spotlightImagesContainer) {
  let globalImageIndex = 0;

  FUNCTIONS_DATA.forEach((func) => {
    const sectionEl = document.createElement("section");
    sectionEl.classList.add("function-section");
    sectionEl.id = func.id;

    if (func.id === "haldi") {
      const bgScene = document.createElement("div");
      bgScene.classList.add("haldi-scene-bg");
      bgScene.innerHTML = `
        <img src="/haldi-bg/10.webp" class="haldi-layer layer-base" alt="" loading="lazy" decoding="async" />
        <div class="haldi-sunbeam"></div>
        <img src="/haldi-bg/6.webp" class="haldi-layer layer-tree-left" alt="" loading="lazy" decoding="async" />
        <img src="/haldi-bg/7.webp" class="haldi-layer layer-arch" alt="" loading="lazy" decoding="async" />
        <canvas id="haldi-particles-canvas" class="haldi-particles-layer"></canvas>
        <img src="/haldi-bg/9.webp" class="haldi-layer layer-branch-left" alt="" loading="lazy" decoding="async" />
        <img src="/haldi-bg/8.webp" class="haldi-layer layer-branch-right" alt="" loading="lazy" decoding="async" />
        <img src="/haldi-bg/5.webp" class="haldi-layer layer-leaves-left" alt="" loading="lazy" decoding="async" />
        <img src="/haldi-bg/4.webp" class="haldi-layer layer-leaves-right" alt="" loading="lazy" decoding="async" />
        <img src="/haldi-bg/3.webp" class="haldi-layer layer-haldi-bowl" alt="" loading="lazy" decoding="async" />
      `;
      sectionEl.appendChild(bgScene);
    }

    if (func.id === "mehendi") {
      const bgScene = document.createElement("div");
      bgScene.classList.add("mehendi-scene-bg");
      bgScene.innerHTML = `
        <img src="/mehendi-bg/2.webp" class="mehendi-layer layer-base" alt="" loading="lazy" decoding="async" />
        <div class="mehendi-sunbeam"></div>
        <img src="/mehendi-bg/10.webp" class="mehendi-layer layer-gazebo" alt="" loading="lazy" decoding="async" />
        <img src="/mehendi-bg/7.webp" class="mehendi-layer layer-flowers-left" alt="" loading="lazy" decoding="async" />
        <img src="/mehendi-bg/6.webp" class="mehendi-layer layer-foliage-right" alt="" loading="lazy" decoding="async" />
        <canvas id="mehendi-particles-canvas" class="mehendi-particles-layer"></canvas>
        <img src="/mehendi-bg/5.webp" class="mehendi-layer layer-canopy-left" alt="" loading="lazy" decoding="async" />
        <img src="/mehendi-bg/4.webp" class="mehendi-layer layer-canopy-right" alt="" loading="lazy" decoding="async" />
        <img src="/mehendi-bg/3.webp" class="mehendi-layer layer-canopy-center" alt="" loading="lazy" decoding="async" />
        <img src="/mehendi-bg/8.webp" class="mehendi-layer layer-fg-grass" alt="" loading="lazy" decoding="async" />
        <img src="/mehendi-bg/9.webp" class="mehendi-layer layer-floor-mandala" alt="" loading="lazy" decoding="async" />
      `;
      sectionEl.appendChild(bgScene);
    }

    if (func.id === "sangeet") {
      const bgScene = document.createElement("div");
      bgScene.classList.add("sangeet-scene-bg");
      bgScene.innerHTML = `
        <img src="/sangeet-bg/2.webp" class="sangeet-layer layer-base" alt="" loading="lazy" decoding="async" />
        <div class="sangeet-sunbeam"></div>
        <img src="/sangeet-bg/10.webp" class="sangeet-layer layer-gazebo" alt="" loading="lazy" decoding="async" />
        <img src="/sangeet-bg/8.webp" class="sangeet-layer layer-trees-left" alt="" loading="lazy" decoding="async" />
        <img src="/sangeet-bg/9.webp" class="sangeet-layer layer-trees-right" alt="" loading="lazy" decoding="async" />
        <img src="/sangeet-bg/7.webp" class="sangeet-layer layer-stage-arch" alt="" loading="lazy" decoding="async" />
        <img src="/sangeet-bg/4.webp" class="sangeet-layer layer-stage-cushions" alt="" loading="lazy" decoding="async" />
        <canvas id="sangeet-particles-canvas" class="sangeet-particles-layer"></canvas>
        <img src="/sangeet-bg/11.webp" class="sangeet-layer layer-hanging-canopy" alt="" loading="lazy" decoding="async" />
        <img src="/sangeet-bg/6.webp" class="sangeet-layer layer-sitar" alt="" loading="lazy" decoding="async" />
        <img src="/sangeet-bg/3.webp" class="sangeet-layer layer-tabla" alt="" loading="lazy" decoding="async" />
        <img src="/sangeet-bg/5.webp" class="sangeet-layer layer-mic" alt="" loading="lazy" decoding="async" />
      `;
      sectionEl.appendChild(bgScene);
    }

    if (func.id === "wedding") {
      const bgScene = document.createElement("div");
      bgScene.classList.add("wedding-scene-bg");
      bgScene.innerHTML = `
        <img src="/wedding-bg/2.webp" class="wedding-layer layer-base" alt="" loading="lazy" decoding="async" />
        <div class="wedding-sunbeam"></div>
        <img src="/wedding-bg/10.webp" class="wedding-layer layer-mandap-platform" alt="" loading="lazy" decoding="async" />
        <img src="/wedding-bg/7.webp" class="wedding-layer layer-mandap-arch" alt="" loading="lazy" decoding="async" />
        <img src="/wedding-bg/8.webp" class="wedding-layer layer-parasol-right" alt="" loading="lazy" decoding="async" />
        <img src="/wedding-bg/5.webp" class="wedding-layer layer-banana-leaves" alt="" loading="lazy" decoding="async" />
        <canvas id="wedding-particles-canvas" class="wedding-particles-layer"></canvas>
        <img src="/wedding-bg/3.webp" class="wedding-layer layer-canopy-left" alt="" loading="lazy" decoding="async" />
        <img src="/wedding-bg/9.webp" class="wedding-layer layer-canopy-right" alt="" loading="lazy" decoding="async" />
        <img src="/wedding-bg/6.webp" class="wedding-layer layer-flowers-left" alt="" loading="lazy" decoding="async" />
        <img src="/wedding-bg/11.webp" class="wedding-layer layer-fg-flowers" alt="" loading="lazy" decoding="async" />
      `;
      sectionEl.appendChild(bgScene);
    }

    if (func.id === "reception") {
      const bgScene = document.createElement("div");
      bgScene.classList.add("reception-scene-bg");
      bgScene.innerHTML = `
        <img src="/reception-bg/2.webp" class="reception-layer layer-base" alt="" loading="lazy" decoding="async" />
        <div class="reception-sunbeam"></div>
        <img src="/reception-bg/3.webp" class="reception-layer layer-arch-left" alt="" loading="lazy" decoding="async" />
        <img src="/reception-bg/5.webp" class="reception-layer layer-birdcage-right" alt="" loading="lazy" decoding="async" />
        <img src="/reception-bg/10.webp" class="reception-layer layer-couch-lounge" alt="" loading="lazy" decoding="async" />
        <canvas id="reception-particles-canvas" class="reception-particles-layer"></canvas>
        <img src="/reception-bg/8.webp" class="reception-layer layer-canopy-left" alt="" loading="lazy" decoding="async" />
        <img src="/reception-bg/9.webp" class="reception-layer layer-canopy-right" alt="" loading="lazy" decoding="async" />
        <img src="/reception-bg/7.webp" class="reception-layer layer-lanterns-left" alt="" loading="lazy" decoding="async" />
        <img src="/reception-bg/6.webp" class="reception-layer layer-flowers-right" alt="" loading="lazy" decoding="async" />
        <img src="/reception-bg/4.webp" class="reception-layer layer-fg-bushes" alt="" loading="lazy" decoding="async" />
      `;
      sectionEl.appendChild(bgScene);
    }

    if (func.badge) {
      const badgeEl = document.createElement("div");
      badgeEl.classList.add("function-badge");
      badgeEl.textContent = func.badge;
      sectionEl.appendChild(badgeEl);
    }

    const topImages = func.images.slice(0, 1);
    const bottomImages = func.images.slice(1);

    const createImageItem = (imgNum) => {
      const imageItem = document.createElement("div");
      imageItem.classList.add("spotlight-image");
      if (globalImageIndex % 2 === 1) {
        imageItem.classList.add("reverse");
      }
      imageItem.dataset.globalIndex = globalImageIndex;

      const shrinkStartIndex = Math.floor(16 * 0.75);
      const shrinkFactor =
        globalImageIndex >= shrinkStartIndex
          ? (globalImageIndex - shrinkStartIndex + 1) / (16 - shrinkStartIndex)
          : 0;

      const imageHeight = IMAGE_BASE_HEIGHT * (1 - shrinkFactor * 0.5);

      const imgWrapper = document.createElement("div");
      imgWrapper.classList.add("spotlight-img-wrapper");
      imgWrapper.style.aspectRatio = ASPECT_RATIOS[globalImageIndex % ASPECT_RATIOS.length];
      imgWrapper.style.height = `${Math.round(imageHeight)}px`;

      const img = document.createElement("img");
      img.src = `/gallery/img${imgNum}.jpg`;
      img.alt = `${func.title} Photo`;
      img.loading = "lazy";
      img.decoding = "async";

      imgWrapper.appendChild(img);
      imageItem.appendChild(imgWrapper);

      globalImageIndex++;
      return imageItem;
    };

    topImages.forEach((imgNum) => {
      sectionEl.appendChild(createImageItem(imgNum));
    });

    const textDiv = document.createElement("div");
    textDiv.classList.add("spotlight-text", "invitation-card");
    textDiv.innerHTML = `
      <h2 class="card-function-title">${func.title}</h2>
      <p class="card-tagline">${func.tagline}</p>
      
      <div class="card-event-details">
        <span class="card-day">${func.day}</span>
        <span class="card-date">${func.date}</span>
        <span class="card-time">${func.time}</span>
        <span class="card-venue">${func.venue}</span>
      </div>

      <div class="card-dress-code">
        <h4 class="dress-code-header">Dress code</h4>
        <p class="dress-code-sub">${func.dressSub}</p>
        <p class="dress-code-detail">${func.dressDetail}</p>
      </div>
    `;
    sectionEl.appendChild(textDiv);

    bottomImages.forEach((imgNum) => {
      sectionEl.appendChild(createImageItem(imgNum));
    });

    spotlightImagesContainer.appendChild(sectionEl);
  });

  const imageItems = gsap.utils.toArray(".spotlight-image");

  function updateImageSizes() {
    const sizeFactor = Math.min(window.innerWidth / 750, 1);

    imageItems.forEach((imageItem) => {
      const idx = parseInt(imageItem.dataset.globalIndex || "0", 10);
      const shrinkStartIndex = Math.floor(16 * 0.75);
      const shrinkFactor =
        idx >= shrinkStartIndex
          ? (idx - shrinkStartIndex + 1) / (16 - shrinkStartIndex)
          : 0;

      const imageHeight =
        IMAGE_BASE_HEIGHT * sizeFactor * (1 - shrinkFactor * 0.5);

      const imgWrapper = imageItem.querySelector(".spotlight-img-wrapper");
      if (imgWrapper) {
        imgWrapper.style.height = `${Math.round(imageHeight)}px`;
      }
    });
  }

  updateImageSizes();

  const cachedWidths = new Array(imageItems.length).fill(0);
  const updateCachedWidths = () => {
    imageItems.forEach((imageItem, i) => {
      const imgWrapper = imageItem.querySelector(".spotlight-img-wrapper");
      if (imgWrapper) cachedWidths[i] = imgWrapper.offsetWidth;
    });
  };
  updateCachedWidths();

  window.addEventListener("resize", updateCachedWidths, { passive: true });

  imageItems.forEach((imageItem, i) => {
    const idx = parseInt(imageItem.dataset.globalIndex || "0", 10);
    const normalizedIndex = idx / (16 - 1);
    const imgWrapper = imageItem.querySelector(".spotlight-img-wrapper");

    ScrollTrigger.create({
      trigger: imageItem,
      start: "top bottom",
      end: "bottom top",
      fastScrollEnd: true,
      onUpdate: ({ progress }) => {
        const { base, flow, detail } = CONFIG.waves;
        const vw = window.innerWidth;
        const cachedWidth = cachedWidths[i] || (imgWrapper ? imgWrapper.offsetWidth : 0);

        const baseWave = Math.sin(
          normalizedIndex * base.freq + (1 - progress) * base.speed + base.phase,
        );

        const flowWave =
          0.5 +
          Math.sin(
            normalizedIndex * flow.freq + flow.phase + progress * flow.speed,
          );

        const detailWave =
          0.5 +
          Math.sin(
            normalizedIndex * detail.freq +
              detail.phase +
              progress * detail.speed,
          );

        if (imgWrapper) {
          const translateX =
            (vw - cachedWidth) / 2 -
            vw * 0.05 +
            baseWave * vw * base.amp +
            flowWave * vw * flow.amp +
            detailWave * vw * detail.amp;

          const centerOffset = Math.abs(progress - 0.5) * 2;
          const clipAmount =
            Math.pow(centerOffset, CONFIG.clipPower) * CONFIG.clipMax;

          gsap.set(imgWrapper, {
            x: translateX,
            clipPath: `inset(0 ${clipAmount}% 0 ${clipAmount}%)`,
          });
        }
      },
    });
  });

  let lastWindowWidth = window.innerWidth;
  window.addEventListener("resize", () => {
    if (window.innerWidth !== lastWindowWidth) {
      lastWindowWidth = window.innerWidth;
      updateImageSizes();
      ScrollTrigger.refresh();
    }
  }, { passive: true });

  // --- HALDI SCENE CONSOLIDATED MASTER PARALLAX TIMELINE ---
  const haldiSection = document.querySelector("#haldi");
  if (haldiSection) {
    sectionIdleTweens["haldi"] = [
      gsap.to("#haldi .layer-branch-left", { rotation: 3, xPercent: 2, duration: 3.5, yoyo: true, repeat: -1, ease: "sine.inOut" }),
      gsap.to("#haldi .layer-branch-right", { rotation: -3.5, xPercent: -2.5, duration: 4.2, delay: 0.3, yoyo: true, repeat: -1, ease: "sine.inOut" }),
      gsap.to("#haldi .layer-tree-left", { rotation: 1.8, xPercent: 1, duration: 5, yoyo: true, repeat: -1, ease: "sine.inOut" }),
      gsap.to("#haldi .layer-leaves-left", { rotation: -2.5, scale: 1.02, duration: 3.8, yoyo: true, repeat: -1, ease: "sine.inOut" }),
      gsap.to("#haldi .layer-leaves-right", { rotation: 2.8, scale: 1.02, duration: 4.5, delay: 0.4, yoyo: true, repeat: -1, ease: "sine.inOut" }),
    ];

    const haldiST = gsap.timeline({ scrollTrigger: { trigger: haldiSection, start: "top bottom", end: "bottom top", scrub: 0.5 } });
    haldiST
      .to("#haldi .layer-base", { scale: 1.05, ease: "none" }, 0)
      .to("#haldi .layer-tree-left", { rotation: -3, xPercent: -2, ease: "none" }, 0)
      .to("#haldi .layer-arch", { scale: 1.03, ease: "none" }, 0)
      .to("#haldi .layer-branch-left", { rotation: 5, xPercent: 3, ease: "none" }, 0)
      .to("#haldi .layer-branch-right", { rotation: -6, xPercent: -3, ease: "none" }, 0)
      .to("#haldi .layer-leaves-left", { rotation: -4, xPercent: -3, ease: "none" }, 0)
      .to("#haldi .layer-leaves-right", { rotation: 4, xPercent: 3, ease: "none" }, 0)
      .to("#haldi .layer-haldi-bowl", { scale: 1.03, ease: "none" }, 0);

    gsap.set("#haldi .spotlight-text.invitation-card", { y: 0 });
    gsap.fromTo("#haldi .card-function-title", { opacity: 0, scale: 0.94, y: 15 }, { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: haldiSection, start: "top 70%", toggleActions: "play none none reverse" } });
    gsap.fromTo("#haldi .card-tagline, #haldi .card-event-details, #haldi .card-dress-code", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: haldiSection, start: "top 70%", toggleActions: "play none none reverse" } });

    particleSystems["haldi"] = createParticleSystem("haldi-particles-canvas", haldiSection, { count: 20, centerColor: "rgba(255, 235, 150, 1)", glowColor: "rgba(255, 215, 0, 0.6)" });
  }

  // --- MEHENDI SCENE CONSOLIDATED MASTER PARALLAX TIMELINE ---
  const mehendiSection = document.querySelector("#mehendi");
  if (mehendiSection) {
    sectionIdleTweens["mehendi"] = [
      gsap.to("#mehendi .layer-canopy-left", { rotation: 3.2, xPercent: 2.2, duration: 3.6, yoyo: true, repeat: -1, ease: "sine.inOut" }),
      gsap.to("#mehendi .layer-canopy-right", { rotation: -3.6, xPercent: -2.5, duration: 4.3, delay: 0.2, yoyo: true, repeat: -1, ease: "sine.inOut" }),
      gsap.to("#mehendi .layer-canopy-center", { scale: 1.02, yPercent: 1.5, duration: 3.8, yoyo: true, repeat: -1, ease: "sine.inOut" }),
      gsap.to("#mehendi .layer-flowers-left", { rotation: -2.2, xPercent: -1.2, duration: 4.8, yoyo: true, repeat: -1, ease: "sine.inOut" }),
      gsap.to("#mehendi .layer-foliage-right", { rotation: 2.5, xPercent: 1.5, duration: 4.4, delay: 0.3, yoyo: true, repeat: -1, ease: "sine.inOut" }),
    ];

    const mehendiST = gsap.timeline({ scrollTrigger: { trigger: mehendiSection, start: "top bottom", end: "bottom top", scrub: 0.5 } });
    mehendiST
      .to("#mehendi .layer-base", { scale: 1.05, ease: "none" }, 0)
      .to("#mehendi .layer-gazebo", { scale: 1.03, ease: "none" }, 0)
      .to("#mehendi .layer-flowers-left", { rotation: -4, xPercent: -3, ease: "none" }, 0)
      .to("#mehendi .layer-foliage-right", { rotation: 4, xPercent: 3, ease: "none" }, 0)
      .to("#mehendi .layer-canopy-left", { rotation: 5, xPercent: 3, ease: "none" }, 0)
      .to("#mehendi .layer-canopy-right", { rotation: -6, xPercent: -3, ease: "none" }, 0)
      .to("#mehendi .layer-floor-mandala", { scale: 1.03, ease: "none" }, 0);

    gsap.set("#mehendi .spotlight-text.invitation-card", { y: 0 });
    gsap.fromTo("#mehendi .card-function-title", { opacity: 0, scale: 0.94, y: 15 }, { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: mehendiSection, start: "top 70%", toggleActions: "play none none reverse" } });
    gsap.fromTo("#mehendi .card-tagline, #mehendi .card-event-details, #mehendi .card-dress-code", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: mehendiSection, start: "top 70%", toggleActions: "play none none reverse" } });

    particleSystems["mehendi"] = createParticleSystem("mehendi-particles-canvas", mehendiSection, { count: 20, centerColor: "rgba(180, 245, 160, 1)", glowColor: "rgba(160, 225, 140, 0.6)" });
  }

  // --- SANGEET SCENE CONSOLIDATED MASTER PARALLAX TIMELINE ---
  const sangeetSection = document.querySelector("#sangeet");
  if (sangeetSection) {
    sectionIdleTweens["sangeet"] = [
      gsap.to("#sangeet .layer-hanging-canopy", { rotation: 2.8, xPercent: 1.8, duration: 3.8, yoyo: true, repeat: -1, ease: "sine.inOut" }),
      gsap.to("#sangeet .layer-sitar", { rotation: 1.5, xPercent: 1.0, duration: 4.5, delay: 0.2, yoyo: true, repeat: -1, ease: "sine.inOut" }),
      gsap.to("#sangeet .layer-trees-left", { rotation: -1.8, xPercent: -1.2, duration: 4.8, yoyo: true, repeat: -1, ease: "sine.inOut" }),
      gsap.to("#sangeet .layer-trees-right", { rotation: 2.2, xPercent: 1.4, duration: 4.2, delay: 0.3, yoyo: true, repeat: -1, ease: "sine.inOut" }),
    ];

    const sangeetST = gsap.timeline({ scrollTrigger: { trigger: sangeetSection, start: "top bottom", end: "bottom top", scrub: 0.5 } });
    sangeetST
      .to("#sangeet .layer-base", { scale: 1.05, ease: "none" }, 0)
      .to("#sangeet .layer-stage-arch", { scale: 1.03, ease: "none" }, 0)
      .to("#sangeet .layer-hanging-canopy", { rotation: -5, xPercent: -3, ease: "none" }, 0)
      .to("#sangeet .layer-sitar", { rotation: 3, xPercent: 2, ease: "none" }, 0)
      .to("#sangeet .layer-tabla", { scale: 1.03, ease: "none" }, 0);

    gsap.set("#sangeet .spotlight-text.invitation-card", { y: 0 });
    gsap.fromTo("#sangeet .card-function-title", { opacity: 0, scale: 0.94, y: 15 }, { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: sangeetSection, start: "top 70%", toggleActions: "play none none reverse" } });
    gsap.fromTo("#sangeet .card-tagline, #sangeet .card-event-details, #sangeet .card-dress-code", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: sangeetSection, start: "top 70%", toggleActions: "play none none reverse" } });

    particleSystems["sangeet"] = createParticleSystem("sangeet-particles-canvas", sangeetSection, { count: 20, centerColor: "rgba(255, 230, 150, 1)", glowColor: "rgba(255, 215, 120, 0.6)" });
  }

  // --- WEDDING SCENE CONSOLIDATED MASTER PARALLAX TIMELINE ---
  const weddingSection = document.querySelector("#wedding");
  if (weddingSection) {
    sectionIdleTweens["wedding"] = [
      gsap.to("#wedding .layer-canopy-left", { rotation: 6.0, xPercent: 3.2, duration: 3.2, yoyo: true, repeat: -1, ease: "sine.inOut" }),
      gsap.to("#wedding .layer-canopy-right", { rotation: -4.5, yPercent: 2.5, duration: 3.8, delay: 0.2, yoyo: true, repeat: -1, ease: "sine.inOut" }),
      gsap.to("#wedding .layer-parasol-right", { rotation: -4.0, xPercent: -2.5, duration: 4.2, delay: 0.3, yoyo: true, repeat: -1, ease: "sine.inOut" }),
      gsap.to("#wedding .layer-banana-leaves", { rotation: 4.5, xPercent: 2.5, duration: 3.6, yoyo: true, repeat: -1, ease: "sine.inOut" }),
      gsap.to("#wedding .layer-flowers-left", { rotation: -3.0, xPercent: -1.8, duration: 4.5, yoyo: true, repeat: -1, ease: "sine.inOut" }),
    ];

    const weddingST = gsap.timeline({ scrollTrigger: { trigger: weddingSection, start: "top bottom", end: "bottom top", scrub: 0.5 } });
    weddingST
      .to("#wedding .layer-base", { scale: 1.08, ease: "none" }, 0)
      .to("#wedding .layer-mandap-arch", { scale: 1.06, rotation: 4, xPercent: 2.5, ease: "none" }, 0)
      .to("#wedding .layer-mandap-platform", { scale: 1.04, yPercent: -2, ease: "none" }, 0)
      .to("#wedding .layer-canopy-left", { rotation: -8, xPercent: -5, ease: "none" }, 0)
      .to("#wedding .layer-canopy-right", { rotation: 7, xPercent: 4.5, ease: "none" }, 0)
      .to("#wedding .layer-parasol-right", { rotation: 6.5, xPercent: 3.5, ease: "none" }, 0)
      .to("#wedding .layer-banana-leaves", { rotation: -7, xPercent: -4, ease: "none" }, 0)
      .to("#wedding .layer-flowers-left", { rotation: -5, xPercent: -3, ease: "none" }, 0)
      .to("#wedding .layer-fg-flowers", { scale: 1.08, yPercent: -4, ease: "none" }, 0);

    gsap.set("#wedding .spotlight-text.invitation-card", { y: 0 });
    gsap.fromTo("#wedding .card-function-title", { opacity: 0, scale: 0.94, y: 15 }, { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: weddingSection, start: "top 70%", toggleActions: "play none none reverse" } });
    gsap.fromTo("#wedding .card-tagline, #wedding .card-event-details, #wedding .card-dress-code", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: weddingSection, start: "top 70%", toggleActions: "play none none reverse" } });

    particleSystems["wedding"] = createParticleSystem("wedding-particles-canvas", weddingSection, { count: 24, centerColor: "rgba(255, 200, 180, 1)", glowColor: "rgba(240, 160, 140, 0.65)" });
  }

  // --- RECEPTION SCENE CONSOLIDATED MASTER PARALLAX TIMELINE ---
  const receptionSection = document.querySelector("#reception");
  if (receptionSection) {
    sectionIdleTweens["reception"] = [
      gsap.to("#reception .layer-lanterns-left", { rotation: 6.5, xPercent: 3.5, duration: 3.2, yoyo: true, repeat: -1, ease: "sine.inOut" }),
      gsap.to("#reception .layer-canopy-left", { rotation: -5.0, xPercent: -3.0, duration: 3.8, delay: 0.2, yoyo: true, repeat: -1, ease: "sine.inOut" }),
      gsap.to("#reception .layer-canopy-right", { rotation: 4.0, yPercent: 3.0, duration: 3.5, yoyo: true, repeat: -1, ease: "sine.inOut" }),
      gsap.to("#reception .layer-flowers-right", { rotation: -4.5, yPercent: 2.5, duration: 4.2, delay: 0.1, yoyo: true, repeat: -1, ease: "sine.inOut" }),
      gsap.to("#reception .layer-birdcage-right", { rotation: 3.5, xPercent: 2.0, duration: 4.5, delay: 0.3, yoyo: true, repeat: -1, ease: "sine.inOut" }),
      gsap.to("#reception .layer-arch-left", { rotation: -2.8, xPercent: -1.5, duration: 4.6, yoyo: true, repeat: -1, ease: "sine.inOut" }),
    ];

    const receptionST = gsap.timeline({ scrollTrigger: { trigger: receptionSection, start: "top bottom", end: "bottom top", scrub: 0.5 } });
    receptionST
      .to("#reception .layer-base", { scale: 1.08, ease: "none" }, 0)
      .to("#reception .layer-couch-lounge", { scale: 1.05, yPercent: -2, ease: "none" }, 0)
      .to("#reception .layer-arch-left", { rotation: 5, xPercent: 3, ease: "none" }, 0)
      .to("#reception .layer-birdcage-right", { rotation: -6, xPercent: -4, ease: "none" }, 0)
      .to("#reception .layer-canopy-left", { rotation: 8, xPercent: 5, ease: "none" }, 0)
      .to("#reception .layer-canopy-right", { rotation: -7, xPercent: -4, ease: "none" }, 0)
      .to("#reception .layer-lanterns-left", { rotation: -8, xPercent: -5, ease: "none" }, 0)
      .to("#reception .layer-flowers-right", { rotation: 6, xPercent: 4, ease: "none" }, 0)
      .to("#reception .layer-fg-bushes", { scale: 1.08, yPercent: -4, ease: "none" }, 0);

    gsap.set("#reception .spotlight-text.invitation-card", { y: 0 });
    gsap.fromTo("#reception .card-function-title", { opacity: 0, scale: 0.94, y: 15 }, { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: receptionSection, start: "top 70%", toggleActions: "play none none reverse" } });
    gsap.fromTo("#reception .card-tagline, #reception .card-event-details, #reception .card-dress-code", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: receptionSection, start: "top 70%", toggleActions: "play none none reverse" } });

    particleSystems["reception"] = createParticleSystem("reception-particles-canvas", receptionSection, { count: 24, centerColor: "rgba(255, 245, 210, 1)", glowColor: "rgba(235, 205, 130, 0.65)" });
  }

  // --- TRANSITION STORY ANIMATED STICKER WIPE OVERLAY ---
  let currentWipeStoryNum = 0;

  const triggerWipeOverlay = (storyNum = 1) => {
    const wipeEl = document.querySelector(".page-transition-wipe");
    const storyImgEl = document.querySelector(".wipe-story-img");
    if (!wipeEl) return;

    const validStoryNum = ((storyNum - 1) % 6) + 1;
    if (storyImgEl) {
      storyImgEl.src = `/transitionstory/${validStoryNum}.webp`;
      gsap.set(storyImgEl, { scale: 0.7, opacity: 0 });
    }

    gsap.killTweensOf([wipeEl, storyImgEl]);
    const tl = gsap.timeline();

    tl.fromTo(
      wipeEl,
      { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" },
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        duration: 0.45,
        ease: "power4.inOut",
      }
    );

    if (storyImgEl) {
      tl.to(
        storyImgEl,
        { scale: 1, opacity: 1, duration: 0.35, ease: "power3.out" },
        "-=0.2"
      );
      tl.to(
        storyImgEl,
        { scale: 1.08, opacity: 0, duration: 0.25, ease: "power2.in" },
        "+=0.1"
      );
    }

    tl.to(
      wipeEl,
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 0.45,
        ease: "power4.inOut",
        onComplete: () => {
          gsap.set(wipeEl, {
            clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
          });
          if (storyImgEl) {
            gsap.set(storyImgEl, { scale: 0, opacity: 0 });
          }
        },
      },
      "-=0.15"
    );
  };

  // --- SECTION VIEW TRANSITIONS & REVEAL ANIMATIONS ---
  function setupSectionTransitions() {
    const sections = document.querySelectorAll(".function-section");

    sections.forEach((section) => {
      gsap.fromTo(
        section,
        { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" },
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            end: "top 20%",
            scrub: 0.5,
          },
        }
      );

      const cardTitle = section.querySelector(".card-function-title");
      const cardTagline = section.querySelector(".card-tagline");
      const badge = section.querySelector(".function-badge");
      const details = section.querySelectorAll(
        ".card-event-details span, .card-dress-code h4, .card-dress-code p"
      );

      if (cardTitle) {
        splitText(cardTitle, "chars", "char", false);
        gsap.fromTo(
          cardTitle.querySelectorAll(".char"),
          { y: "150%" },
          {
            y: "0%",
            duration: 0.8,
            stagger: 0.025,
            ease: "power4.out",
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      if (cardTagline) {
        splitText(cardTagline, "words", "word", false);
        gsap.fromTo(
          cardTagline.querySelectorAll(".word"),
          { y: "120%" },
          {
            y: "0%",
            duration: 0.7,
            stagger: 0.02,
            ease: "power4.out",
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      if (badge) {
        gsap.fromTo(
          badge,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      if (details.length > 0) {
        gsap.fromTo(
          details,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.04,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    });

    const introSection = document.querySelector("section.intro");
    if (introSection) {
      gsap.fromTo(
        introSection,
        { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" },
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          ease: "power2.out",
          scrollTrigger: {
            trigger: introSection,
            start: "top 85%",
            end: "top 20%",
            scrub: 0.5,
          },
        }
      );

      const introH1 = introSection.querySelector(".intro-welcome-title");
      if (introH1) {
        splitText(introH1, "words", "word", false);
        gsap.fromTo(
          introH1.querySelectorAll(".word"),
          { y: "120%", opacity: 0 },
          {
            y: "0%",
            opacity: 1,
            duration: 0.8,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".intro",
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }

    const outroSection = document.querySelector("section.outro");
    if (outroSection) {
      gsap.fromTo(
        outroSection,
        { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" },
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          ease: "power2.out",
          scrollTrigger: {
            trigger: outroSection,
            start: "top 85%",
            end: "top 20%",
            scrub: 0.5,
          },
        }
      );
    }

    // --- AUTOMATIC STICKER WIPE OVERLAY ON SECTION SCROLL (MOBILE PHONE & DESKTOP) ---
    const sectionStories = [
      { selector: "#haldi", storyNum: 1 },
      { selector: "#mehendi", storyNum: 2 },
      { selector: "#sangeet", storyNum: 3 },
      { selector: "#wedding", storyNum: 4 },
      { selector: "#reception", storyNum: 5 },
      { selector: "section.outro", storyNum: 6 },
    ];

    sectionStories.forEach(({ selector, storyNum }) => {
      const secEl = document.querySelector(selector);
      if (secEl) {
        ScrollTrigger.create({
          trigger: secEl,
          start: "top 65%",
          onEnter: () => {
            if (currentWipeStoryNum !== storyNum) {
              currentWipeStoryNum = storyNum;
              triggerWipeOverlay(storyNum);
            }
          },
          onEnterBack: () => {
            if (currentWipeStoryNum !== storyNum) {
              currentWipeStoryNum = storyNum;
              triggerWipeOverlay(storyNum);
            }
          },
        });
      }
    });

    // --- REAL-TIME WEDDING COUNTDOWN TIMER ---
    const weddingDate = new Date("2027-06-02T10:00:00+05:30").getTime();

    function updateCountdown() {
      const now = new Date().getTime();
      const distance = weddingDate - now;

      const daysEl = document.getElementById("countdown-days");
      const hoursEl = document.getElementById("countdown-hours");
      const minsEl = document.getElementById("countdown-mins");
      const secsEl = document.getElementById("countdown-secs");

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (daysEl) daysEl.textContent = String(days).padStart(2, "0");
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
        if (minsEl) minsEl.textContent = String(minutes).padStart(2, "0");
        if (secsEl) secsEl.textContent = String(seconds).padStart(2, "0");
      } else {
        if (daysEl) {
          const titleEl = document.querySelector(".outro-title");
          if (titleEl) titleEl.textContent = "The Big Day Is Here!";
          if (daysEl) daysEl.textContent = "00";
          if (hoursEl) hoursEl.textContent = "00";
          if (minsEl) minsEl.textContent = "00";
          if (secsEl) secsEl.textContent = "00";
        }
      }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // --- NATURAL SMOOTH NAV LINK SCROLLING ---
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const targetId = link.getAttribute("href");
        if (!targetId || targetId === "#") return;

        const targetEl = document.querySelector(targetId);
        if (!targetEl) return;

        e.preventDefault();
        lenis.scrollTo(targetEl, {
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      });
    });
  }

  setupSectionTransitions();
}

// --- SECTION VIEWPORT OBSERVER (PAUSE OFFSCREEN ANIMATIONS & PARTICLES FOR MAX PERFORMANCE) ---
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const id = entry.target.id;
      const ps = particleSystems[id];
      const tweens = sectionIdleTweens[id];

      if (entry.isIntersecting) {
        if (ps) ps.start();
        if (tweens) tweens.forEach((t) => t.resume());
        if (entry.target.classList.contains("hero")) {
          const cosmos = entry.target.querySelector(".hero-cosmos-container");
          if (cosmos) cosmos.style.display = "flex";
        }
      } else {
        if (ps) ps.stop();
        if (tweens) tweens.forEach((t) => t.pause());
        if (entry.target.classList.contains("hero")) {
          const cosmos = entry.target.querySelector(".hero-cosmos-container");
          if (cosmos) cosmos.style.display = "none";
        }
      }
    });
  },
  { threshold: 0.05 }
);

setTimeout(() => {
  document
    .querySelectorAll(".hero, section.intro, .function-section, section.outro")
    .forEach((sec) => {
      sectionObserver.observe(sec);
    });
}, 100);

// Global HTML View Transitions Intercept
if (typeof navigation !== "undefined" && navigation?.addEventListener) {
  navigation.addEventListener("navigate", (event) => {
    if (
      !event.destination.url.includes(location.origin) ||
      !event.destination.url.endsWith(".html")
    )
      return;

    event.intercept({
      handler: async () => {
        const response = await fetch(event.destination.url);
        const text = await response.text();

        const transition = document.startViewTransition(() => {
          const body = text.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1];
          if (body) document.body.innerHTML = body;

          const title = text.match(/<title[^>]*>(.*?)<\/title>/i)?.[1];
          if (title) document.title = title;
        });

        transition.ready.then(() => {
          window.scrollTo(0, 0);
          ScrollTrigger.refresh();
        });
      },
      scroll: "manual",
    });
  });
}
