import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { CustomEase } from "gsap/all";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(CustomEase, SplitText, ScrollTrigger);

// Initialize Lenis Smooth Scroll
const lenis = new Lenis();
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

// --- SCROLL WAVE IMAGE GALLERY (SECOND SITE) ---
const WEDDING_DATA = {
  1: {
    tag: "01 / HALDI CEREMONY",
    title: "Bright Yellows & Blessings",
    desc: "Turmeric rituals, laughter, and warm auspicious blessings with loved ones.",
  },
  4: {
    tag: "02 / MEHENDI NIGHT",
    title: "Henna, Beats & Color",
    desc: "Intricate henna art on hands, festive music, live dhol, and vibrant colors.",
  },
  7: {
    tag: "03 / SANGEET NIGHT",
    title: "Music, Dance & Glitz",
    desc: "High-energy family dance performances, glam, and celebration under the lights.",
  },
  10: {
    tag: "04 / WEDDING CEREMONY",
    title: "The Sacred Pheras",
    desc: "Exchanging eternal vows around the holy fire as two families unite in love.",
  },
  13: {
    tag: "05 / GRAND RECEPTION",
    title: "Gala, Dinner & Toast",
    desc: "A lavish evening of fine dining, celebratory toasts, and dancing under the stars.",
  },
};

const CONFIG = {
  waves: {
    base: { amp: 0.1, freq: 1.0, speed: 1.0, phase: 5.0 },
    flow: { amp: 0.15, freq: 5.0, speed: 5.0, phase: 10.0 },
    detail: { amp: 0.025, freq: 5.0, speed: 1.5, phase: 2.5 },
  },
  clipMax: 20,
  clipPower: 2,
};

const TOTAL_IMAGES = 16;
const IMAGE_BASE_HEIGHT = 375;
const ASPECT_RATIOS = ["3/2", "4/3", "5/4", "7/5"];

const spotlightImagesContainer = document.querySelector(".spotlight-images");

if (spotlightImagesContainer) {
  for (let i = 0; i < TOTAL_IMAGES; i++) {
    const imageItem = document.createElement("div");
    imageItem.classList.add("spotlight-image");
    if (i % 2 === 1) {
      imageItem.classList.add("reverse");
    }

    const shrinkStartIndex = Math.floor(TOTAL_IMAGES * 0.75);
    const shrinkFactor =
      i >= shrinkStartIndex
        ? (i - shrinkStartIndex + 1) / (TOTAL_IMAGES - shrinkStartIndex)
        : 0;

    const imageHeight = IMAGE_BASE_HEIGHT * (1 - shrinkFactor * 0.5);
    imageItem.style.height = `${Math.round(imageHeight)}px`;

    // Image wrapper
    const imgWrapper = document.createElement("div");
    imgWrapper.classList.add("spotlight-img-wrapper");
    imgWrapper.style.aspectRatio = ASPECT_RATIOS[i % ASPECT_RATIOS.length];

    const imgNumber = (i % 12) + 1;
    const img = document.createElement("img");
    img.src = `/gallery/img${imgNumber}.jpg`;
    img.alt = WEDDING_DATA[i] ? WEDDING_DATA[i].title : `Wedding Gallery Photo ${i + 1}`;

    imgWrapper.appendChild(img);
    imageItem.appendChild(imgWrapper);

    // Text card: Only on 2nd image (index 1) and every 3rd image thereafter (indices 1, 4, 7, 10, 13)
    const showText = (i - 1) % 3 === 0;
    if (showText && WEDDING_DATA[i]) {
      const textDiv = document.createElement("div");
      textDiv.classList.add("spotlight-text");

      const info = WEDDING_DATA[i];
      textDiv.innerHTML = `
        <span class="chapter-number">${info.tag}</span>
        <h3 class="chapter-title">${info.title}</h3>
        <p class="chapter-desc">${info.desc}</p>
      `;

      imageItem.appendChild(textDiv);
    }

    spotlightImagesContainer.appendChild(imageItem);
  }

  const imageItems = gsap.utils.toArray(".spotlight-image");

  function updateImageSizes() {
    const sizeFactor = Math.min(window.innerWidth / 750, 1);

    imageItems.forEach((imageItem, i) => {
      const shrinkStartIndex = Math.floor(TOTAL_IMAGES * 0.75);
      const shrinkFactor =
        i >= shrinkStartIndex
          ? (i - shrinkStartIndex + 1) / (TOTAL_IMAGES - shrinkStartIndex)
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

  imageItems.forEach((imageItem, index) => {
    const normalizedIndex = index / (TOTAL_IMAGES - 1);
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

        const translateX =
          (vw - imageItem.offsetWidth) / 2 -
          vw * 0.05 +
          baseWave * vw * base.amp +
          flowWave * vw * flow.amp +
          detailWave * vw * detail.amp;

        const centerOffset = Math.abs(progress - 0.5) * 2;

        const clipAmount =
          Math.pow(centerOffset, CONFIG.clipPower) * CONFIG.clipMax;

        imageItem.style.translate = `${translateX}px`;
        if (imgWrapper) {
          imgWrapper.style.clipPath = `inset(0 ${clipAmount}% 0 ${clipAmount}%)`;
        }
      },
    });
  });

  window.addEventListener("resize", () => {
    updateImageSizes();
    ScrollTrigger.refresh();
  });
}

