/**
 * @author Francisco Bastos
 * @email bastosjavier@kubesoft.com
 * @version 1.0
 */
var kubeApp = angular.module('kubeApp');

kubeApp.controller('UtilityController', function ($rootScope, $scope, $state, modal, UtilityDao, arrays, $stateParams, PurchaseDao, CustomerDao, $filter, ReportDao, $window, APP) {

    /**
     * Initialize variables depending on the state
     * 
     * @returns {void}
     */
    function init() {

        currentState = $state.$current.name;
        $scope.utility = {};
        $scope.utility.utilities = [];

        switch (currentState) {
            case 'home.ListUtilities':
                $scope.getUtilities();
                $scope.getCustomers();
                $scope.selectedCustomers = [];
                break;
            case 'home.ListLiquidations':
                $scope.paginateLiquidations();
                break;
            case 'home.PayUtilities':
                $scope.getLiquidatedUtilities();
                break;
            case 'home.AddPayment':
                if (correctUrl()) {
                    var customer_id = $stateParams.customer_id;
                    CustomerDao.getUtilitiesBalance(customer_id).then(function (result) {
                        $scope.utility = result.data;
                        $scope.utility.balance = $scope.utility.utilities - $scope.utility.payments;
                        $scope.utility.newBalance = $scope.utility.balance;
                        $scope.utility.customer_id = customer_id;
                    });
                } else {
                    $state.go("home.404");
                }
                break;
        }
    }

    $scope.getLiquidatedUtilities = function () {
        $scope.cargarListaAjax('utilities/liquidatedutilities');
    };

    $scope.paginateLiquidations = function () {
        $scope.cargarListaAjax('utilities/paginateliquidations');
    };

    $scope.getUtilities = function (start, end) {
        end = end ? end : Date.today();
        UtilityDao.getUtilitiesReport(start, end).then(function (result) {
            $scope.utilities = result.data;
        });
    };

    $scope.getCustomer = function ($filter) {
        return CustomerDao.getCustomerFiltered($filter).then(function (result) {
            return result.data.map(function (item) {
                return item.customer_nit + ", " + item.fullname + ", " + item.zone;
            });
        });
    };

    /**
     * Obtiene todos los clientes del sistema y los vincula a una variable del contexto actual
     * 
     * @returns {void}
     */
    $scope.getCustomers = function () {
        return CustomerDao.getAll().then(function (result) {
            $scope.customers = result.data;
        });
    };

    $scope.create = function () {

        if ($scope.formLiquidateUtilities.$invalid) {
            return;
        }

        UtilityDao.liquidate($scope.utility).then(function (result) {
            $scope.utility = {};
            $scope.utility.utilities = [];
            $scope.formLiquidateUtilities.$setPristine();
            $scope.getUtilities($scope.$parent.fechaInicio, $scope.$parent.fechaFin);
        });
    };

    $scope.getLiquidated = function (u) {
        return (u.liquidated == true) ? "SI" : "NO";
    };

    $scope.maxDate = new Date();

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
     * Shows a confirm modal to delete a call script, if confirmed, sends a request to delete it.
     * 
     * @param {Object} $callScript : Call Script to delete
     * @returns {undefined}
     */
    $scope.showConfirmLiquidate = function ($customer) {
        var modalInstance = modal.showConfirmModal('¿Está seguro que desea liquidar las utilidades seleccionadas?');

        modalInstance.result.then(function (data) {
            $scope.create();
        });
    };

    /**
     * Agrega un cliente seleccionado a la lista de clientes de liquidación
     * 
     * @param {Object} $scope.selectedCustomer : el cliente a agregar
     * @returns {void}
     */
    $scope.addCustomer = function () {

        if ($scope.selectedCustomer == undefined) {
            return;
        }

        var customerArray = $scope.selectedCustomer.split(",");
        var customerObject = {};

        customerObject.customer_nit = customerArray[0];
        customerObject.fullname = customerArray[1];
        customerObject.zone = customerArray[2];

        if (customerAlreadyAdded(customerObject)) {
            toastr.warning("El cliente seleccionado ya está en la lista", "ADVERTENCIA");
        } else {
            $scope.selectedCustomers.push(customerObject);
            $scope.selectedCustomer = undefined;
        }
    };

    /**
     * Verifica que un cliente dado se encuentre en la lista de clientes de liquidación
     * 
     * @param {Object} customer : el cliente a validar
     * @returns {boolean} : true si fue encontrado, false en otro caso
     */
    function customerAlreadyAdded(customer) {

        var alreadyAdded = false;
        angular.forEach($scope.selectedCustomers, function (value, key) {
            if (customer.customer_nit == value.customer_nit) {
                alreadyAdded = true;
            }
        });

        return alreadyAdded;
    }

    /**
     * Suma los valores de todas las utilidades seleccionadas y asocia el resultado a una variable en el contexto actual
     * @returns {void}
     */
    $scope.getBalance = function () {

        var balance = 0;
        angular.forEach($scope.utility.utilities, function (value, key) {
            balance += parseFloat(value.amount);
        });

        $scope.balance = balance;
    };

    /**
     * Calcula el saldo que falta por asignar a los socios seleccionados y lo asigna a una variable del contexto actual
     * @returns {void}
     */
    $scope.calculateRemainingBalance = function () {

        var valuePaid = 0;
        angular.forEach($scope.selectedCustomers, function (value) {
            var amount = value.amount;
            if (amount != undefined && !isNaN(amount)) {
                valuePaid += parseFloat(value.amount);
            }
        });
        $scope.paid = valuePaid;
    };

    $scope.liquidate = function () {

        if (parseInt($scope.balance) - parseInt($scope.paid) != 0) {
            toastr.warning("El total a liquidar no corresponde con la suma de los valores ingresados a los clientes", "ADVERTENCIA");
            return;
        }

        var utilities = $scope.utility.utilities;
        var customers = $scope.selectedCustomers;

        var data = {};
        data.utilities = utilities;
        data.customers = customers;

        if ($scope.formLiquidateUtilities.$invalid) {
            return;
        }

        UtilityDao.liquidate(data).then(function (result) {
            $scope.utility = {};
            $scope.utility.utilities = [];
            $scope.selectedCustomers = [];
            $scope.formLiquidateUtilities.$setPristine();
            $scope.getUtilities($scope.$parent.fechaInicio, $scope.$parent.fechaFin);
        });
    };

    $scope.zeroBalance = function () {
        var zero = (parseInt($scope.balance) - parseInt($scope.paid));
        return (zero !== 0);
    };

    /**
     * Verifica que la url contenga los parámetros requeridos
     * @returns {boolean} true si la url es correcta, false en cualquier otro caso
     */
    function correctUrl() {
        var customer_id = $stateParams.customer_id;
        if (customer_id === undefined || isNaN(customer_id)) {
            return false;
        }
        return true;
    }

    $scope.updateNewBalance = function () {
        var newBalance = $scope.utility.balance - $scope.utility.amount;
        if (isNaN(newBalance)) {
            return;
        }

        $scope.utility.newBalance = newBalance;
    };

    /**
     * agrega un nuevo pago a la utilidad
     * @returns {void}
     */
    $scope.addPayment = function () {
        if ($scope.formAddPayment.$invalid) {
            return;
        }

        UtilityDao.addPayment($scope.utility).then(function (result) {
            $state.go("home.PayUtilities");
        });
    };

    /**
     * Muestra un modal con la información de los pagos y utilidades asociadas a él.
     * @param {Object} item : el cliente asociado
     * @returns {void}
     */
    $scope.getCustomerDetails = function (item) {

        CustomerDao.findUtilitiesInfo(item.customerId).then(function (result) {
            $scope.customer = result.data;
        });
    };

    $scope.removeCustomer = function (index) {
        $scope.selectedCustomers.splice(index, 1);
        $scope.calculateRemainingBalance();
    };

    /**
     * Shows a confirm modal to delete a payment, if confirmed, sends a request to delete it.
     * 
     * @param {Object} $callScript : Call Script to delete
     * @returns {undefined}
     */
    $scope.showConfirmRemove = function (payment) {
        var modalInstance = modal.showConfirmModal('¿Está seguro que desea eliminar el pago seleccionado? (' + $filter('currency')(payment.amount, "$ ", 2) + ')', $scope);
        modalInstance.result.then(function (data) {
            $scope.removePayment(payment);
        });
    };

    $scope.removePayment = function (payment) {
        UtilityDao.removePayment(payment.id).then(function () {
            var index = $scope.customer.payments.indexOf(payment);
            if (index > -1) {
                $scope.customer.payments.splice(index, 1);
                $scope.reloadTable();
            }
        });
    };

    $scope.getLiquidationDetails = function (liquidation) {
        UtilityDao.getLiquidationDetails(liquidation.id).then(function (result) {
            $scope.liquidation = result.data;
        });
    };

    $scope.showConfirmRemoveLiquidation = function (liquidation) {
        var modalInstance = modal.showConfirmModal('¿Está seguro que desea revertir la liquidación seleccionada? \n(' + $filter('currency')(liquidation.amount, "$ ", 2) + ')', $scope);
        modalInstance.result.then(function (data) {
            $scope.removeLiquidation(liquidation);
        });
    };

    $scope.removeLiquidation = function (liquidation) {
        UtilityDao.removeLiquidation(liquidation.id).then(function () {
            $scope.reloadTable();
        });
    };

    //Initialize
    init();
});
