'use strict';



/**
 * PRELOAD
 * 
 * loading will be end after document is loaded
 */

const preloader = document.querySelector("[data-preaload]");

window.addEventListener("load", function () {
  preloader.classList.add("loaded");
  document.body.classList.add("loaded");
});



/**
 * add event listener on multiple elements
 */

const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}



/**
 * NAVBAR
 */

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("nav-active");
}

addEventOnElements(navTogglers, "click", toggleNavbar);



/**
 * HEADER & BACK TOP BTN
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

let lastScrollPos = 0;

const hideHeader = function () {
  const isScrollBottom = lastScrollPos < window.scrollY;
  if (isScrollBottom) {
    header.classList.add("hide");
  } else {
    header.classList.remove("hide");
  }

  lastScrollPos = window.scrollY;
}

window.addEventListener("scroll", function () {
  if (window.scrollY >= 50) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
    hideHeader();
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});



/**
 * HERO SLIDER
 */

const heroSlider = document.querySelector("[data-hero-slider]");
const heroSliderItems = document.querySelectorAll("[data-hero-slider-item]");
const heroSliderPrevBtn = document.querySelector("[data-prev-btn]");
const heroSliderNextBtn = document.querySelector("[data-next-btn]");

let currentSlidePos = 0;
let lastActiveSliderItem = heroSliderItems[0];

const updateSliderPos = function () {
  lastActiveSliderItem.classList.remove("active");
  heroSliderItems[currentSlidePos].classList.add("active");
  lastActiveSliderItem = heroSliderItems[currentSlidePos];
}

const slideNext = function () {
  if (currentSlidePos >= heroSliderItems.length - 1) {
    currentSlidePos = 0;
  } else {
    currentSlidePos++;
  }

  updateSliderPos();
}

heroSliderNextBtn.addEventListener("click", slideNext);

const slidePrev = function () {
  if (currentSlidePos <= 0) {
    currentSlidePos = heroSliderItems.length - 1;
  } else {
    currentSlidePos--;
  }

  updateSliderPos();
}

heroSliderPrevBtn.addEventListener("click", slidePrev);

/**
 * auto slide
 */

let autoSlideInterval;

const autoSlide = function () {
  autoSlideInterval = setInterval(function () {
    slideNext();
  }, 7000);
}

addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseover", function () {
  clearInterval(autoSlideInterval);
});

addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseout", autoSlide);

window.addEventListener("load", autoSlide);



/**
 * PARALLAX EFFECT
 */

const parallaxItems = document.querySelectorAll("[data-parallax-item]");

let x, y;

window.addEventListener("mousemove", function (event) {

  x = (event.clientX / window.innerWidth * 10) - 5;
  y = (event.clientY / window.innerHeight * 10) - 5;

  // reverse the number eg. 20 -> -20, -5 -> 5
  x = x - (x * 2);
  y = y - (y * 2);

  for (let i = 0, len = parallaxItems.length; i < len; i++) {
    x = x * Number(parallaxItems[i].dataset.parallaxSpeed);
    y = y * Number(parallaxItems[i].dataset.parallaxSpeed);
    parallaxItems[i].style.transform = `translate3d(${x}px, ${y}px, 0px)`;
  }

});


/*
  Easter popup: show once per session when scrolled down 100px
*/
const easterOverlay = document.querySelector('.easter-popup-overlay');
const easterCloseBtn = document.querySelector('.easter-popup-close');
const EASTER_KEY = 'easterShown';

// detect whether a storage type is available (may be blocked on some devices)
function storageAvailable(type) {
  try {
    var storage = window[type];
    var x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return false;
  }
}

if (easterOverlay && easterCloseBtn) {
  // choose sessionStorage if available, else localStorage, else fallback to in-memory
  let storage = null;
  if (storageAvailable('sessionStorage')) {
    storage = sessionStorage;
  } else if (storageAvailable('localStorage')) {
    storage = localStorage;
  }

  let inMemoryShown = false; // fallback when storage is unavailable

  const isAlreadyShown = () => {
    if (storage) {
      try { return storage.getItem(EASTER_KEY) === '1'; } catch (e) { return false; }
    }
    return inMemoryShown === true;
  };

  const markShown = () => {
    if (storage) {
      try { storage.setItem(EASTER_KEY, '1'); } catch (e) { /* ignore */ }
    } else {
      inMemoryShown = true;
    }
  };

  const showPopup = () => {
    // if already shown in this session (or via fallback), don't show again
    if (isAlreadyShown()) return;

    if (window.scrollY >= 100) {
      easterOverlay.classList.add('active');
      easterOverlay.setAttribute('aria-hidden', 'false');
      markShown();
    }
  };

  // run on scroll and on load (in case user loads page already scrolled)
  window.addEventListener('scroll', showPopup, { passive: true });
  window.addEventListener('load', showPopup);

  // allow user to close manually
  easterCloseBtn.addEventListener('click', function (e) {
    easterOverlay.classList.remove('active');
    easterOverlay.setAttribute('aria-hidden', 'true');
  });

  // clicking overlay (outside popup) closes it
  easterOverlay.addEventListener('click', function (e) {
    if (e.target === easterOverlay) {
      easterOverlay.classList.remove('active');
      easterOverlay.setAttribute('aria-hidden', 'true');
    }
  });
}