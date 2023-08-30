window.addEventListener('DOMContentLoaded', () => {

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

    //timer

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

    //modal

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

    // class menu

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
        data.forEach(({img, altImg, title, descr, price}) => {
            new Menu(img, altImg, title, descr, price, '.menu .container').menuContent();
        });
    });

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

// slider

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

function currentSlide () {
    if (slides.length < 10){
        current.textContent = `0${slideIndex}`;
    } else {
        current.textContent = slideIndex;
    }
}

function slideTransform () {
    slidesField.style.transform = `translateX(-${offset}px)`;
}

function showDot () {
    dots.forEach( dot => {
        dot.classList.remove('dot-active');
        dot.classList.add('dot-unactive');
    });
    dots[slideIndex - 1].classList.remove('dot-unactive');
    dots[slideIndex - 1].classList.add('dot-active');
}
// showDot();

next.addEventListener('click', () => {
    if (offset == parseInt(width) * (slides.length -1)) {
        offset = 0;
    } else {
        offset += parseInt(width);
    }

    slideTransform();

    if (slideIndex == slides.length){
        slideIndex = 1;
    } else {
        slideIndex++;
    }
    currentSlide();

    showDot();
});

prev.addEventListener('click', () => {
    if ( offset == 0 ) {
        offset = parseInt(width) * (slides.length - 1);
    } else {
        offset -= parseInt(width);
    } 

    slideTransform();

    if (slideIndex == 1){
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
        offset = parseInt(width) * (slideTo -1);

        slideTransform();

        currentSlide();

        showDot();
    });
});


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






});