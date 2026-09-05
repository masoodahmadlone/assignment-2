(function () {
    'use strict';


    angular
        .module('ShoppingListCheckOff', [])
        .controller('ShoppingController', ShoppingController)
        .service('ShoppingListService', ShoppingListService);


    /*
    ==========================================
    CONTROLLER
    ==========================================
    */

    ShoppingController.$inject = ['ShoppingListService'];

    function ShoppingController(ShoppingListService) {

        var shop = this;


        /*
        ------------------------------------------
        CURRENT DATE
        ------------------------------------------
        */

        shop.currentDate = new Date();


        /*
        ------------------------------------------
        LOAD DATA
        ------------------------------------------
        */

        shop.toBuyItems =
            ShoppingListService.getToBuyItems();

        shop.boughtItems =
            ShoppingListService.getBoughtItems();

        shop.shoppingHistory =
            ShoppingListService.getShoppingHistory();


        /*
        ------------------------------------------
        NEW ITEM
        ------------------------------------------
        */

        shop.newItem = {
            name: '',
            quantity: 1
        };


        shop.errorMessage = '';


        /*
        ==========================================
        ADD ITEM
        ==========================================
        */

        shop.addItem = function () {

            shop.errorMessage = '';

            var name = shop.newItem.name;
            var quantity = shop.newItem.quantity;


            if (!name || name.trim() === '') {

                shop.errorMessage =
                    'Please enter an item name.';

                return;
            }


            if (!quantity) {

                quantity = 1;

            }


            quantity = Number(quantity);


            if (quantity < 1) {

                shop.errorMessage =
                    'Quantity must be at least 1.';

                return;
            }


            ShoppingListService.addItem(
                name.trim(),
                quantity
            );


            shop.newItem = {
                name: '',
                quantity: 1
            };

        };


        /*
        ==========================================
        MARK AS BOUGHT
        ==========================================
        */

        shop.markAsBought = function (index) {

            ShoppingListService.markAsBought(index);

        };


        /*
        ==========================================
        UNDO BOUGHT ITEM
        ==========================================
        */

        shop.undoBought = function (index) {

            ShoppingListService.undoBought(index);

        };


        /*
        ==========================================
        DELETE FROM TO BUY
        ==========================================
        */

        shop.deleteToBuyItem = function (index) {

            ShoppingListService.deleteToBuyItem(index);

        };


        /*
        ==========================================
        DELETE FROM BOUGHT
        ==========================================
        */

        shop.deleteBoughtItem = function (index) {

            ShoppingListService.deleteBoughtItem(index);

        };


        /*
        ==========================================
        COMPLETE SHOPPING
        ==========================================
        */

        shop.completeShopping = function () {

            if (shop.boughtItems.length === 0) {

                return;

            }


            var confirmed = window.confirm(
                'Complete this shopping trip and save it to your shopping history?'
            );


            if (!confirmed) {

                return;

            }


            ShoppingListService.completeShopping();


            shop.newItem = {
                name: '',
                quantity: 1
            };

        };


        /*
        ==========================================
        DELETE HISTORY RECORD
        ==========================================
        */

        shop.deleteRecord = function (index) {

            var confirmed = window.confirm(
                'Are you sure you want to delete this shopping record?'
            );


            if (confirmed) {

                ShoppingListService.deleteRecord(index);

            }

        };


        /*
        ==========================================
        DOWNLOAD PDF
        ==========================================
        */

        shop.downloadPDF = function (record) {

            if (
                !window.jspdf ||
                !window.jspdf.jsPDF
            ) {

                alert(
                    'PDF library could not be loaded. Please check your internet connection.'
                );

                return;

            }


            var jsPDF =
                window.jspdf.jsPDF;


            var doc =
                new jsPDF();


            var pageWidth =
                doc.internal.pageSize.getWidth();


            var y = 20;


            /*
            TITLE
            */

            doc.setFontSize(20);

            doc.text(
                'Shopping Record',
                pageWidth / 2,
                y,
                {
                    align: 'center'
                }
            );


            y += 15;


            doc.setFontSize(12);


            /*
            DATE
            */

            var completedDate =
                new Date(record.completedDate);


            doc.text(
                'Shopping Date: ' +
                completedDate.toLocaleDateString(),
                20,
                y
            );


            y += 8;


            doc.text(
                'Completed Time: ' +
                completedDate.toLocaleTimeString(),
                20,
                y
            );


            y += 15;


            /*
            ITEMS HEADER
            */

            doc.setFontSize(14);

            doc.text(
                'Purchased Items',
                20,
                y
            );


            y += 10;


            doc.setFontSize(11);


            /*
            LIST ITEMS
            */

            for (
                var i = 0;
                i < record.items.length;
                i++
            ) {

                var item =
                    record.items[i];


                var text =
                    (i + 1) +
                    '. ' +
                    item.name +
                    ' - Quantity: ' +
                    item.quantity;


                /*
                NEW PAGE IF NEEDED
                */

                if (y > 270) {

                    doc.addPage();

                    y = 20;

                }


                doc.text(
                    text,
                    25,
                    y
                );


                y += 8;

            }


            y += 10;


            doc.setFontSize(12);


            doc.text(
                'Total Items: ' +
                record.items.length,
                20,
                y
            );


            /*
            SAVE PDF
            */

            var fileDate =
                completedDate
                    .toISOString()
                    .split('T')[0];


            doc.save(
                'Shopping_Record_' +
                fileDate +
                '.pdf'
            );

        };

    }


    /*
    ==========================================
    SERVICE
    ==========================================
    */

    function ShoppingListService() {

        var service = this;


        var STORAGE_KEY =
            'completeShoppingApplication';


        /*
        ==========================================
        LOAD SAVED DATA
        ==========================================
        */

        var savedData =
            localStorage.getItem(STORAGE_KEY);


        var data;


        try {

            data = savedData
                ? JSON.parse(savedData)
                : {
                    toBuyItems: [],
                    boughtItems: [],
                    shoppingHistory: []
                };

        }
        catch (error) {

            data = {
                toBuyItems: [],
                boughtItems: [],
                shoppingHistory: []
            };

        }


        /*
        MAKE SURE ARRAYS EXIST
        */

        service.toBuyItems =
            Array.isArray(data.toBuyItems)
                ? data.toBuyItems
                : [];


        service.boughtItems =
            Array.isArray(data.boughtItems)
                ? data.boughtItems
                : [];


        service.shoppingHistory =
            Array.isArray(data.shoppingHistory)
                ? data.shoppingHistory
                : [];


        /*
        ==========================================
        SAVE DATA
        ==========================================
        */

        service.saveData = function () {

            var dataToSave = {

                toBuyItems:
                    service.toBuyItems,

                boughtItems:
                    service.boughtItems,

                shoppingHistory:
                    service.shoppingHistory

            };


            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(dataToSave)
            );

        };


        /*
        ==========================================
        GETTERS
        ==========================================
        */

        service.getToBuyItems = function () {

            return service.toBuyItems;

        };


        service.getBoughtItems = function () {

            return service.boughtItems;

        };


        service.getShoppingHistory = function () {

            return service.shoppingHistory;

        };


        /*
        ==========================================
        ADD ITEM
        ==========================================
        */

        service.addItem = function (
            name,
            quantity
        ) {

            var item = {

                id:
                    Date.now() +
                    Math.floor(Math.random() * 1000),

                name:
                    name,

                quantity:
                    quantity,

                addedDate:
                    new Date().toISOString()

            };


            service.toBuyItems.push(item);


            service.saveData();

        };


        /*
        ==========================================
        MARK AS BOUGHT
        ==========================================
        */

        service.markAsBought = function (index) {

            if (
                index < 0 ||
                index >= service.toBuyItems.length
            ) {

                return;

            }


            var item =
                service.toBuyItems
                    .splice(index, 1)[0];


            item.boughtDate =
                new Date().toISOString();


            service.boughtItems.push(item);


            service.saveData();

        };


        /*
        ==========================================
        UNDO BOUGHT
        ==========================================
        */

        service.undoBought = function (index) {

            if (
                index < 0 ||
                index >= service.boughtItems.length
            ) {

                return;

            }


            var item =
                service.boughtItems
                    .splice(index, 1)[0];


            delete item.boughtDate;


            service.toBuyItems.push(item);


            service.saveData();

        };


        /*
        ==========================================
        DELETE TO BUY ITEM
        ==========================================
        */

        service.deleteToBuyItem = function (index) {

            service.toBuyItems.splice(
                index,
                1
            );


            service.saveData();

        };


        /*
        ==========================================
        DELETE BOUGHT ITEM
        ==========================================
        */

        service.deleteBoughtItem = function (index) {

            service.boughtItems.splice(
                index,
                1
            );


            service.saveData();

        };


        /*
        ==========================================
        COMPLETE SHOPPING TRIP
        ==========================================
        */

        service.completeShopping = function () {

            var record = {

                id:
                    Date.now(),

                completedDate:
                    new Date().toISOString(),

                items:
                    angular.copy(
                        service.boughtItems
                    )

            };


            /*
            ADD TO HISTORY
            */

            service.shoppingHistory.unshift(
                record
            );


            /*
            CLEAR CURRENT LISTS
            */

            service.toBuyItems.length = 0;

            service.boughtItems.length = 0;


            service.saveData();

        };


        /*
        ==========================================
        DELETE HISTORY RECORD
        ==========================================
        */

        service.deleteRecord = function (index) {

            service.shoppingHistory.splice(
                index,
                1
            );


            service.saveData();

        };

    }

})();
