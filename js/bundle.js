/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./js/modules/calculator":
/*!*******************************!*\
  !*** ./js/modules/calculator ***!
  \*******************************/
/***/ ((module) => {

function calculator() {
    //Calculator
    const result = document.querySelector('.calculating__result span');
    let sex, height, weight, age, ratio;

    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else {
        sex = "female";
        localStorage.setItem('sex', 'female');
    }

    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = "1.375";
        localStorage.setItem('ratio', '1.375');
    }


    function initLocalSettings(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.classList.remove(activeClass);
            if (elem.getAttribute('id') === localStorage.getItem('sex')) {
                elem.classList.add(activeClass);
            }

            if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                elem.classList.add(activeClass);
            }

        });
    }

    initLocalSettings('#gender div', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

    function calcTotal() {
        if (!sex || !height || !weight || !age || !ratio) {
            result.textContent = '0';
            return;
        }
        if (sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }
    calcTotal();

    function getStaticInformation(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.addEventListener('click', e => {
                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));
                } else {
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex', e.target.getAttribute('id'));
                }

                elements.forEach(element => {
                    element.classList.remove(activeClass);
                });

                e.target.classList.add(activeClass);

                calcTotal();
            });
        });
    }

    getStaticInformation('#gender div', 'calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');

    function getDinamicInformation(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', (e) => {
            if (input.value.match(/\D/g)) {
                input.style.outline = '1px solid red';
            } else {
                input.style.outline = 'none';
            }

            switch (input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            }
            calcTotal();
        });
    }

    getDinamicInformation('#height');
    getDinamicInformation('#weight');
    getDinamicInformation('#age');
}

module.exports = calculator;

/***/ }),

/***/ "./js/modules/cards.js":
/*!*****************************!*\
  !*** ./js/modules/cards.js ***!
  \*****************************/
/***/ ((module) => {

function cards() {
    class Menu {
        constructor(srcImg, altImg, nameMenu, description, price, parentSelector, ...classes) {
            this.srcImg = srcImg;
            this.altImg = altImg;
            this.nameMenu = nameMenu;
            this.description = description;
            this.price = price;
            this.classes = classes;
            this.parentSelector = document.querySelector(parentSelector);
            this.transfer = 90;
            this.converter();


        }

        converter() {
            this.price = this.price * this.transfer;
        }

        menuContent() {
            const element = document.createElement('div');

            if (this.classes.length === 0) {
                this.element = 'menu__item';
                element.classList.add(this.element);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }

            element.innerHTML = `
            <img src=${this.srcImg} alt=${this.altImg}>
            <h3 class="menu__item-subtitle">${this.nameMenu}</h3>
            <div class="menu__item-descr">${this.description}</div>
                <div class="menu__item-divider"></div>
            <div class="menu__item-price">
                <div class="menu__item-cost">Цена:</div>
                <div class="menu__item-total"><span>${this.price}</span> p/день </div>
            </div>
        `;

            this.parentSelector.append(element);
        }
    }

    const getResource = async (url) => {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Couldn't fetch ${url}, status: ${res.status}`);
        }
        return await res.json();
    };

    getResource('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({
                img,
                altImg,
                title,
                descr,
                price
            }) => {
                new Menu(img, altImg, title, descr, price, '.menu .container').menuContent();
            });
        });

}

module.exports = cards;

/***/ }),

/***/ "./js/modules/forms.js":
/*!*****************************!*\
  !*** ./js/modules/forms.js ***!
  \*****************************/
/***/ ((module) => {

function forms() {
    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Мы скоро с вами свяжемся.',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        bingData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
            body: data,
            headers: {
                'Content-type': 'application/json'
            }
        });

        return await res.json();
    };

    function bingData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
            display:block;
            margin: 0 auto;
            `;

            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);


            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
                .then(data => {
                    console.log(data);
                    showThanksModal(message.success);
                    statusMessage.remove();
                })
                .catch(() => {
                    showThanksModal(message.failure);
                })
                .finally(() => {
                    form.reset();
                });
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        showModal();
        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
        <div class = "modal__content">
            <div class = "modal__close" date-close>&times</div>
            <div class = "modal__title">${message}</div>
        </div>
    `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            hiddenModal();
        }, 4000);
    }
}

module.exports = forms;

/***/ }),

/***/ "./js/modules/modal.js":
/*!*****************************!*\
  !*** ./js/modules/modal.js ***!
  \*****************************/
