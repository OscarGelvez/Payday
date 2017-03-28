/**
 * @author Francisco Bastos
 * @email bastosjavier@kubesoft.com
 * @version 1.0
 */
var kubeApp = angular.module('kubeApp');

kubeApp.controller('AccountController', function ($scope, $state, modal, AccountDao, $stateParams) {

    /**
     * Initialize variables depending on the state
     * 
     * @returns {void}
     */
    function init() {
        
        $scope.$parent.init();
        currentState = $state.$current.name;

        switch (currentState) {
            case 'home.ListAccounts':
                $scope.paginate();
                break;
            case 'home.AddAccount':
                $scope.action = "Registrar";
                AccountDao.getProducts().then(function (result) {
                    $scope.products = result.data;
                });
                break;
            case 'home.ListTransactions':
                $scope.account_id = $stateParams.account_id;
                $scope.paginateTransactions($scope.account_id);
                break;
        }
    }
    
    $scope.paginateTransactions = function ($account_id) {
        $scope.cargarListaAjax('transactions/paginatetransactions', $account_id);
    };

    /**
     * Get all registered customers and paginate them by using "cargarListaAjax" function defined in home.js
     * 
     * @returns {void}
     */
    $scope.paginate = function () {
        $scope.cargarListaAjax('accounts/paginate');
    };

    /**
     * Creates a new call script and, if success, redirects to Call scripts list view
     * 
     * @returns {void}
     */
    $scope.create = function () {

        if ($scope.formAddAccount.$invalid) {
            return;
        }

        if ($scope.action === "Editar") {
            $scope.update();
        } else {
            AccountDao.create($scope.account).then(function (result) {
                $state.go("home.ListAccounts");
            });
        }
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
