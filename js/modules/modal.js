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