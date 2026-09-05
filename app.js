(function () {
'use strict';

```
angular
    .module('ShoppingListCheckOff', [])
    .controller('ShoppingController', ShoppingController)
    .service('ShoppingListService', ShoppingListService);


/*
==================================================
SHOPPING CONTROLLER
==================================================
*/

ShoppingController.$inject = ['ShoppingListService'];

function ShoppingController(ShoppingListService) {

    var shop = this;


    // Load saved data from the service
    shop.toBuyItems = ShoppingListService.getToBuyItems();
    shop.boughtItems = ShoppingListService.getBoughtItems();


    // New item object
    shop.newItem = {
        name: '',
        quantity: 1
    };


    // Error message
    shop.errorMessage = '';


    /*
    ------------------------------------------------
    ADD NEW ITEM
    ------------------------------------------------
    */

    shop.addItem = function () {

        var name = shop.newItem.name;
        var quantity = shop.newItem.quantity;


        // Clear old error message
        shop.errorMessage = '';


        // Validate item name
        if (!name || name.trim() === '') {

            shop.errorMessage =
                'Please enter an item name.';

            return;
        }


        // Default quantity to 1
        if (!quantity) {
            quantity = 1;
        }


        // Validate quantity
        if (quantity < 1) {

            shop.errorMessage =
                'Quantity must be at least 1.';

            return;
        }


        // Add item through the service
        ShoppingListService.addItem(
            name.trim(),
            Number(quantity)
        );


        // Reset form
        shop.newItem = {
            name: '',
            quantity: 1
        };

    };


    /*
    ------------------------------------------------
    MARK ITEM AS BOUGHT
    ------------------------------------------------
    */

    shop.markAsBought = function (index) {

        ShoppingListService.markAsBought(index);

    };


    /*
    ------------------------------------------------
    UNDO PURCHASE
    ------------------------------------------------
    */

    shop.undoBought = function (index) {

        ShoppingListService.undoBought(index);

    };


    /*
    ------------------------------------------------
    DELETE FROM TO BUY LIST
    ------------------------------------------------
    */

    shop.deleteToBuyItem = function (index) {

        ShoppingListService.deleteToBuyItem(index);

    };


    /*
    ------------------------------------------------
    DELETE FROM BOUGHT LIST
    ------------------------------------------------
    */

    shop.deleteBoughtItem = function (index) {

        ShoppingListService.deleteBoughtItem(index);

    };


    /*
    ------------------------------------------------
    CLEAR ALL SHOPPING DATA
    ------------------------------------------------
    */

    shop.clearAll = function () {

        var confirmClear =
            window.confirm(
                'Are you sure you want to clear your entire shopping list?'
            );

        if (confirmClear) {

            ShoppingListService.clearAll();

        }

    };

}


/*
==================================================
SHOPPING LIST SERVICE
==================================================
*/

function ShoppingListService() {

    var service = this;


    // LocalStorage key
    var STORAGE_KEY = 'myShoppingList';


    /*
    ------------------------------------------------
    LOAD DATA FROM LOCALSTORAGE
    ------------------------------------------------
    */

    var savedData =
        localStorage.getItem(STORAGE_KEY);


    var data;


    try {

        data = savedData
            ? JSON.parse(savedData)
            : {
                toBuyItems: [],
                boughtItems: []
            };

    }
    catch (error) {

        data = {
            toBuyItems: [],
            boughtItems: []
        };

    }


    // Make sure arrays exist
    if (!Array.isArray(data.toBuyItems)) {

        data.toBuyItems = [];

    }

    if (!Array.isArray(data.boughtItems)) {

        data.boughtItems = [];

    }


    // Main arrays
    service.toBuyItems = data.toBuyItems;
    service.boughtItems = data.boughtItems;


    /*
    ------------------------------------------------
    SAVE DATA TO LOCALSTORAGE
    ------------------------------------------------
    */

    service.saveData = function () {

        var shoppingData = {

            toBuyItems: service.toBuyItems,

            boughtItems: service.boughtItems

        };


        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(shoppingData)
        );

    };


    /*
    ------------------------------------------------
    GET TO BUY ITEMS
    ------------------------------------------------
    */

    service.getToBuyItems = function () {

        return service.toBuyItems;

    };


    /*
    ------------------------------------------------
    GET BOUGHT ITEMS
    ------------------------------------------------
    */

    service.getBoughtItems = function () {

        return service.boughtItems;

    };


    /*
    ------------------------------------------------
    ADD ITEM
    ------------------------------------------------
    */

    service.addItem = function (name, quantity) {

        var newItem = {

            id: Date.now(),

            name: name,

            quantity: quantity

        };


        service.toBuyItems.push(newItem);


        service.saveData();

    };


    /*
    ------------------------------------------------
    MOVE ITEM TO BOUGHT LIST
    ------------------------------------------------
    */

    service.markAsBought = function (index) {

        if (
            index < 0 ||
            index >= service.toBuyItems.length
        ) {
            return;
        }


        var item =
            service.toBuyItems.splice(index, 1)[0];


        service.boughtItems.push(item);


        service.saveData();

    };


    /*
    ------------------------------------------------
    MOVE ITEM BACK TO TO BUY LIST
    ------------------------------------------------
    */

    service.undoBought = function (index) {

        if (
            index < 0 ||
            index >= service.boughtItems.length
        ) {
            return;
        }


        var item =
            service.boughtItems.splice(index, 1)[0];


        service.toBuyItems.push(item);


        service.saveData();

    };


    /*
    ------------------------------------------------
    DELETE TO BUY ITEM
    ------------------------------------------------
    */

    service.deleteToBuyItem = function (index) {

        if (
            index < 0 ||
            index >= service.toBuyItems.length
        ) {
            return;
        }


        service.toBuyItems.splice(index, 1);


        service.saveData();

    };


    /*
    ------------------------------------------------
    DELETE BOUGHT ITEM
    ------------------------------------------------
    */

    service.deleteBoughtItem = function (index) {

        if (
            index < 0 ||
            index >= service.boughtItems.length
        ) {
            return;
        }


        service.boughtItems.splice(index, 1);


        service.saveData();

    };


    /*
    ------------------------------------------------
    CLEAR EVERYTHING
    ------------------------------------------------
    */

    service.clearAll = function () {

        service.toBuyItems.length = 0;

        service.boughtItems.length = 0;


        localStorage.removeItem(STORAGE_KEY);

    };

}
```

})();


