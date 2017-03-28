/**
 * @author Francisco Bastos
 * @email bastosjavier@kubesoft.com
 * @version 1.0
 */
var kubeApp = angular.module('kubeApp');

kubeApp.controller('DispatchController', function ($scope, $state, UserDao, modal, notifications, $stateParams, DispatchDao, arrays, AccountDao) {

    /**
     * Initialize variables depending on the state
     * 
     * @returns {void}
     */
    function init() {

        $scope.dispatch_account_id = $stateParams.dispatch_account_id;

        $scope.dispatchAccount = {};
        $scope.dispatch = {};
        $scope.dispatch.dispatch_accounts = [];

        currentState = $state.$current.name;

        switch (currentState) {
            case 'home.ListDispatchAccounts':
                $scope.paginateFiltered();
                break;
            case 'home.DispatchAccount':
                DispatchDao.findFull($scope.dispatch_account_id).then(function (result) {
                    result.data.amount = result.data.amount.toString();
                    AccountDao.getByProduct(result.data.sale.product.name).then(function (result) {
                        $scope.accounts = result.data;
                    });

                    DispatchDao.getDispatchingStates().then(function (res) {
                        $scope.states = res.data;
                        $scope.dispatchAccount = result.data;
                        if ($scope.dispatchAccount.transactions === undefined) {
                            $scope.dispatchAccount.transactions = [];
                        } else {
                            $scope.addTransactionsEnabled = true;
                            for (i = 0; i < $scope.dispatchAccount.transactions.length; i++) {
                                $scope.dispatchAccount.transactions[i].amount = parseFloat($scope.dispatchAccount.transactions[i].amount);
                                $scope.dispatchAccount.transactions[i].transaction_number = parseInt($scope.dispatchAccount.transactions[i].transaction_number);
                                item = arrays.getIndexById($scope.states, $scope.dispatchAccount.transactions[i].state_id);
                                if (item.name === undefined) {
                                    $scope.dispatchAccount.transactions[i].alreadyLoaded = true;
                                } else if (item.name === "Cargada") {
                                    $scope.dispatchAccount.transactions[i].alreadyLoaded = true;
                                }
                            }
                        }

                        $scope.dispatchAccount.id = $scope.dispatch_account_id;
                    });
                });
                break;
            case 'home.TransferDispatchs':
                $scope.paginateNoDispatchedAccounts();
                UserDao.getDispatchUsers().then(function (result) {
                    $scope.dispatchUsers = result.data;
                });
                break;
        }
    }

    $scope.transferDispatchs = function () {

        if ($scope.formTransferDispatchs.$invalid) {
            return;
        }

        DispatchDao.transferDispatchs($scope.dispatch).then(function (result) {
            $scope.dispatch.dispatch_accounts = [];
            $scope.reloadTable();
        });
    };

    $scope.getState = function ($transaction) {

        if ($transaction.state_id === undefined) {
            return true;
        }

        $stateTransaction = arrays.getItemById($scope.states, $transaction.state_id);
        return $stateTransaction;

    };

    /**
     * Get all registered customers and paginate them by using "cargarListaAjax" function defined in home.js
     * 
     * @returns {void}
     */
    $scope.paginate = function () {
        $scope.cargarListaAjax('dispatchs/paginate');
    };

    $scope.paginateNoDispatchedAccounts = function () {
        $scope.cargarListaAjax('dispatchs/paginatenodispatchedaccounts');
    };

    $scope.paginateFiltered = function () {
        $scope.cargarListaAjax('dispatchs/paginatefiltered');
    };

    $scope.enableAddTransactions = function () {
        $scope.addTransactionsEnabled = true;
    };

    $scope.addNewTransaction = function () {

        var transaction = {};
        $scope.dispatchAccount.transactions.push(transaction);
    };

    /**
     * Creates a new call script and, if success, redirects to Call scripts list view
     * 
     * @returns {void}
     */
    $scope.create = function () {

        if ($scope.formDispatchAccount.$invalid) {
            return;
        }

        balance = calculateBalance();

        if (balance > $scope.dispatchAccount.amount) {
            notifications.showError("La suma de las transacciones supera el valor del despacho (" + balance + ")");
            return;
        } else if (balance < $scope.dispatchAccount.amount) {
            notifications.showError("La suma de las transacciones es inferior al valor del despacho (" + balance + ")");
            return;
        }

        DispatchDao.create($scope.dispatchAccount).then(function (result) {
            $state.go("home.ListDispatchAccounts");
        });
    };

    $scope.getBalance = function () {
        if ($scope.dispatchAccount.amount === undefined) {
            return 0;
        }
        return (parseFloat($scope.dispatchAccount.amount) - calculateBalance());
    };

    $scope.hasRejectedTransactions = function () {

        if ($scope.dispatchAccount.transactions === undefined) {
            return false;
        }

        if ($scope.dispatchAccount.transactions.length === 0) {
            return false;
        }

        $scope.rejectedTransactions = false;

        angular.forEach($scope.dispatchAccount.transactions, function (value) {

            if (value.state_id === undefined) {

            } else {
                state = arrays.getItemById($scope.states, value.state_id);
                if (state === null) {
                } else {
                    if (state.name === "Rechazada") {
                        $scope.rejectedTransactions = true;
                    }
                }
            }
        });

        return $scope.rejectedTransactions;

//        for (i = 0; i < $scope.dispatchAccount.transactions.length; i++) {
//
//            if ($scope.dispatchAccount.transactions[i].state_id === undefined) {
//                continue;
//            }
//
//            state = arrays.getItemById($scope.states, $scope.dispatchAccount.transactions[i].state_id);
//            if (state === null) {
//                continue;
//            }
//
//            if (state.name === "Rechazada") {
//                $scope.rejectedTransactions = true;
//            }
//        }
//
//        return $scope.rejectedTransactions;
    };


    $scope.removeField = function (index) {
        $scope.dispatchAccount.transactions.splice(index, 1);
    };

    function calculateBalance() {

        var balance = 0;

        for (i = 0; i < $scope.dispatchAccount.transactions.length; i++) {

            var transaction = $scope.dispatchAccount.transactions[i];

            if (transaction.amount !== undefined) {
                balance += parseFloat(transaction.amount);
            }
        }

        return balance;
    }

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
