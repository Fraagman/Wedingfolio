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
  syncTouch: true,
});
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// --- PRELOADER & HERO REVEAL ---
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
splitText(".header h1", "chars", "char", false);
splitText(".hero-footer p", "words", "word");

const preloaderImgInitRotations = [7.5, -2.5, -10, 12.5, -5, 5];
gsap.set(".preloader-img", {
  rotate: (i) => preloaderImgInitRotations[i],
});

const tl = gsap.timeline({
  delay: 0.5,
  onComplete: () => {
    ScrollTrigger.refresh();
  },
});

tl.to(".preloader-img", {
  scale: 1,
  clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  duration: 1,
  ease: "hop",
  stagger: 0.2,
});

tl.to(
  ".preloader-header h1 .char",
  {
    y: "0%",
    duration: 1,
    ease: "hop2",
    stagger: { each: 0.125, from: "random" },
  },
  "0.35",
);

tl.to(
  ".preloader-counter p",
  {
    y: "0%",
    duration: 1,
    ease: "hop2",
    onStart: () => {
      const counterEl = document.querySelector(".preloader-counter p");
      const counter = { value: 0 };

      gsap.to(counter, {
        value: 100,
        duration: 2,
        delay: 0.5,
        ease: "power2.inOut",
        onUpdate: () => {
          counterEl.textContent = String(Math.round(counter.value)).padStart(
            3,
            "0",
          );
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
    duration: 0.75,
    ease: "hop2",
  },
  3.25,
);

tl.to(
  ".preloader-header h1 .char",
  {
    y: "-100%",
    duration: 0.75,
    ease: "hop2",
    stagger: { each: 0.125, from: "random" },
  },
  3.25,
);

tl.to(
  ".preloader-images .preloader-img",
  {
    scale: 0,
    clipPath: "polygon(20% 20%, 80% 20%, 80% 80%, 20% 80%)",
    duration: 1,
    ease: "hop2",
    stagger: -0.075,
  },
  3.5,
);

tl.to(
  ".preloader",
  {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
    duration: 1,
    ease: "hop2",
    onComplete: () => {
      document.querySelector(".preloader").style.display = "none";
      ScrollTrigger.refresh();
    },
  },
  4.35,
);

tl.to(
  ".header h1 .char",
  {
    y: "0%",
    duration: 1,
    ease: "hop",
    stagger: { each: 0.075, from: "random" },
  },
  4.65,
);

tl.to(
  "nav a .word",
  {
    y: "0%",
    duration: 1,
    ease: "hop",
    stagger: 0.075,
  },
  4.75,
);

tl.to(
  ".hero-footer p .word",
  {
    y: "0%",
    duration: 1,
    ease: "hop",
    stagger: 0.075,
  },
  4.75,
);

// --- SCROLL WAVE IMAGE GALLERY — 5 WEDDING FUNCTION SECTIONS ---
const FUNCTIONS_DATA = [
  {
    id: "haldi",
    badge: "",
    title: "Haldi",
    tagline: "A golden splash of turmeric, laughter & family blessings",
    day: "MON",
    date: "June 2 2026",
    time: "10:00 AM onwards",
    venue: "Courtyard Villa Lawn",
    dressSub: "Shades of Sun & Gold",
    dressDetail: "Yellow Kurta, Floral Sarees or Bright Ethnic Wear",
    images: [],
  },
  {
    id: "mehendi",
    badge: "",
    title: "Mehendi",
    tagline: "An afternoon of intricate henna, music & vibrant color",
    day: "TUE",
    date: "June 3 2026",
    time: "03:00 PM onwards",
    venue: "Mango Grove Garden",
    dressSub: "Vibrant Festive Shades",
    dressDetail: "Green, Floral Prints, Lehengas or Indo-Western",
    images: [],
  },
  {
    id: "sangeet",
    badge: "03 — SANGEET NIGHT",
    title: "Sangeet",
    tagline: "A playful night of sangeet and cultural festivities",
    day: "WED",
    date: "June 4 2026",
    time: "07:30 PM onwards",
    venue: "Uttar Garden Lawn",
    dressSub: "Embracing the charm of Gujarati heritage",
    dressDetail: "Bandhani, Patola, Leheriya or Kutchi Mirrorwork",
    images: [7, 8, 9],
  },
  {
    id: "wedding",
    badge: "04 — WEDDING CEREMONY",
    title: "Wedding",
    tagline: "A sacred union under divine blessings & holy fire",
    day: "THU",
    date: "June 5 2026",
    time: "05:00 PM onwards",
    venue: "The Royal Palace Mandap",
    dressSub: "Traditional Royal Elegance",
    dressDetail: "Classic Sherwanis, Kanjeevarams or Regal Silks",
    images: [10, 11, 12],
  },
  {
    id: "reception",
    badge: "05 — GRAND RECEPTION",
    title: "Reception",
    tagline: "An enchanting evening of fine dining, music & toasts",
    day: "FRI",
    date: "June 6 2026",
    time: "08:00 PM onwards",
    venue: "Grand Imperial Ballroom",
    dressSub: "Black Tie & Glamour",
    dressDetail: "Tuxedos, Evening Gowns or Designer Lehengas",
    images: [1, 2, 3, 4],
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
    // Create Dedicated Function Section Container
    const sectionEl = document.createElement("section");
    sectionEl.classList.add("function-section");
    sectionEl.id = func.id;

    // Inject Haldi Scenic Layered Background for Haldi Section
    if (func.id === "haldi") {
      const bgScene = document.createElement("div");
      bgScene.classList.add("haldi-scene-bg");
      bgScene.innerHTML = `
        <img src="/haldi-bg/10.png" class="haldi-layer layer-base" alt="" />
        <div class="haldi-sunbeam"></div>
        <img src="/haldi-bg/6.png" class="haldi-layer layer-tree-left" alt="" />
        <img src="/haldi-bg/7.png" class="haldi-layer layer-arch" alt="" />
        <canvas id="haldi-particles-canvas" class="haldi-particles-layer"></canvas>
        <img src="/haldi-bg/9.png" class="haldi-layer layer-branch-left" alt="" />
        <img src="/haldi-bg/8.png" class="haldi-layer layer-branch-right" alt="" />
        <img src="/haldi-bg/5.png" class="haldi-layer layer-leaves-left" alt="" />
        <img src="/haldi-bg/4.png" class="haldi-layer layer-leaves-right" alt="" />
        <img src="/haldi-bg/3.png" class="haldi-layer layer-haldi-bowl" alt="" />
      `;
      sectionEl.appendChild(bgScene);
    }

    // Inject Mehendi Scenic Layered Background for Mehendi Section
    if (func.id === "mehendi") {
      const bgScene = document.createElement("div");
      bgScene.classList.add("mehendi-scene-bg");
      bgScene.innerHTML = `
        <img src="/mehendi-bg/2.png" class="mehendi-layer layer-base" alt="" />
        <div class="mehendi-sunbeam"></div>
        <img src="/mehendi-bg/10.png" class="mehendi-layer layer-gazebo" alt="" />
        <img src="/mehendi-bg/7.png" class="mehendi-layer layer-flowers-left" alt="" />
        <img src="/mehendi-bg/6.png" class="mehendi-layer layer-foliage-right" alt="" />
        <canvas id="mehendi-particles-canvas" class="mehendi-particles-layer"></canvas>
        <img src="/mehendi-bg/5.png" class="mehendi-layer layer-canopy-left" alt="" />
        <img src="/mehendi-bg/4.png" class="mehendi-layer layer-canopy-right" alt="" />
        <img src="/mehendi-bg/3.png" class="mehendi-layer layer-canopy-center" alt="" />
        <img src="/mehendi-bg/8.png" class="mehendi-layer layer-fg-grass" alt="" />
        <img src="/mehendi-bg/9.png" class="mehendi-layer layer-floor-mandala" alt="" />
      `;
      sectionEl.appendChild(bgScene);
    }

    // Section Badge Header
    if (func.badge) {
      const badgeEl = document.createElement("div");
      badgeEl.classList.add("function-badge");
      badgeEl.textContent = func.badge;
      sectionEl.appendChild(badgeEl);
    }

    // Split function images: 1 image on top, centered invitation card, remaining images below
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

      imgWrapper.appendChild(img);
      imageItem.appendChild(imgWrapper);

      globalImageIndex++;
      return imageItem;
    };

    // Render Top Image
    topImages.forEach((imgNum) => {
      sectionEl.appendChild(createImageItem(imgNum));
    });

    // Render Centered Invitation Text Card for this Function
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

    // Render Bottom Images
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

  imageItems.forEach((imageItem) => {
    const idx = parseInt(imageItem.dataset.globalIndex || "0", 10);
    const normalizedIndex = idx / (16 - 1);
    const imgWrapper = imageItem.querySelector(".spotlight-img-wrapper");

    ScrollTrigger.create({
      trigger: imageItem,
      start: "top bottom",
      end: "bottom top",
      onUpdate: ({ progress }) => {
        const { base, flow, detail } = CONFIG.waves;
        const vw = window.innerWidth;

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
          const wrapperWidth = imgWrapper.offsetWidth;
          const translateX =
            (vw - wrapperWidth) / 2 -
            vw * 0.05 +
            baseWave * vw * base.amp +
            flowWave * vw * flow.amp +
            detailWave * vw * detail.amp;

          const centerOffset = Math.abs(progress - 0.5) * 2;
          const clipAmount =
            Math.pow(centerOffset, CONFIG.clipPower) * CONFIG.clipMax;

          imgWrapper.style.translate = `${translateX}px`;
          imgWrapper.style.clipPath = `inset(0 ${clipAmount}% 0 ${clipAmount}%)`;
        }
      },
    });
  });

  window.addEventListener("resize", () => {
    updateImageSizes();
    ScrollTrigger.refresh();
  });

  // --- HALDI SCENE ORGANIC WIND & 3D PARALLAX ANIMATION ---
  const haldiSection = document.querySelector("#haldi");
  if (haldiSection) {
    // 1. CONTINUOUS IDLE BREEZE (BRANCHES & LEAVES SWAYING IN THE WIND)
    gsap.to("#haldi .layer-branch-left", {
      rotation: 3,
      xPercent: 2,
      duration: 3.5,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    gsap.to("#haldi .layer-branch-right", {
      rotation: -3.5,
      xPercent: -2.5,
      duration: 4.2,
      delay: 0.3,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    gsap.to("#haldi .layer-tree-left", {
      rotation: 1.8,
      xPercent: 1,
      duration: 5,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    gsap.to("#haldi .layer-leaves-left", {
      rotation: -2.5,
      scale: 1.02,
      duration: 3.8,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    gsap.to("#haldi .layer-leaves-right", {
      rotation: 2.8,
      scale: 1.02,
      duration: 4.5,
      delay: 0.4,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    // 2. SCROLL-DRIVEN MOTION (LOCKED IN POSITION WITH ORGANIC ROTATION & FRAMING)
    // Base Scenic Background: Subtle scale zoom inside container
    gsap.to("#haldi .layer-base", {
      scale: 1.05,
      ease: "none",
      scrollTrigger: {
        trigger: haldiSection,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    // Midground Lemon Tree: Organic tilt & sway
    gsap.to("#haldi .layer-tree-left", {
      rotation: -3,
      xPercent: -2,
      ease: "none",
      scrollTrigger: {
        trigger: haldiSection,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    // Golden Archway: Subtle focal framing
    gsap.to("#haldi .layer-arch", {
      scale: 1.03,
      ease: "none",
      scrollTrigger: {
        trigger: haldiSection,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    // Top Left Branch: Locked at top, organic wind tilt on scroll
    gsap.to("#haldi .layer-branch-left", {
      rotation: 5,
      xPercent: 3,
      ease: "none",
      scrollTrigger: {
        trigger: haldiSection,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    // Top Right Branch: Locked at top, organic wind tilt on scroll
    gsap.to("#haldi .layer-branch-right", {
      rotation: -6,
      xPercent: -3,
      ease: "none",
      scrollTrigger: {
        trigger: haldiSection,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    // Bottom Left Leaves: Locked at bottom, opens outward on scroll
    gsap.to("#haldi .layer-leaves-left", {
      rotation: -4,
      xPercent: -3,
      ease: "none",
      scrollTrigger: {
        trigger: haldiSection,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    // Bottom Right Leaves: Locked at bottom, opens outward on scroll
    gsap.to("#haldi .layer-leaves-right", {
      rotation: 4,
      xPercent: 3,
      ease: "none",
      scrollTrigger: {
        trigger: haldiSection,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    // Haldi Bowl & Mandala Rug: Grounded in position
    gsap.to("#haldi .layer-haldi-bowl", {
      scale: 1.03,
      ease: "none",
      scrollTrigger: {
        trigger: haldiSection,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    // 3. INVITATION CARD WEIGHTLESS FLOAT & ENTRANCE
    gsap.fromTo(
      "#haldi .spotlight-text.invitation-card",
      { y: 35, opacity: 0.85, scale: 0.96 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: haldiSection,
          start: "top 80%",
          end: "top 35%",
          scrub: 1,
        },
      },
    );

    gsap.to("#haldi .spotlight-text.invitation-card", {
      y: -6,
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    // 4. FLOATING GOLDEN TURMERIC DUST & MARIGOLD PETALS PARTICLES
    const canvas = document.getElementById("haldi-particles-canvas");
    if (canvas) {
      const ctx = canvas.getContext("2d");
      let width = (canvas.width = haldiSection.offsetWidth);
      let height = (canvas.height = haldiSection.offsetHeight);

      const updateCanvasSize = () => {
        if (canvas && haldiSection) {
          width = canvas.width = haldiSection.offsetWidth;
          height = canvas.height = haldiSection.offsetHeight;
        }
      };
      window.addEventListener("resize", updateCanvasSize);

      const particles = [];
      const particleCount = 28;

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2.2 + 0.8,
          color: Math.random() > 0.4 ? "rgba(255, 215, 0, " : "rgba(245, 185, 50, ",
          alpha: Math.random() * 0.55 + 0.25,
          speedY: -(Math.random() * 0.5 + 0.2),
          speedX: Math.random() * 0.4 - 0.2,
          oscillationSpeed: Math.random() * 0.03 + 0.01,
          angle: Math.random() * Math.PI * 2,
        });
      }

      function renderParticles() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach((p) => {
          p.angle += p.oscillationSpeed;
          p.x += Math.sin(p.angle) * 0.35 + p.speedX;
          p.y += p.speedY;

          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color + p.alpha + ")";
          ctx.shadowBlur = 6;
          ctx.shadowColor = "rgba(255, 215, 0, 0.7)";
          ctx.fill();
        });
        requestAnimationFrame(renderParticles);
      }
      renderParticles();
    }
  }

  // --- MEHENDI SCENE ORGANIC WIND & 3D PARALLAX ANIMATION ---
  const mehendiSection = document.querySelector("#mehendi");
  if (mehendiSection) {
    // 1. CONTINUOUS IDLE BREEZE (LEAVES & CANOPY SWAYING IN THE WIND)
    gsap.to("#mehendi .layer-canopy-left", {
      rotation: 3.2,
      xPercent: 2.2,
      duration: 3.6,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    gsap.to("#mehendi .layer-canopy-right", {
      rotation: -3.6,
      xPercent: -2.5,
      duration: 4.3,
      delay: 0.2,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    gsap.to("#mehendi .layer-canopy-center", {
      scale: 1.02,
      yPercent: 1.5,
      duration: 3.8,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    gsap.to("#mehendi .layer-flowers-left", {
      rotation: -2.2,
      xPercent: -1.2,
      duration: 4.8,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    gsap.to("#mehendi .layer-foliage-right", {
      rotation: 2.5,
      xPercent: 1.5,
      duration: 4.4,
      delay: 0.3,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    // 2. SCROLL-DRIVEN MOTION (LOCKED IN POSITION WITH ORGANIC ROTATION & FRAMING)
    // Base Scenic Background: Subtle scale zoom inside container
    gsap.to("#mehendi .layer-base", {
      scale: 1.05,
      ease: "none",
      scrollTrigger: {
        trigger: mehendiSection,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    // Green Marble Gazebo Mandap: Subtle focal framing
    gsap.to("#mehendi .layer-gazebo", {
      scale: 1.03,
      ease: "none",
      scrollTrigger: {
        trigger: mehendiSection,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    // Pink Flowering Bush Left: Opens outward on scroll
    gsap.to("#mehendi .layer-flowers-left", {
      rotation: -4,
      xPercent: -3,
      ease: "none",
      scrollTrigger: {
        trigger: mehendiSection,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    // Tropical Foliage Right: Opens outward on scroll
    gsap.to("#mehendi .layer-foliage-right", {
      rotation: 4,
      xPercent: 3,
      ease: "none",
      scrollTrigger: {
        trigger: mehendiSection,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    // Top Left Banana Canopy: Tilts inward on scroll
    gsap.to("#mehendi .layer-canopy-left", {
      rotation: 5,
      xPercent: 3,
      ease: "none",
      scrollTrigger: {
        trigger: mehendiSection,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    // Top Right Palm Canopy: Tilts inward on scroll
    gsap.to("#mehendi .layer-canopy-right", {
      rotation: -6,
      xPercent: -3,
      ease: "none",
      scrollTrigger: {
        trigger: mehendiSection,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    // Henna Floor Mandala Rug: Grounded foreground presentation
    gsap.to("#mehendi .layer-floor-mandala", {
      scale: 1.03,
      ease: "none",
      scrollTrigger: {
        trigger: mehendiSection,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    // 3. INVITATION CARD WEIGHTLESS FLOAT & ENTRANCE
    gsap.fromTo(
      "#mehendi .spotlight-text.invitation-card",
      { y: 35, opacity: 0.85, scale: 0.96 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: mehendiSection,
          start: "top 80%",
          end: "top 35%",
          scrub: 1,
        },
      },
    );

    gsap.to("#mehendi .spotlight-text.invitation-card", {
      y: -6,
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    // 4. FLOATING HENNA LEAVES & GOLDEN SPARKLES PARTICLES
    const mCanvas = document.getElementById("mehendi-particles-canvas");
    if (mCanvas) {
      const ctx = mCanvas.getContext("2d");
      let width = (mCanvas.width = mehendiSection.offsetWidth);
      let height = (mCanvas.height = mehendiSection.offsetHeight);

      const updateCanvasSize = () => {
        if (mCanvas && mehendiSection) {
          width = mCanvas.width = mehendiSection.offsetWidth;
          height = mCanvas.height = mehendiSection.offsetHeight;
        }
      };
      window.addEventListener("resize", updateCanvasSize);

      const particles = [];
      const particleCount = 26;

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2.5 + 0.8,
          color: Math.random() > 0.4 ? "rgba(160, 225, 140, " : "rgba(235, 215, 110, ",
          alpha: Math.random() * 0.55 + 0.25,
          speedY: -(Math.random() * 0.45 + 0.2),
          speedX: Math.random() * 0.4 - 0.2,
          oscillationSpeed: Math.random() * 0.03 + 0.01,
          angle: Math.random() * Math.PI * 2,
        });
      }

      function renderMehendiParticles() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach((p) => {
          p.angle += p.oscillationSpeed;
          p.x += Math.sin(p.angle) * 0.35 + p.speedX;
          p.y += p.speedY;

          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color + p.alpha + ")";
          ctx.shadowBlur = 6;
          ctx.shadowColor = "rgba(160, 225, 140, 0.7)";
          ctx.fill();
        });
        requestAnimationFrame(renderMehendiParticles);
      }
      renderMehendiParticles();
    }
  }
}

