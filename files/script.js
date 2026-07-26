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
    badge: "",
    title: "Sangeet",
    tagline: "A playful night of sangeet and cultural festivities",
    day: "WED",
    date: "June 4 2026",
    time: "07:30 PM onwards",
    venue: "Uttar Garden Lawn",
    dressSub: "Embracing the charm of Gujarati heritage",
    dressDetail: "Bandhani, Patola, Leheriya or Kutchi Mirrorwork",
    images: [],
  },
  {
    id: "wedding",
    badge: "",
    title: "Wedding",
    tagline: "A sacred union under divine blessings & holy fire",
    day: "THU",
    date: "June 5 2026",
    time: "05:00 PM onwards",
    venue: "The Royal Palace Mandap",
    dressSub: "Traditional Royal Elegance",
    dressDetail: "Classic Sherwanis, Kanjeevarams or Regal Silks",
    images: [],
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

    // Inject Sangeet Scenic Layered Background for Sangeet Section
    if (func.id === "sangeet") {
      const bgScene = document.createElement("div");
      bgScene.classList.add("sangeet-scene-bg");
      bgScene.innerHTML = `
        <img src="/sangeet-bg/2.png" class="sangeet-layer layer-base" alt="" />
        <div class="sangeet-sunbeam"></div>
        <img src="/sangeet-bg/10.png" class="sangeet-layer layer-gazebo" alt="" />
        <img src="/sangeet-bg/8.png" class="sangeet-layer layer-trees-left" alt="" />
        <img src="/sangeet-bg/9.png" class="sangeet-layer layer-trees-right" alt="" />
        <img src="/sangeet-bg/7.png" class="sangeet-layer layer-stage-arch" alt="" />
        <img src="/sangeet-bg/4.png" class="sangeet-layer layer-stage-cushions" alt="" />
        <canvas id="sangeet-particles-canvas" class="sangeet-particles-layer"></canvas>
        <img src="/sangeet-bg/11.png" class="sangeet-layer layer-hanging-canopy" alt="" />
        <img src="/sangeet-bg/6.png" class="sangeet-layer layer-sitar" alt="" />
        <img src="/sangeet-bg/3.png" class="sangeet-layer layer-tabla" alt="" />
        <img src="/sangeet-bg/5.png" class="sangeet-layer layer-mic" alt="" />
      `;
      sectionEl.appendChild(bgScene);
    }

    // Inject Wedding Scenic Layered Background for Wedding Section
    if (func.id === "wedding") {
      const bgScene = document.createElement("div");
      bgScene.classList.add("wedding-scene-bg");
      bgScene.innerHTML = `
        <img src="/wedding-bg/2.png" class="wedding-layer layer-base" alt="" />
        <div class="wedding-sunbeam"></div>
        <img src="/wedding-bg/10.png" class="wedding-layer layer-mandap-platform" alt="" />
        <img src="/wedding-bg/7.png" class="wedding-layer layer-mandap-arch" alt="" />
        <img src="/wedding-bg/8.png" class="wedding-layer layer-parasol-right" alt="" />
        <img src="/wedding-bg/5.png" class="wedding-layer layer-banana-leaves" alt="" />
        <canvas id="wedding-particles-canvas" class="wedding-particles-layer"></canvas>
        <img src="/wedding-bg/3.png" class="wedding-layer layer-canopy-left" alt="" />
        <img src="/wedding-bg/9.png" class="wedding-layer layer-canopy-right" alt="" />
        <img src="/wedding-bg/6.png" class="wedding-layer layer-flowers-left" alt="" />
        <img src="/wedding-bg/11.png" class="wedding-layer layer-fg-flowers" alt="" />
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

  // --- SANGEET SCENE ORGANIC WIND & 3D PARALLAX ANIMATION ---
  const sangeetSection = document.querySelector("#sangeet");
  if (sangeetSection) {
    // 1. CONTINUOUS IDLE BREEZE (LANTERNS, CANOPY & INSTRUMENTS SWAYING IN THE WIND)
    gsap.to("#sangeet .layer-hanging-canopy", {
      rotation: 2.8,
      xPercent: 1.8,
      duration: 3.8,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    gsap.to("#sangeet .layer-sitar", {
      rotation: 1.5,
      xPercent: 1.0,
      duration: 4.5,
      delay: 0.2,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    gsap.to("#sangeet .layer-trees-left", {
      rotation: -1.8,
      xPercent: -1.2,
      duration: 4.8,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    gsap.to("#sangeet .layer-trees-right", {
      rotation: 2.2,
      xPercent: 1.4,
      duration: 4.2,
      delay: 0.3,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    // 2. SCROLL-DRIVEN MOTION (LOCKED IN POSITION WITH ORGANIC ROTATION & FRAMING)
    // Base Scenic Background: Subtle scale zoom inside container
    gsap.to("#sangeet .layer-base", {
      scale: 1.05,
      ease: "none",
      scrollTrigger: {
        trigger: sangeetSection,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    // Sangeet Stage & Pink Floral Arch: Subtle focal framing
    gsap.to("#sangeet .layer-stage-arch", {
      scale: 1.03,
      ease: "none",
      scrollTrigger: {
        trigger: sangeetSection,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    // Top Hanging Canopy & Lanterns: Tilts inward on scroll
    gsap.to("#sangeet .layer-hanging-canopy", {
      rotation: -5,
      xPercent: -3,
      ease: "none",
      scrollTrigger: {
        trigger: sangeetSection,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    // Sitar Instrument: Grounded foreground presentation
    gsap.to("#sangeet .layer-sitar", {
      rotation: 3,
      xPercent: 2,
      ease: "none",
      scrollTrigger: {
        trigger: sangeetSection,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    // Tabla Drums: Grounded foreground presentation
    gsap.to("#sangeet .layer-tabla", {
      scale: 1.03,
      ease: "none",
      scrollTrigger: {
        trigger: sangeetSection,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    // 3. INVITATION CARD WEIGHTLESS FLOAT & ENTRANCE
    gsap.fromTo(
      "#sangeet .spotlight-text.invitation-card",
      { y: 35, opacity: 0.85, scale: 0.96 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sangeetSection,
          start: "top 80%",
          end: "top 35%",
          scrub: 1,
        },
      },
    );

    gsap.to("#sangeet .spotlight-text.invitation-card", {
      y: -6,
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    // 4. FLOATING MUSICAL SPARKLE & GOLDEN TWILIGHT DUST PARTICLES
    const sCanvas = document.getElementById("sangeet-particles-canvas");
    if (sCanvas) {
      const ctx = sCanvas.getContext("2d");
      let width = (sCanvas.width = sangeetSection.offsetWidth);
      let height = (sCanvas.height = sangeetSection.offsetHeight);

      const updateCanvasSize = () => {
        if (sCanvas && sangeetSection) {
          width = sCanvas.width = sangeetSection.offsetWidth;
          height = sCanvas.height = sangeetSection.offsetHeight;
        }
      };
      window.addEventListener("resize", updateCanvasSize);

      const particles = [];
      const particleCount = 28;

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2.5 + 0.8,
          color: Math.random() > 0.4 ? "rgba(255, 215, 120, " : "rgba(245, 175, 95, ",
          alpha: Math.random() * 0.55 + 0.25,
          speedY: -(Math.random() * 0.45 + 0.2),
          speedX: Math.random() * 0.4 - 0.2,
          oscillationSpeed: Math.random() * 0.03 + 0.01,
          angle: Math.random() * Math.PI * 2,
        });
      }

      function renderSangeetParticles() {
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
          ctx.shadowColor = "rgba(255, 215, 120, 0.7)";
          ctx.fill();
        });
        requestAnimationFrame(renderSangeetParticles);
      }
      renderSangeetParticles();
    }
  }

  // --- WEDDING SCENE ORGANIC WIND & 3D PARALLAX ANIMATION ---
  const weddingSection = document.querySelector("#wedding");
  if (weddingSection) {
    // 1. CONTINUOUS IDLE BREEZE (TEMPLE BELLS, CANOPY & FLORAL PARASOL SWAYING IN THE WIND)
    gsap.to("#wedding .layer-canopy-left", {
      rotation: 2.5,
      xPercent: 1.5,
      duration: 3.8,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    gsap.to("#wedding .layer-canopy-right", {
      rotation: -2.8,
      xPercent: -1.8,
      duration: 4.2,
      delay: 0.2,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    gsap.to("#wedding .layer-parasol-right", {
      rotation: -1.8,
      xPercent: -1.2,
      duration: 4.5,
      delay: 0.3,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    gsap.to("#wedding .layer-banana-leaves", {
      rotation: 2.2,
      xPercent: 1.5,
      duration: 4.0,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    // 2. SCROLL-DRIVEN MOTION (LOCKED IN POSITION WITH ORGANIC ROTATION & FRAMING)
    // Base Scenic Background: Subtle scale zoom inside container
    gsap.to("#wedding .layer-base", {
      scale: 1.05,
      ease: "none",
      scrollTrigger: {
        trigger: weddingSection,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    // Carved Marble Mandap Arch: Subtle focal framing
    gsap.to("#wedding .layer-mandap-arch", {
      scale: 1.03,
      ease: "none",
      scrollTrigger: {
        trigger: weddingSection,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    // Mandap Altar Platform: Grounded foreground presentation
    gsap.to("#wedding .layer-mandap-platform", {
      scale: 1.02,
      ease: "none",
      scrollTrigger: {
        trigger: weddingSection,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    // Top Left Branch with Temple Bells: Tilts inward on scroll
    gsap.to("#wedding .layer-canopy-left", {
      rotation: 4,
      xPercent: 2.5,
      ease: "none",
      scrollTrigger: {
        trigger: weddingSection,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    // Top Right Crimson Royal Umbrella: Tilts inward on scroll
    gsap.to("#wedding .layer-canopy-right", {
      rotation: -4,
      xPercent: -2.5,
      ease: "none",
      scrollTrigger: {
        trigger: weddingSection,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    // Foreground Marigold Garlands: Grounded foreground presentation
    gsap.to("#wedding .layer-fg-flowers", {
      scale: 1.03,
      ease: "none",
      scrollTrigger: {
        trigger: weddingSection,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    // 3. INVITATION CARD WEIGHTLESS FLOAT & ENTRANCE
    gsap.fromTo(
      "#wedding .spotlight-text.invitation-card",
      { y: 35, opacity: 0.85, scale: 0.96 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: weddingSection,
          start: "top 80%",
          end: "top 35%",
          scrub: 1,
        },
      },
    );

    gsap.to("#wedding .spotlight-text.invitation-card", {
      y: -6,
      duration: 3,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    });

    // 4. FLOATING SACRED RICE & ROSE PETAL PARTICLES
    const wCanvas = document.getElementById("wedding-particles-canvas");
    if (wCanvas) {
      const ctx = wCanvas.getContext("2d");
      let width = (wCanvas.width = weddingSection.offsetWidth);
      let height = (wCanvas.height = weddingSection.offsetHeight);

      const updateCanvasSize = () => {
        if (wCanvas && weddingSection) {
          width = wCanvas.width = weddingSection.offsetWidth;
          height = wCanvas.height = weddingSection.offsetHeight;
        }
      };
      window.addEventListener("resize", updateCanvasSize);

      const particles = [];
      const particleCount = 28;

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2.5 + 0.8,
          color: Math.random() > 0.4 ? "rgba(240, 160, 140, " : "rgba(255, 215, 120, ",
          alpha: Math.random() * 0.55 + 0.25,
          speedY: -(Math.random() * 0.45 + 0.2),
          speedX: Math.random() * 0.4 - 0.2,
          oscillationSpeed: Math.random() * 0.03 + 0.01,
          angle: Math.random() * Math.PI * 2,
        });
      }

      function renderWeddingParticles() {
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
          ctx.shadowColor = "rgba(240, 160, 140, 0.7)";
          ctx.fill();
        });
        requestAnimationFrame(renderWeddingParticles);
      }
      renderWeddingParticles();
    }
  }

  // --- SECTION VIEW TRANSITIONS & REVEAL ANIMATIONS (from pagetransition) ---
  function setupSectionTransitions() {
    const sections = document.querySelectorAll(".function-section");

    sections.forEach((section) => {
      // Scroll-driven section clip-path wipe (move-in keyframe from pagetransition)
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
            scrub: 0.8,
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
        splitText(cardTitle, "chars", "char");
        gsap.fromTo(
          cardTitle.querySelectorAll(".char"),
          { y: "150%" },
          {
            y: "0%",
            duration: 1,
            stagger: 0.035,
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
        splitText(cardTagline, "words", "word");
        gsap.fromTo(
          cardTagline.querySelectorAll(".word"),
          { y: "120%" },
          {
            y: "0%",
            duration: 0.9,
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

      if (badge) {
        gsap.fromTo(
          badge,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
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
            duration: 0.8,
            stagger: 0.05,
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

    // Intro & Outro Section Wipe & Text Animations
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
            scrub: 0.8,
          },
        }
      );

      const introH1 = introSection.querySelector("h1");
      if (introH1) {
        splitText(introH1, "chars", "char");
        gsap.fromTo(
          introH1.querySelectorAll(".char"),
          { y: "150%" },
          {
            y: "0%",
            duration: 1,
            stagger: 0.04,
            ease: "power4.out",
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
            scrub: 0.8,
          },
        }
      );

      const outroH1 = outroSection.querySelector("h1");
      if (outroH1) {
        splitText(outroH1, "chars", "char");
        gsap.fromTo(
          outroH1.querySelectorAll(".char"),
          { y: "150%" },
          {
            y: "0%",
            duration: 1,
            stagger: 0.04,
            ease: "power4.out",
            scrollTrigger: {
              trigger: ".outro",
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }

    let transitionStoryCounter = 0;

    // Function to trigger full-screen wipe transition curtain (displaying transitionstory 1.png to 6.png in numerical order)
    const triggerWipeOverlay = (onMidpoint, storyNum = 1) => {
      const wipeEl = document.querySelector(".page-transition-wipe");
      const storyImgEl = document.querySelector(".wipe-story-img");
      if (!wipeEl) {
        if (onMidpoint) onMidpoint();
        return;
      }

      // Format numerical image index (1.png to 6.png)
      const validStoryNum = ((storyNum - 1) % 6) + 1;
      if (storyImgEl) {
        storyImgEl.src = `/transitionstory/${validStoryNum}.png`;
        gsap.set(storyImgEl, { scale: 0.7, opacity: 0 });
      }

      gsap.killTweensOf([wipeEl, storyImgEl]);
      const tl = gsap.timeline();

      // Wipe IN: clip-path expands vertically from bottom (0% 100%) to full screen (0% 0%)
      tl.fromTo(
        wipeEl,
        { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" },
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 0.5,
          ease: "power4.inOut",
          onComplete: () => {
            if (onMidpoint) onMidpoint();
          },
        }
      );

      // Animate transition story image into view
      if (storyImgEl) {
        tl.to(
          storyImgEl,
          {
            scale: 1,
            opacity: 1,
            duration: 0.35,
            ease: "power3.out",
          },
          "-=0.25"
        );
      }

      // Fade out story image before wipe curtain collapses away
      if (storyImgEl) {
        tl.to(
          storyImgEl,
          {
            scale: 1.08,
            opacity: 0,
            duration: 0.25,
            ease: "power2.in",
          },
          "+=0.15"
        );
      }

      // Wipe OUT: clip-path collapses upward out of screen (0% 0% to top)
      tl.to(
        wipeEl,
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          duration: 0.5,
          ease: "power4.inOut",
          onComplete: () => {
            gsap.set(wipeEl, {
              clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
            });
            if (storyImgEl) {
              gsap.set(storyImgEl, { scale: 0, opacity: 0 });
            }
            ScrollTrigger.refresh();
          },
        },
        "-=0.2"
      );
    };

    // --- FULL SECTION SNAP & WIPE TRANSITION CONTROLLER ---
    const allSnapSections = Array.from(
      document.querySelectorAll(".hero, .intro, .function-section, .outro")
    );

    const getElementPageTop = (el) => {
      let top = 0;
      let curr = el;
      while (curr) {
        top += curr.offsetTop;
        curr = curr.offsetParent;
      }
      return top;
    };

    let currentSectionIdx = 0;
    let isSectionTransitioning = false;
    let touchStartYPos = 0;

    const findCurrentSectionIndex = () => {
      const scrollY = window.scrollY;
      let closestIdx = 0;
      let minDistance = Infinity;

      allSnapSections.forEach((sec, idx) => {
        const secTop = getElementPageTop(sec);
        const dist = Math.abs(secTop - scrollY);
        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = idx;
        }
      });

      currentSectionIdx = closestIdx;
    };

    window.addEventListener("scroll", findCurrentSectionIndex, { passive: true });
    findCurrentSectionIndex();

    const goToSnapSection = (targetIdx, isScrollUp = false) => {
      if (
        targetIdx < 0 ||
        targetIdx >= allSnapSections.length ||
        isSectionTransitioning
      )
        return;

      isSectionTransitioning = true;
      const prevIdx = currentSectionIdx;
      currentSectionIdx = targetIdx;
      const targetSec = allSnapSections[targetIdx];
      const secTop = getElementPageTop(targetSec);
      const targetY =
        secTop + Math.max(0, (targetSec.offsetHeight - window.innerHeight) / 2);

      // Skip wipe effect if scrolling up OR traveling between Archive (idx 0) and Loose Structure (idx 1)
      const isHeroToIntro = (prevIdx === 0 && targetIdx === 1) || (prevIdx === 1 && targetIdx === 0);
      const skipWipe = isScrollUp || isHeroToIntro;

      if (skipWipe) {
        // Smooth scroll without wipe transition effect
        lenis.scrollTo(targetY, {
          duration: 1.0,
          onComplete: () => {
            isSectionTransitioning = false;
            ScrollTrigger.refresh();
          },
        });
        setTimeout(() => {
          isSectionTransitioning = false;
        }, 1050);
      } else {
        transitionStoryCounter++;
        const storyNum = targetIdx >= 2 ? targetIdx - 1 : transitionStoryCounter;

        // Wipe transition overlay with numerical story image (1.png to 6.png)
        triggerWipeOverlay(() => {
          window.scrollTo({ top: targetY, behavior: "instant" });
          lenis.scrollTo(targetY, { immediate: true });
        }, storyNum);

        setTimeout(() => {
          isSectionTransitioning = false;
        }, 1150);
      }
    };

    // Wheel Scroll Snap Intercept
    window.addEventListener(
      "wheel",
      (e) => {
        if (isSectionTransitioning) {
          e.preventDefault();
          return;
        }

        if (Math.abs(e.deltaY) > 20) {
          if (e.deltaY > 0 && currentSectionIdx < allSnapSections.length - 1) {
            e.preventDefault();
            goToSnapSection(currentSectionIdx + 1, false);
          } else if (e.deltaY < 0 && currentSectionIdx > 0) {
            e.preventDefault();
            goToSnapSection(currentSectionIdx - 1, true);
          }
        }
      },
      { passive: false }
    );

    // Touch Swipe Snap Intercept for Mobile
    window.addEventListener(
      "touchstart",
      (e) => {
        touchStartYPos = e.touches[0].clientY;
      },
      { passive: true }
    );

    window.addEventListener(
      "touchend",
      (e) => {
        if (isSectionTransitioning) return;
        const touchEndY = e.changedTouches[0].clientY;
        const diffY = touchStartYPos - touchEndY;

        if (Math.abs(diffY) > 40) {
          if (diffY > 0 && currentSectionIdx < allSnapSections.length - 1) {
            // Swiping UP (scrolling DOWN) -> Wipe Transition Effect
            goToSnapSection(currentSectionIdx + 1, false);
          } else if (diffY < 0 && currentSectionIdx > 0) {
            // Swiping DOWN (scrolling UP) -> Simply scroll up without wipe effect
            goToSnapSection(currentSectionIdx - 1, true);
          }
        }
      },
      { passive: true }
    );

    // Keyboard Arrow Snap Intercept
    window.addEventListener("keydown", (e) => {
      if (isSectionTransitioning) return;
      if (["ArrowDown", "PageDown"].includes(e.code)) {
        if (currentSectionIdx < allSnapSections.length - 1) {
          e.preventDefault();
          goToSnapSection(currentSectionIdx + 1, false);
        }
      } else if (["ArrowUp", "PageUp"].includes(e.code)) {
        if (currentSectionIdx > 0) {
          e.preventDefault();
          goToSnapSection(currentSectionIdx - 1, true);
        }
      }
    });

    // Intercept Nav Link Clicks to use goToSnapSection
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const targetId = link.getAttribute("href");
        if (!targetId || targetId === "#") return;

        const targetEl = document.querySelector(targetId);
        if (!targetEl) return;

        e.preventDefault();
        const targetIdx = allSnapSections.indexOf(targetEl);
        if (targetIdx !== -1) {
          const isScrollUp = targetIdx < currentSectionIdx;
          goToSnapSection(targetIdx, isScrollUp);
        } else {
          lenis.scrollTo(targetEl);
        }
      });
    });
  }

  setupSectionTransitions();
}

// Global HTML View Transitions Intercept (from pagetransition app.js)
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


