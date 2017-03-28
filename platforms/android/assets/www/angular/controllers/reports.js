/**
 * @author Francisco Bastos
 * @email bastosjavier@kubesoft.com
 * @version 1.0
 */
var kubeApp = angular.module('kubeApp');

kubeApp.controller('ReportController', function ($scope, $state, modal, CustomerDao, arrays, notifications, PurchaseDao, SaleDao, PRODUCTS, ReportDao, $window, APP) {

    /**
     * Initialize variables depending on the state
     * 
     * @returns {void}
     */
    function init() {


        $scope.maxDate = new Date();

        currentState = $state.$current.name;

        switch (currentState) {
            case 'home.ListCustomersBalance':
                CustomerDao.getZones().then(function (result) {
                    $scope.zones = result.data;
                });
                $scope.pagina();
                break;
            case 'home.DailyReport':
                $scope.getDailyReport(Date.today());
                break;
        }
    }

    $scope.getCustomer = function ($filter) {
        return CustomerDao.getCustomerFiltered($filter).then(function (result) {
            return result.data.map(function (item) {
                return item.customer_nit + ", " + item.fullname + ", " + "Zona " + item.zone;
            });
        });
    };

    $scope.getDailyReport = function (date) {
        date = date ? date : Date.today();
        ReportDao.getDailyReport(date).then(function (result) {
            calculateValues(result);
        });
    };

    function calculateValues(info) {

        if ($scope.report_date != undefined) {
            var isToday = Date.today().toString("yyyy-mm-dd") == $scope.report_date.toString("yyyy-mm-dd");
        }

        var dollars = (info.totalInventory['Dólares'] === undefined) ? 0 : info.totalInventory['Dólares'].total;
        var bolivars = (info.totalInventory['Bolívares'] === undefined) ? 0 : info.totalInventory['Bolívares'].total;
        var tpcb = (info.tpc['Bolívares'] === undefined) ? 0 : info.tpc['Bolívares'].tpc;
        var tpcd = (info.tpc['Dólares'] === undefined) ? 0 : info.tpc['Dólares'].tpc;
//        var tpvb = (info.tpv['Bolívares'] === undefined) ? 0 : info.tpv['Bolívares'].tpv;
//        var tpvd = (info.tpv['Dólares'] === undefined) ? 0 : info.tpv['Dólares'].tpv;
        var incomingMoves = (info.totalMoves['Entrada'] === undefined) ? 0 : info.totalMoves['Entrada'].total;
        var outgoingMoves = (info.totalMoves['Salida'] === undefined) ? 0 : info.totalMoves['Salida'].total;
//        var incomingTotalMoves = (info.totalTotalMoves['Entrada'] === undefined) ? 0 : info.totalTotalMoves['Entrada'].total;
//        var outgoingTotalMoves = (info.totalTotalMoves['Salida'] === undefined) ? 0 : info.totalTotalMoves['Salida'].total;
        var totalBolivarsSalesInPesos = (info.totalOperations['ventaBolívares'] === undefined) ? 0 : info.totalOperations['ventaBolívares'].totalPesos;
        var totalDollarsSalesInPesos = (info.totalOperations['ventaDólares'] === undefined) ? 0 : info.totalOperations['ventaDólares'].totalPesos;
        var totalBolivarsPurchasesInPesos = (info.totalOperations['compraBolívares'] === undefined) ? 0 : info.totalOperations['compraBolívares'].totalPesos;
        var totalDollarsPurchasesInPesos = (info.totalOperations['compraDólares'] === undefined) ? 0 : info.totalOperations['compraDólares'].totalPesos;

        var totalBolivarsSales = (info.totalOperations['ventaBolívares'] === undefined) ? 0 : info.totalOperations['ventaBolívares'].total;
        var totalDollarsSales = (info.totalOperations['ventaDólares'] === undefined) ? 0 : info.totalOperations['ventaDólares'].total;
        var totalBolivarsPurchases = (info.totalOperations['compraBolívares'] === undefined) ? 0 : info.totalOperations['compraBolívares'].total;
        var totalDollarsPurchases = (info.totalOperations['compraDólares'] === undefined) ? 0 : info.totalOperations['compraDólares'].total;

//        var bolivarProfitableness = (parseFloat(tpvb) - parseFloat(tpcb)) * totalBolivarsSales;
//        var dollarProfitableness = (parseFloat(tpvd) - parseFloat(tpcd)) * totalDollarsSales;

        //cambios 30/01/2015
//        var tpcbd = (info.tpcd['Bolívares'] === undefined) ? 0 : info.tpcd['Bolívares'].tpc;
//        var tpcdd = (info.tpcd['Dólares'] === undefined) ? 0 : info.tpcd['Dólares'].tpc;
//        var tpvbd = (info.tpvd['Bolívares'] === undefined) ? 0 : info.tpvd['Bolívares'].tpv;
//        var tpvdd = (info.tpvd['Dólares'] === undefined) ? 0 : info.tpvd['Dólares'].tpv;

//        var totalBolivarsSalesDay = (info.totalDayOperations['ventaBolívares'] === undefined) ? 0 : info.totalDayOperations['ventaBolívares'].total;
//        var totalDollarsSalesDay = (info.totalDayOperations['ventaDólares'] === undefined) ? 0 : info.totalDayOperations['ventaDólares'].total;
//        var bolivarProfitablenessDay = (parseFloat(tpvbd) - parseFloat(tpcbd)) * totalBolivarsSalesDay;
//        var dollarProfitablenessDay = (parseFloat(tpvdd) - parseFloat(tpcdd)) * totalDollarsSalesDay;

        $scope.BolivarsInventory = bolivars * tpcb;
        $scope.DollarsInventory = dollars * tpcd;
        $scope.Cash = parseFloat(incomingMoves) - parseFloat(outgoingMoves);
        $scope.totalUtilityMoves = parseInt(info.totalUtilityMoves);

        $scope.totalDayUtility = parseFloat(info.todayCurrentUtility);
        $scope.totalUtility = ((info.totalUtility == null) ? 0 : parseFloat(info.totalUtility)) + $scope.totalDayUtility;

        $scope.notLiquidatedUtility = parseFloat(info.notLiquidatedUtility) + parseFloat($scope.totalDayUtility);

        $scope.totalInventory = $scope.Cash + $scope.BolivarsInventory + $scope.DollarsInventory;
        $scope.accountsReceivable = (parseFloat(totalBolivarsSales) * tpcb) + (parseFloat(totalDollarsSales) * tpcd) - parseFloat(incomingMoves);
        $scope.accountsPayable = (parseFloat(totalBolivarsPurchases) * tpcb) + (parseFloat(totalDollarsPurchases) * tpcd) - parseFloat(outgoingMoves) + $scope.totalUtilityMoves;
        $scope.totalCashUtility = parseFloat(info.notLiquidatedUtility);

        if (isToday) {
            $scope.accountsPayable += $scope.totalDayUtility;
            $scope.totalCashUtility += $scope.totalDayUtility;
        }

//        $scope.totalUtility = bolivarProfitableness + dollarProfitableness;


//        $scope.totalUtility = parseFloat(info.totalUtility) + parseFloat($scope.totalDayUtility);
        //cambios 30/01/2015
//        $scope.totalDayUtility = bolivarProfitablenessDay + dollarProfitablenessDay;
    }

    $scope.paginateBalance = function () {
        $scope.cargarListaAjax('reports/paginatebalance');
    };

    $scope.getInfoReport = function () {

        var purchaseCopy = angular.copy($scope.report);

        purchaseCopy.customer_nit = purchaseCopy.customer_nit.split(",")[0];

        ReportDao.getInfoReport(purchaseCopy).then(function (result) {
            $scope.operations = result.data;
            $scope.previousBalance = result.previous_balance;
            $scope.moves = result.moves;

            calculateOperations();
        });
    };

    $scope.pagina = function () {
        $scope.cargarListaAjaxx('reports/paginatebalance');
    };

    function calculateOperations() {

        $scope.totalIncome = 0;
        $scope.totalOutcome = 0;
        $scope.totalIncomingMoves = 0;
        $scope.totalOutgoingMoves = 0;

        for (i = 0; i < $scope.operations.length; i++) {
            if ($scope.operations[i].type === 'venta') {
                $scope.totalIncome += parseFloat($scope.operations[i].amount_in_pesos);
            } else {
                $scope.totalOutcome += parseFloat($scope.operations[i].amount_in_pesos);
            }
        }

        for (j = 0; j < $scope.moves.length; j++) {
            if ($scope.moves[j].type === 'Salida') {
                $scope.totalIncomingMoves += parseFloat($scope.moves[j].amount);
            } else {
                $scope.totalOutgoingMoves += parseFloat($scope.moves[j].amount);
            }
        }

    }

    $scope.export = function () {

        var purchaseCopy = angular.copy($scope.report);

        purchaseCopy.customer_nit = purchaseCopy.customer_nit.split(",")[0];

        ReportDao.export(purchaseCopy).then(function (result) {
            $window.open(APP.FILES_URL + result.url);
        });
    };


    $scope.exportBalance = function () {

        var data = {};
        data.filtroTexto = $scope.$parent.filtroTexto;
        data.type = $scope.$parent.type;
        data.zone = $scope.$parent.zone;

        ReportDao.exportBalance(data).then(function (result) {
            $window.open(APP.FILES_URL + result.url);
        });
    };

    $scope.calculateBalance = function (c) {
        return (parseFloat(c.totalSales) - parseFloat(c.totalPurchases) - parseFloat(c.totalIncomings) + parseFloat(c.totalOutgoings));
    };

    $scope.addDispatchAccount = function ($account) {

        $scope.purchase.dispatchAccounts.push($account);
    };

    $scope.getDocumentType = function (id) {
        return arrays.getItemById($scope.documentTypes, id);
    };

    $scope.enableAddDispatchAccounts = function () {
        $scope.addDispatchAccountsEnabled = true;
    };

    /**
     * Creates a new call script and, if success, redirects to Call scripts list view
     * 
     * @returns {void}
     */
    $scope.create = function () {

        if ($scope.formAddPurchase.$invalid) {
            return;
        }

        if (calculateBalance() < $scope.purchase.amount) {
            notifications.showError("El monto ingresado en las cuentas de despacho es inferior al monto de la compra");
            return;
        }

        PurchaseDao.create($scope.purchase).then(function (result) {
//            $state.go("home.ListCustomers");
        });
    };

    /**
     * update a call script and, if success, redirects to call scripts list view
     * 
     * @returns {void}
     */
    $scope.update = function () {
        CallScriptDao.update($scope.callScript).then(function (result) {
            $state.go("home.callScriptList", {ally_id: $scope.ally_id, ally_name: $scope.ally_name});
        });
    };

    /**
     * Removes a Call Script
     * 
     * @param {Object} $callScript : Call Script to remove
     * @returns {void}
     */
    $scope.remove = function ($callScript) {
        CallScriptDao.remove($callScript.id).then(function (result) {
            $scope.reloadTable();
        });
    };

    /**
     * Shows a confirm modal to delete a call script, if confirmed, sends a request to delete it.
     * 
     * @param {Object} $callScript : Call Script to delete
     * @returns {undefined}
     */
    $scope.showConfirmRemove = function ($callScript) {
        var modalInstance = modal.showModal('assets/admin/templates/global/confirm.html');

        modalInstance.result.then(function (data) {
            $scope.remove($callScript);
        });
    };

    //Initialize
    init();
});
