// (() => {
// })();

// === CSS MANIPULATION ===
let display = (e,x) => {
  if (x === undefined){
    x = 'block';
  }
  e.style.display = x;
};
let padding = (e,n) => {
  if (x === undefined) return;
  e.style.padding = n;
  console.log('hai');
};

let scrollToPrev = () => {
  let parent = document.querySelector('.carousel--wrap');
  let width = document.querySelector('.carousel--item').clientWidth;
  if (parent.scrollLeft != 0) {
    parent.scrollBy({
      left: -width,
      top: 0,
      behavior: 'smooth'
    });
  } else {
    parent.scrollTo({
      left: parent.scrollWidth,
      top: 0,
      behavior: 'smooth'
    });
  }
};

let scrollToNext = () => {
  let parent = document.querySelector('.carousel--wrap');
  let width = document.querySelector('.carousel--item').clientWidth;
  if (parent.scrollLeft < (parent.scrollWidth -width)) {
    parent.scrollBy({
      left: width,
      top: 0,
      behavior: 'smooth'
    });
  }else{
    parent.scrollTo({
      left: 0,
      top: 0,
      behavior: 'smooth'
    });
  }
};

let goTop = () => {
  scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};