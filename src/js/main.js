const navMobile = document.querySelector('.nav-mobile');
const navBtn = document.querySelector('.hamburger');
const navLink = document.querySelector('.nav__link')
const navLink2 = document.querySelector('.nav__link-two')
const navLink3 = document.querySelector('.nav__link-three')
const footerYear = document.querySelector('.footer__year');
const body = document.getElementsByTagName('body')[0];

const handleNav = () => {
    navBtn.classList.toggle('is-active');
    navMobile.classList.toggle('nav-mobile--active');
    body.classList.toggle("no-scroll");
};

navBtn.addEventListener('click', handleNav)

const closeNav = () => {
    navBtn.classList.remove('is-active');
    navMobile.classList.remove('nav-mobile--active');
    body.classList.remove("no-scroll");
};

navLink.addEventListener('click', closeNav)
navLink2.addEventListener('click', closeNav)
navLink3.addEventListener('click', closeNav)


const handleCurrentYear = () => {
    const year = (new Date).getFullYear();
    footerYear.innerText = year;
};

handleCurrentYear();