/***/ ((module) => {

function modal() {
    const modalOpen = document.querySelectorAll('[date-modal]'),
        modalMassage = document.querySelector('.modal');


    function showModal() {
        modalMassage.classList.add('show');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }

    function hiddenModal() {
        modalMassage.classList.remove('show');
        document.body.style.overflow = '';
    }
    modalOpen.forEach(item => {
        item.addEventListener('click', showModal);
    });

    modalMassage.addEventListener('click', (e) => {
        if (e.target === modalMassage || e.target.getAttribute('date-close') == '') {
            hiddenModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modalMassage.classList.contains('show')) {
            hiddenModal();
        }
    });

    const modalTimerId = setTimeout(showModal, 50000);

    function showModalByScroll() {
        if (window.scrollY + document.documentElement.clientHeight >= document.body.scrollHeight) {
            showModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }
    window.addEventListener('scroll', showModalByScroll, );
}

module.exports = modal;

/***/ }),

/***/ "./js/modules/slider.js":
/*!******************************!*\
  !*** ./js/modules/slider.js ***!
  \******************************/
/***/ ((module) => {

function sliderMain() {
    const slides = document.querySelectorAll('.offer__slide'),
        slider = document.querySelector('.offer__slider'),
        prev = document.querySelector('.offer__slider-prev'),
        next = document.querySelector('.offer__slider-next'),
        current = document.querySelector('#current'),
        totalSlide = document.querySelector('#total'),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        slidesField = document.querySelector('.offer__slider-inner'),
        width = window.getComputedStyle(slidesWrapper).width;


    let slideIndex = 1,
        offset = 0;


    if (slides.length < 10) {
        totalSlide.textContent = `0${slides.length}`;
        current.textContent = `0${slideIndex}`;
    } else {
        totalSlide.textContent = slides.length;
        current.textContent = slideIndex;
    }

    slidesField.style.width = 100 * slides.length + '%';

    slidesWrapper.style.overflow = 'hidden';

    slides.forEach(slide => {
        slide.style.width = width;
    });

    slider.style.position = 'relative';

    const indicators = document.createElement('ol'),
        dots = [];
    indicators.classList.add('carousel-indicators');
    slider.append(indicators);

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.classList.add('dot');
        if (i == 0) {
            dot.classList.add('dot-active');
        }
        indicators.append(dot);
        dots.push(dot);
    }

    function currentSlide() {
        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }
    }

    function slideTransform() {
        slidesField.style.transform = `translateX(-${offset}px)`;
    }

    function showDot() {
        dots.forEach(dot => {
            dot.classList.remove('dot-active');
            dot.classList.add('dot-unactive');
        });
        dots[slideIndex - 1].classList.remove('dot-unactive');
        dots[slideIndex - 1].classList.add('dot-active');
    }

    function getNumbers(str) {
        return +str.replace(/\D/g, '');
    }
    // showDot();

    next.addEventListener('click', () => {
        if (offset == getNumbers(width) * (slides.length - 1)) {
            offset = 0;
        } else {
            offset += getNumbers(width);
        }

        slideTransform();

        if (slideIndex == slides.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }
        currentSlide();

        showDot();
    });

    prev.addEventListener('click', () => {
        if (offset == 0) {
            offset = getNumbers(width) * (slides.length - 1);
        } else {
            offset -= getNumbers(width);
        }

        slideTransform();

        if (slideIndex == 1) {
            slideIndex = slides.length;
        } else {
            slideIndex--;
        }
        currentSlide();

        showDot();
    });

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');

            slideIndex = slideTo;
            offset = getNumbers(width) * (slideTo - 1);

            slideTransform();

            currentSlide();

            showDot();
        });
    });
}

// showSlider(slideIndex);

// function showSlider(n) {
//     if (n > slides.length) {
//         slideIndex = 1;
//     }
//     if (n < 1) {
//         slideIndex = slides.length;
//     }

//     slides.forEach(item => item.classList.add('hide'));
//     slides[slideIndex - 1].classList.toggle('hide');

//     if (n < 10) {
//         current.textContent = `0${slideIndex}`;
//     } else {
//         current.textContent = slideIndex;
//     }
// }

// if (slides.length < 10) {
//     totalSlide.textContent = `0${slides.length}`;
// } else {
//     totalSlide.textContent = slides.length;
// }

// function plusSlides(n){
//     showSlider(slideIndex += n);
// }

// prev.addEventListener('click', () => {
//     plusSlides(-1);
// });

// next.addEventListener('click', () => {
//     plusSlides(1);
// });


module.exports = sliderMain;

/***/ }),

/***/ "./js/modules/tabs.js":
/*!****************************!*\
  !*** ./js/modules/tabs.js ***!
  \****************************/
/***/ ((module) => {

function tubs() {
    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsParent = document.querySelector('.tabheader__items'),
        tabsContent = document.querySelectorAll('.tabcontent');

    function hideTabsContent() {
        tabsContent.forEach((item) => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabsContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabs[i].classList.add('tabheader__item_active');
        tabsContent[i].classList.remove('hide');
    }

    hideTabsContent();
    showTabsContent();
    tabsParent.addEventListener('click', (e) => {
        const target = e.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabsContent();
                    showTabsContent(i);
                }
            });
        }
    });
}

module.exports = tubs;

/***/ }),

/***/ "./js/modules/timer.js":
/*!*****************************!*\
  !*** ./js/modules/timer.js ***!
  \*****************************/
/***/ ((module) => {

function timer() {
    const deadline = '2023-10-25';

    function gettimeRemaning(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor((t / (1000 * 60 * 60) % 24)),
            minutes = Math.floor((t / 1000 / 60) % 60),
            seconds = Math.floor((t / 1000) % 60);

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };

    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const t = gettimeRemaning(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadline);
}

module.exports = timer;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./js/script.js ***!
  \**********************/
window.addEventListener('DOMContentLoaded', () => {

const calculator = __webpack_require__(/*! ./modules/calculator */ "./js/modules/calculator"),
      cards = __webpack_require__(/*! ./modules/cards */ "./js/modules/cards.js"),
      forms = __webpack_require__(/*! ./modules/forms */ "./js/modules/forms.js"),
      modal = __webpack_require__(/*! ./modules/modal */ "./js/modules/modal.js"),
      slider = __webpack_require__(/*! ./modules/slider */ "./js/modules/slider.js"),
      tabs = __webpack_require__(/*! ./modules/tabs */ "./js/modules/tabs.js"),
      timer = __webpack_require__(/*! ./modules/timer */ "./js/modules/timer.js");

      calculator();
      cards();
      forms();
      modal();
      slider();
      tabs();
      timer();
      
});
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map