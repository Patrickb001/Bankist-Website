'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////

// Button scrolling:

btnScrollTo.addEventListener('click', function (e) {
  const s1cords = section1.getBoundingClientRect(); // first step is retrieve coords
  console.log(s1cords);

  console.log(e.target.getBoundingClientRect());

  console.log('Current scrool (X/Y)', window.pageXOffset, window.pageYOffset); // Y is the current viewport and its distance from the top of the page, when scrolled all the way up it will be 0

  // Modern way
  // Only works in modern browsers
  section1.scrollIntoView({
    behavior: 'smooth',
  });
});

// 1. Add event listener to common parent element:
// 2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // console.log(e.target);

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed component

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  // console.log(clicked);

  // Guard clause
  if (!clicked) return;

  // Toggle the operations tab activation
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  // Toggle content area
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Passing 'argument' into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

//////////////////////////////////////
//////////////////////////////////////
// Sticky navigation: Intersection observer API

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// Reveal sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');
console.log(imgTargets);

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // replace src w/ data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

// Slider
const sliders = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;
  const minSlide = 0;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide = 0) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    createDots();
    activateDot(0);
    goToSlide();
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    console.log(e);
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      console.log('DOT');
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
sliders();

//curSlide = 1 = -100% , s2 = 0%, s3= 100%, s4 = 200%

//////////////////////////////////////
//////////////////////////////////////

/*
// Selecting, creating and deleting elements:
// Selecting elements
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
console.log(allSections);

document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button'); // returns HTML collection
console.log(allButtons);

console.log(document.getElementsByClassName('btn')); // returns HTML collection

//Creating and inserting elements
// .insertAdjacentHTML // quick and easy way of creating elements //

const message = document.createElement('div');
message.classList.add('cookie-message');
message.textContent =
  'We use cookies for improved functionality and analytics.';
message.innerHTML =
  'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

// header.prepend(message); // prepending adds the element as the first child of the header element
header.append(message); // last child
// message is a live element in the living DOM, it cannot be two places at once
// header.append(message.cloneNode(true)); // if we wanted it in two places

// header.before(message); // inserts it before the header as a sibling element
// header.after(message);

// Delete elements
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    // message.remove();
    message.parentElement.removeChild(message); // how elements used to be removed // moving up and down the DOM tree like this is called DOM traversing
  });

////////////////////////// 

// Styles, Attributes and Classes:
//Styles
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

console.log(message.style.color); // only works for inline styles
console.log(message.style.backgroundColor);

console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

document.documentElement.style.setProperty('--color-primary', 'orangered');

// Attributes
//Reading values
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);

console.log(logo.className);

//Non-standard
console.log(logo.designer); // does not create a property on the object and will return undefined
console.log(logo.getAttribute('designer'));
logo.setAttribute('company', 'Bankist');

console.log(logo.src); // absolute URL
console.log(logo.getAttribute('src')); // Relative URL

// setting values
logo.alt = 'Beautiful minimalist logo';

const link = document.querySelector('.nav__link--btn');
console.log(link.href);
console.log(link.getAttribute('href'));

// Data attributes: must start with 'data' when being written as an attribute in the HTML file
console.log(logo.dataset.versionNumber); // in the HTML file it is written as version-number, but we need to convert it to camelCase in JS

// Classes
// Can add multiple classes by adding multiple values
logo.classList.add('c', 'j');
logo.classList.remove('c', 'j');
logo.classList.toggle('c');
logo.classList.contains('c'); // not includes

// Don't use
logo.className = 'jonas'; // another way to set classNames
// Will override all existing classes and it also only allows us to put one class on any element

*/
/*
// Implement smooth scrolling:
// Old school way of doing it
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  const s1cords = section1.getBoundingClientRect(); // first step is retrieve coords
  console.log(s1cords);

  console.log(e.target.getBoundingClientRect());

  console.log('Current scrool (X/Y)', window.pageXOffset, window.pageYOffset); // Y is the current viewport and its distance from the top of the page, when scrolled all the way up it will be 0

  // console.log(
  //   'height/width viewport',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  // Old school ways
  //Scrolling
  // window.scrollTo(
  //   s1cords.left + window.pageXOffset,
  //   s1cords.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1cords.left + window.pageXOffset,
  //   top: s1cords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // Modern way
  // Only works in modern browsers
  section1.scrollIntoView({
    behavior: 'smooth',
  });
});
*/

// Types of Events and Event Handlers:

// const h1 = document.querySelector('h1');
// const alertH1 = function (e) {
//   alert('addEventListener: Great! You are reading the heading :D');

// h1.removeEventListener('mouseenter', alertH1); // allows us to only listen for the event once
// };

// h1.addEventListener('mouseenter', alertH1);

// setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000); // removes the event after 3 seconds