/* (function function_name(argument) {
'use strict';

angular.module('ShoppingListCheckOff', [])
.controller('ToBuyController', ToBuyController)
.controller('AlreadyBoughtController', AlreadyBoughtController)
.service('ShoppingListCheckOffService', ShoppingListCheckOffService);


ToBuyController.$inject = ['ShoppingListCheckOffService'];
function ToBuyController(ShoppingListCheckOffService) {
	var toBuyList = this;

	toBuyList.items = ShoppingListCheckOffService.getItems('toBuyList');
	

	toBuyList.bought = function (itemIndex, itemName, itemQuantity) {
		ShoppingListCheckOffService.buyItem(itemIndex, itemName, itemQuantity);
	}

}


AlreadyBoughtController.$inject = ['ShoppingListCheckOffService'];
function AlreadyBoughtController(ShoppingListCheckOffService) {
	var showList = this;

	showList.items = ShoppingListCheckOffService.getItems('showList');

}


function ShoppingListCheckOffService() {
	var service = this;


	var toBuyItems = [
	{name: 'Cheese', quantity:10},
	{name: 'Milk', quantity:2},
	{name: 'Eggs', quantity:12},
	{name: 'Toasts', quantity:8},
	{name: 'Apples', quantity:10}
	];
	var boughtItems = [];

	service.buyItem = function (itemIndex, itemName, itemQuantity) {

		var item = {
			name:itemName,
			quantity: itemQuantity
		};
		boughtItems.push(item);
		toBuyItems.splice(itemIndex, 1);
	};

	service.getItems = function (whichList) {
		if (whichList=='toBuyList') {
			console.log(toBuyItems);
			return toBuyItems;
		}else{
			return boughtItems;
		}
		
	};



}
*/

})();
