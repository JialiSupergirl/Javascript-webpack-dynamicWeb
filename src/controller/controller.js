import view from '../hbs/view.hbs';


export default class {
    constructor(lat, lng, container) {
        this.options = {
            title: "Current Temperature",
            lat: lat,
            lng: lng,
            container: container,
            url: `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=584e3f226fe680d689581c17085be830&units=metric`
        };

        this.loaded = false;
        this.data = {};

        this.load = async function () {
            this.data = await (await fetch(this.options.url)).json();
            this.draw(this.data);
        }

        this.setTitle = function (title) {
            this.options.title = title;
            this.options.container.querySelector(".miniweather-title").innerHTML = title;
        }

        this.draw = function () {
            this.options.container.innerHTML = view({ options: this.options, data: this.data });
        }

        this.load();

    };
};