// Can use the 'onevent' for each of the events
// More of an oldschool way of doing things
// h1.onmouseenter = function (e) {
//   alert('addEventListener: Great! You are reading the heading :D');
// };

/*
// Event propogation: Bubbling and Capturing:
We are looking at what happens when someone clicks a link
DOM tree:
Document -> Element(<html>) -> Element(<body>) -> Element(<section>) -> Element(<p>) -> Element(<a>)
HTML file example:
<html>
  <head>
    <title>A Simple Page</title>
  </head>
  <body>
    <section>
    <p>A paragraph with a <a>link</a></p>
    <p>A second paragraph</p>
    </section>
    <section>
      <img src="dom.png" alt="The DOM" />
    </section>
  </body>
</html>

When the link(Element(<a>)) is clicked the DOM generates a click event right away. This event will not be generated at the target element(Element(<a>)) , i.e. where the event happened(click on the anchor element). This is event is instead generated at the root of the document(Document), from here the Capturing phase happens. The event travels all the way down from the document root to the target element. As the event travels down the tree it will pass through every single parent element of the target element until it reaches the target. The Target phase begins whenever the event reaches the target, here events can be handled right at the target with tools such as addEventListener. Event listeners wait on a certain event to happen on a certain element and as soon as the event occurs it runs the attached callback function. After reaching the target, the event travels all the way up to the document root again in the Bubbling phase. We say that events bubble up from the target to the document route, and the event again passes through all of its parent elements(but not through any sibling elements). Explaining it in all this detail allows us to also see that it is as if the event also happened in each of the parent elements. What this means is that if we attach the same event listener, also for example to the section element(Element(<section)) then we would get the exact same alert window for the section element as well, so we would have handled the exact same event twice, once at its target element and once at one of its parent element. This behavior allows us to implement really powerful patterns. By default events can only be handled in the target and the bubbling phase, however we can set up event listeners in a way that they listen to events in the capturing phase instead. Not all types of events have a capturing and bubbling phase, some of them are created right on the target element, so we can only handle them there. We can also say some events propogate which is really what capturing and bubbling is. It's events propogating from one place to another

*/

/*
// Event Propogation in Practice:
// rgb(255,255,255)
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);
  console.log(e.currentTarget === this);

  // Stop propogation
  // In practice it is usually not a good idea to stop propogation
  // Can be used to fix problems sometimes in complex applications w/ many handlers for the same events
  // e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('Container', e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('Nav', e.target, e.currentTarget);
});

*/

/*
// DOM traversing:
const h1 = document.querySelector('h1');

// Going downwards: child
console.log(h1.querySelectorAll('.highlight')); // this would work no matter how deep these child elements would be inside the h1 element
// If there are more highlight classes but they are not children of the h1 element they would not be selected
console.log(h1.childNodes); // direct children, not used very much
console.log(h1.children); // returns HTML collection, and 3 elements that are actually inside the h1, works only for direct children
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';

// Going upwards: parents
console.log(h1.parentNode);
console.log(h1.parentElement); // usually returns the same thing

//When we need a parent element that is not a direct parent
h1.closest('.header').style.background = 'var(--gradient-secondary)';
h1.closest('h1').style.background = 'var(--gradient-primary)'; //

// Going sidewats: siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

//same properties for nodes
console.log(h1.previousSibling);
console.log(h1.nextSibling);

// example of working with all the sibling elements of 1 element
console.log(h1.parentElement.children); // to get all of the siblings
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(0.5)';
});
*/

// Building a Tabbed Component:
// tabs.forEach(t => t.addEventListener('click', () => console.log('tab'))); // bad practice creating a method for each element, we should instead use the parent element

// Old way of doing guard clause
// if (clicked) {
//   clicked.classList.add('operations__tab--active');
// }

// Event Delegation: Implementing Page Navigation:

// One way to perform Page Navigation, but not the most efficient
// By writing our code this way we attach an event handler to every single element, which copies the function x amount of times
// What we can do instead with the use of event bubbling is target the common parent of all the elements, i.e. event delegation
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href'); // We use get attribute for more exact targeting, we are not looking for the absolute URL
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' }); // common for implementing navigation
//   });
// });

/*
// Sticky navigation
const initialCords = section1.getBoundingClientRect();
// console.log(initialCords);

window.addEventListener('scroll', function () {
  // console.log(window.scrollY);

  if (window.scrollY > initialCords.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
});
*/

// Sticky navigation: Intersection observer API

// For example:
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// const obsOptions = {
//   root: null, // We'll observe our target element intersecting the entire viewport
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

// Building a slider component
// Old way to display slides: // slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%)`));
//s1 = 0% , s2 = 100%, s3= 200%, s4 = 300%
// const slider = document.querySelector('.slider');
// slider.style.transform = 'scale(0.4) translateX(-800px)';
// slider.style.overflow = 'visible';
