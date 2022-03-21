import "./css/styles.css";
import menuTemplate from "./hbs/menu.hbs";
import headerTemplate from "./hbs/header.hbs";
import layoutTemplate from "./hbs/layout.hbs";
import contentTemplate from "./hbs/content.hbs";
import productsTemplate from "./hbs/product-list.hbs";
import productTemplate from "./hbs/product.hbs";
import cartTemplate from "./hbs/cart.hbs";

import weather from "./controller/controller";
import menu from "./js/menu";
import pages from './js/pages';
import cart from "./js/cart";


const appEl = document.getElementById("app");


appEl.innerHTML = layoutTemplate();


const mainMenuEl = document.getElementById("main-menu");
const headerEl = document.getElementById("header");
const contentEl = document.getElementById("content");
const productDetailsWindowEl = document.getElementById("product-details-window");
const productDetailsEl = document.getElementById("product-details");
const productDetailsWindowClose = productDetailsWindowEl.querySelector("#product-details-close");

productDetailsWindowClose.addEventListener("click", function () {
    productDetailsWindowEl.style.display = "none";
});

cart.load();
let active;

let navigate = async function (page) {
    active = page;
    localStorage.setItem("lastPage", page);
    menu.forEach(function (el) {
        if (el.id == active) {
            el.class = "active";
        } else {
            el.class = "inactive";
        }
    });
    mainMenuEl.innerHTML = menuTemplate(menu);

    let cPageData = pages[page];
    headerEl.innerHTML = headerTemplate(cPageData);
    contentEl.innerHTML = contentTemplate(cPageData);


    let menuItems = document.querySelectorAll("ul#nav-menu>li");
    menuItems.forEach(function (el) {
        el.addEventListener("click", function () {
            navigate(el.dataset.menu);
        });
    });

    let buttonEl = contentEl.querySelectorAll(".btnShop");
    buttonEl.forEach(function (el) {
        el.addEventListener("click", function () {
            navigate("products");
        });
    });

    if (page === "journey") {
        let weatherEls = contentEl.querySelectorAll(".weather-location");
        weatherEls.forEach(function (el) {
            new weather(el.dataset.lat, el.dataset.lon, el);
        });
    };
    if (page === "cart") {
        let pdata = await (await fetch("http://localhost:8081/products.json")).json();
        cart.cartData.items.forEach(function (ael) {
            let cartItem = pdata.products.find(el => el.id == ael.id);
            if (cartItem !== undefined) {
                ael.product = cartItem;
            }
        });

        contentEl.innerHTML = cartTemplate(cart);

        let removeBtnEls = contentEl.querySelectorAll(".cart-remove");

        removeBtnEls.forEach(function (el) {
            el.addEventListener("click", () => {
                let pid = el.parentElement.parentElement.dataset.id;
                cart.remove(pid);
                navigate("cart");
            });
        });

        let amountBtnEls = contentEl.querySelectorAll(".cart-quantity-mod");

        amountBtnEls.forEach(function (el) {
            el.addEventListener("click", () => {
                let pid = el.parentElement.parentElement.dataset.id;
                cart.add(pid, parseInt(el.dataset.amount));

                let item = cart.get(pid);
                el.parentElement.querySelector(".cart-amount").innerHTML = item.quantity;

            });
        });

    } else if (page === "products") {
        let pdata = await (await fetch("http://localhost:8081/products.json")).json();
        contentEl.innerHTML = productsTemplate(pdata);

        contentEl.querySelectorAll(".product").forEach(function (el) {
            el.addEventListener("click", () => {
                let pIndex = el.dataset.index;
                productDetailsWindowEl.style.display = "block";
                productDetailsEl.innerHTML = productTemplate(pdata.products[pIndex]);
                productDetailsEl.querySelector("#product-add").addEventListener("click", function () {
                    cart.add(this.dataset.id);
                });
            });
        });
    };


};

let nPage = localStorage.getItem("lastPage");
if (nPage === null) {
    nPage = "home";
}

navigate(nPage);