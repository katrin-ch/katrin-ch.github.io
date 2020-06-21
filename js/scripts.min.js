document.addEventListener('DOMContentLoaded', function() {

  let hamburgerMenu = document.querySelector('.hamburger-menu')
    , hamburgerButton = document.querySelector('.hamburger-button')
    , mainMenu = document.querySelector('.main-menu')
    , windowWidth;

  hamburgerMenu.addEventListener('click', function() {
    hamburgerButton.classList.toggle('animate');
    mainMenu.classList.toggle('menu_animate');
  });

  function getSize() {
    windowWidth = document.documentElement.clientWidth;
  }
  getSize();

  window.onresize = function(){
    getSize();
  };

  let cache = {};
  function loadPage(url) {
    if (cache[url]) {
      return new Promise(function(resolve) {
        resolve(cache[url]);
      });
    }

    return fetch(url, {
      method: 'GET'
    }).then(function(response) {
      cache[url] = response.text();
      return cache[url];
    });

  }

  let mainBox = document.querySelector('.main-box');

  function changePage() {
    let url = window.location.href;

    loadPage(url).then(function(responseText) {
      let wrapper = document.createElement('div');
      wrapper.innerHTML = responseText;
      let oldContent = document.querySelector('.change');
      let newContent = wrapper.querySelector('.change');

      mainBox.appendChild(newContent);
      animate(oldContent, newContent);
    });
  }

  function animate(oldContent, newContent) {
    let getOldClass = oldContent.classList.contains("home-page");
    let getNewClass = newContent.classList.contains("home-page");

    if (getNewClass === true) {
      let getUrl = sessionStorage.getItem('itemUrl');
      getUrl = getUrl[0] === '/' ? getUrl.substr(1) : getUrl;
      let getEl = document.querySelector('a[href="'+ getUrl +'"]');
      getEl.classList.add("active-item");
    }

    if (getOldClass === true ) {
      oldContent.classList.add("active-home");
    } else {
      oldContent.classList.add("active-artist");
    }

    setTimeout(function(){
    oldContent.parentNode.removeChild(oldContent);
    }, 600 );

  }

  window.addEventListener('popstate', changePage);

  let bodyClass = document.querySelector('.body-class');

  mainBox.addEventListener('click', function(e) {

    let el = e.target.closest('.home-item')
      , sizeLeft = 125
      , toggle = 1;

    bodyClass.scrollIntoView({ block: "start"});

    if(windowWidth < 550) {
      sizeLeft = 10;
      toggle = 0;
    }

    if (el) {
      e.preventDefault();
      history.pushState(null, null, el.href);
      let top = el.offsetTop
        , imgY = top - 135
        , y = top - 123
        , x = (el.offsetLeft * toggle) - sizeLeft;
      bodyClass.style.cssText = '--translate-image: translate3d('+ x +'px, '+ y +'px, 0); --translate-img: translate3d('+ -x+'px, '+ -imgY +'px, 0)';
      sessionStorage.setItem('itemUrl', el.pathname);
      el.classList.add("old-active");
      changePage();
    }
  });

});
