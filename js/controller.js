var form = angular.module('form', []);

form.controller('formCtrl', function ($scope, $http) {

    $scope.purchases = [];
    $scope.sales = [];
    $scope.totalSellAmount = 0;
    $scope.totalSellQuantity = 0;
    $scope.totalSellGST = 0;
    $scope.totalDalali = 0;
    $scope.isPrint = false;

    $scope.initializeForm = function (data) {
        $scope.purchases = [];
        $scope.sales = [];
        $scope.totalSellAmount = 0;
        $scope.totalSellQuantity = 0;
        $scope.totalSellGST = 0;
        $scope.totalDalali = 0;
        $scope.isPrint = false;

        $scope.purchases.push(data.purchase);
        $scope.purchaseTemp = data.purchase;
        $scope.purchaseBillNumber = $scope.purchaseTemp.purchaseBillNumber
        $scope.greyPurchasedQuantity = $scope.purchaseTemp.greyPurchasedQuantity
        $scope.totalPurchasePayment = $scope.purchaseTemp.totalPurchasePayment
        $scope.totalPurchaseGST = $scope.purchaseTemp.totalPurchaseGST
        $scope.purchaseDalali = $scope.purchaseTemp.purchaseDalali
        $scope.purchaseTransport = $scope.purchaseTemp.purchaseTransport


        for(let i in data.sales){
            let sale = data.sales[i];
            $scope.sales.push(sale);
            $scope.totalSellQuantity += sale.greySoldQuantity;
            $scope.totalSellAmount += sale.sellPayment;
            $scope.totalSellGST += sale.sellGST;
            $scope.totalDalali += sale.dalali;
        }
    }

    $scope.addPurchase = function (purchaseBillNumber, greyPurchasedQuantity, totalPurchasePayment, totalPurchaseGST,  purchaseDalali, purchaseTransport) {
        let purchase = {
            "purchaseBillNumber": purchaseBillNumber,
            "greyPurchasedQuantity": greyPurchasedQuantity,
            "totalPurchasePayment": totalPurchasePayment,
            "totalPurchaseGST": totalPurchaseGST,
            "purchaseDalali": purchaseDalali,
            "purchaseTransport": purchaseTransport

        };
        $scope.purchases.push(purchase);
    };

    $scope.deletePurchase = function (index) {
        $scope.purchases.splice(index, 1);
    };

    $scope.addSales = function (sellBillNumber, greySoldQuantity, sellPayment, sellGST, dalali) {
        if (false) {
            alert("Quantity is more than Purchase");
        }
        else {
            let sale = {
                "sellBillNumber": sellBillNumber,
                "greySoldQuantity": greySoldQuantity,
                "sellPayment": sellPayment,
                "sellGST": sellGST,
                "dalali": dalali
            };
            $scope.sales.push(sale);
            $scope.totalSellQuantity += greySoldQuantity;
            $scope.totalSellAmount += sellPayment;
            $scope.totalSellGST += sellGST;
            $scope.totalDalali += dalali ? dalali : 0;
        }
    };

    $scope.deleteSales = function (index, sale) {
        $scope.sales.splice(index, 1);
        $scope.totalSellQuantity -= sale.greySoldQuantity;
        $scope.totalSellAmount -= sale.sellPayment;
        $scope.totalSellGST -= sale.sellGST;
        $scope.totalDalali -= dalali;
    };

    $scope.save = function () {

        $http({
            method: "POST",
            url: "/save",
            headers: {
                'Accept': "application/json, text/plain, */*",
                'Content-Type': 'application/json'
            },
            data: {
                purchase: $scope.purchases[0],
                sales: $scope.sales,
            }
        }).then(function mySuccess(response) {
            console.log("success", response);
        }, function myError(response) {
            console.log("error", response);
        });
    }

    $scope.get = function (lotNo) {

        $http({
            method: "POST",
            url: "/get",
            headers: {
                'Accept': "application/json, text/plain, */*",
                'Content-Type': 'application/json'
            },
            data: {
                purchaseBillNumber: lotNo
            }
        }).then(function mySuccess(response) {
            $scope.initializeForm(response.data);
        }, function myError(response) {
            console.log("error", response);
        });
    }

    $scope.print = function () {
        $scope.isPrint = !$scope.isPrint;
        //window.print();
    }

});