(function function_name(argument) {
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


})();