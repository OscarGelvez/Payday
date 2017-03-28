/**
 * @author Francisco Bastos
 * @email bastosjavier@kubesoft.com
 * @version 1.0
 */
var kubeApp = angular.module('kubeApp');

kubeApp.controller('TransactionController', function ($scope, $state, modal, TransactionDao, $stateParams, AccountDao) {

    /**
     * Initialize variables depending on the state
     * 
     * @returns {void}
     */
    function init() {

        $scope.confirm = {};
        currentState = $state.$current.name;
        $scope.dispatch_account_id = $stateParams.account_id;

        switch (currentState) {
            case 'home.ConfirmTransactions':
                AccountDao.find($scope.dispatch_account_id).then(function (result) {
                    $scope.account = result.data;
                });
                $scope.paginate();
                break;
            case 'home.ListTransactionsAccounts':
                $scope.paginateWithTransactions();
                break;
            case 'home.ListTransactions':
                $scope.paginateTransactions();
                break;
        }
    }

    $scope.getAccount = function (filter) {
        return AccountDao.getAccountFiltered(filter).then(function (result) {
            return result.data.map(function (item) {
                return item.account_number + ", " + item.name + ", " + item.bank + ", " + item.product;
            });
        });
    };

    /**
     * Carga un archivo que contiene los datos de fiscalización y
     * muestra en pantalla los resultados
     * 
     * @returns {void}
     */
    $scope.getSupervisingResults = function () {

        if ($scope.formSuperviseTransactions.$invalid || $scope.file == "") {
            return;
        }
        
        copy = angular.copy($scope.transaction);
        copy.account_number = copy.account_id.split(",")[0];

        AccountDao.supervise($scope.file, copy).then(function (result) {
            $scope.missing_transactions = result.data.missing_transactions;
            console.log($scope.missing_transactions.length); // TODO : Delete this line
            $scope.unregistered_transactions = result.data.unregistered_transactions;
            console.log($scope.unregistered_transactions.length); // TODO : Delete this line
            $scope.different_transactions = result.data.different_transactions.map(function (item) {
                item.amount = parseFloat(item.amount);
                item.amount_excel = parseFloat(item.amount_excel);
                return item;
            });

            console.log($scope.different_transactions.length); // TODO : Delete this line
        });
    };

    $scope.paginateTransactions = function () {
        $scope.cargarListaAjax('transactions/paginatetransactions');
    };

    /**
     * Get all registered customers and paginate them by using "cargarListaAjax" function defined in home.js
     * 
     * @returns {void}
     */
    $scope.paginate = function () {
        $scope.cargarListaAjax('transactions/paginateloadedtransactions', $scope.dispatch_account_id);
    };

    $scope.paginateWithTransactions = function () {
        $scope.cargarListaAjax('accounts/paginatewithtransactions');
    };

    /**
     * Creates a new call script and, if success, redirects to Call scripts list view
     * 
     * @returns {void}
     */
    $scope.confirmTransactions = function () {

        if ($scope.confirm.transactions === undefined) {
            return;
        }

        var modalInstance = modal.showConfirmModal('¿Está Seguro que desea confirmar las transacciones seleccionadas?');

        modalInstance.result.then(function (data) {
            TransactionDao.confirmTransactions($scope.confirm).then(function (result) {
                $scope.transactions = [];
                $scope.$parent.reloadTable();
            });
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
