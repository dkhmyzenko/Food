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