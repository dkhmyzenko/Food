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