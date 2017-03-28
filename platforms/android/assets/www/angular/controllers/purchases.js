/**
 * @author Francisco Bastos
 * @email bastosjavier@kubesoft.com
 * @version 1.0
 */
var kubeApp = angular.module('kubeApp');

kubeApp.controller('PurchaseController', function ($scope, $state, modal, CustomerDao, arrays, notifications, PurchaseDao, SaleDao, PRODUCTS, AccountDao) {

    /**
     * Initialize variables depending on the state
     * 
     * @returns {void}
     */
    function init() {
        $scope.$parent.init();
        currentState = $state.$current.name;
        $scope.purchase = {};
        $scope.purchase.dispatchAccounts = [];

        switch (currentState) {
            case 'home.AddBolivarsPurchase':
                $scope.product = PRODUCTS.BOLIVARS;
                SaleDao.getProduct($scope.product).then(function (result) {
                    $scope.purchase.product_id = result.data.id;
                });
                CustomerDao.getDocumentTypes().then(function (result) {
                    $scope.documentTypes = result.data;
                });
                AccountDao.getByProduct($scope.product).then(function (result) {
                    $scope.accounts = result.data;
                });
                break;
            case 'home.AddDollarsPurchase':
                $scope.product = PRODUCTS.DOLLARS;
                SaleDao.getProduct($scope.product).then(function (result) {
                    $scope.purchase.product_id = result.data.id;
                });
                CustomerDao.getDocumentTypes().then(function (result) {
                    $scope.documentTypes = result.data;
                });
                AccountDao.getByProduct($scope.product).then(function (result) {
                    $scope.accounts = result.data;
                });
                break;
            case 'home.ListPurchases':
                $scope.paginate();
                break;
        }
    }

    $scope.removeField = function (index) {
        $scope.purchase.dispatchAccounts.splice(index, 1);
    };

    $scope.getCustomer = function ($filter) {
        return CustomerDao.getCustomerFiltered($filter).then(function (result) {
            return result.data.map(function (item) {
                return item.customer_nit + ", " + item.fullname + ", " + "Zona " + item.zone;
            });
        });
    };

    $scope.getAccountName = function ($account) {

        item = arrays.getItemById($scope.accounts, $account.account_id);
        $account.account_name = item.name;
        if (item.bank !== undefined && item.bank !== null) {
            $account.bank_name = item.bank.name;
        } else {
            $account.bank_name = "Desconocido";
        }
    };

    $scope.paginate = function () {
        $scope.cargarListaAjax('purchases/paginate');
    };

    $scope.showAddDispatchAccount = function ($data) {
        var modalInstance = modal.showModal('html/purchases/templates/addDispatchAccount.html', null, $data);

        modalInstance.result.then(function (data) {

            var balance = calculateBalance();

            if ((balance + data.amount) > $scope.purchase.amount) {
                notifications.showError("El monto ingresado supera el valor de la compra (" + $scope.purchase.amount + ")");
                $scope.showAddDispatchAccount(data);
            } else {
                $scope.addDispatchAccount(data);
            }
        });
    };

    $scope.addNewDispatchAccount = function () {
        var dispatchAccount = {};
        $scope.purchase.dispatchAccounts.push(dispatchAccount);
    };

    $scope.findAccount = function ($account) {

        if ($account.account_number === undefined) {
            return;
        }

        $bankCode = $account.account_number.toString().substring(0, 4);

        AccountDao.getAccount($account.account_number).then(function (result) {

            if (result.data !== null) {
                $account.bank_name = result.data.name;
            } else {
                $account.bank_name = "desconocido";
            }
        });
    };

    function calculateBalance() {

        var balance = 0;

        for (i = 0; i < $scope.purchase.dispatchAccounts.length; i++) {

            var dispatchAccount = $scope.purchase.dispatchAccounts[i];
            if (dispatchAccount.amount !== undefined) {
                balance += parseFloat(dispatchAccount.amount);
            }
        }

        return balance;
    }

    $scope.addDispatchAccount = function ($account) {

        $bankCode = $account.account_number.substring(0, 4);

        AccountDao.getAccount($account.account_number).then(function (result) {

            if (result.data === null) {
                notifications.showError("No existe la cuenta ingresada");
                $scope.showAddDispatchAccount($account);
            } else {
                $account.account_name = result.data.name;
                AccountDao.getBank($bankCode).then(function (result) {
                    $account.bank_name = result.data.name;
                    $scope.purchase.dispatchAccounts.push($account);
                });
            }
        });
    };

    $scope.getBalance = function () {
        if ($scope.purchase.amount === undefined) {
            return 0;
        }
        return (parseFloat($scope.purchase.amount) - calculateBalance());
    };

    $scope.getDocumentType = function (id) {
        return arrays.getItemById($scope.documentTypes, id);
    };

    $scope.enableAddDispatchAccounts = function () {
        $scope.addDispatchAccountsEnabled = true;
        $scope.addNewDispatchAccount();
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

        balance = calculateBalance();

        if (balance < $scope.purchase.amount) {
            notifications.showError("El monto ingresado en las cuentas de despacho es inferior al monto de la compra");
            return;
        } else if (balance > $scope.purchase.amount) {
            notifications.showError("El monto ingresado en las cuentas de despacho es mayor al monto de la compra");
            return;
        }

        $scope.purchase.customer_nit = $scope.purchase.customer_nit.split(",")[0];

        PurchaseDao.create($scope.purchase).then(function (result) {
            $state.go("home.ListPurchases");
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
