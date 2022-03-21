export default {
    load: function () {
        let cData = localStorage.getItem("cart");
        if (cData !== null) {
            this.cartData = JSON.parse(localStorage.getItem("cart"));
        }
        let items = this.cartData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].quantity === undefined) {
                items[i].quantity = 1;
            }
        }

    },

    get: function (pid) {
        let items = this.cartData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].id === pid) {
                return items[i];
            }
        }
        return undefined;
    },

    add: function (pid, amount) {
        if (amount === undefined) {
            amount = 1;
        };
        let items = this.cartData.items;

        let added = false;

        for (let i = 0; i < items.length; i++) {
            if (items[i].id === pid) {
                if (items[i].quantity === undefined) {
                    items[i].quantity = 1 + amount;
                } else {
                    items[i].quantity += amount;
                    if (items[i].quantity < 1) {
                        items[i].quantity = 1;
                    }
                }
                added = true;
                break;
            }
        }
        if (!added) {
            items.push({ id: pid, date: Date.now(), quantity: amount })
        }


        localStorage.setItem("cart", JSON.stringify(this.cartData));
    },
    remove: function (pid) {
        let items = this.cartData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].id === pid) {
                items.splice(i, 1);
                localStorage.setItem("cart", JSON.stringify(this.cartData));
                return;
            }
        };
    },
    cartData: {
        items: []

    }

};