
/**
 * @author Francisco Bastos
 * @email bastosjavier@kubesoft.com
 * @version 1.0
 */

var kubeApp = angular.module('kubeApp');

kubeApp.controller('MoveController_', function ($scope, $state, modal, CustomerDao, MoveDao, $stateParams) {

    /**
     * Initialize variables depending on the state
     * 
     * @returns {void}
     */
    function init() {
        $scope.$parent.init();
        currentState = $state.$current.name;

        switch (currentState) {
            case 'home.ListMoves':
                $scope.paginate();
                $scope.getBalance();
                break;
            case 'home.AddMove':
                $scope.action = "Registrar";
                break;
            case 'home.EditMove':
                $scope.action = "Editar";
                MoveDao.findFull($stateParams.move_id).then(function (result) {
                    result.data.customer_nit = result.data.customer.customer_nit + ", " + result.data.customer.fullname + ", " + "Zona " + result.data.customer.zone.name;
                    $scope.move = result.data;
                });
                break;
        }
    }

    $scope.getBalance = function () {
        MoveDao.getBalance().then(function (result) {
            $scope.balance = parseFloat((result.data.totalIncomings === null) ? 0 : result.data.totalIncomings) - parseFloat((result.data.totalOutgoings === null) ? 0 : result.data.totalOutgoings);
        });
    };

    /**
     * Get all registered customers and paginate them by using "cargarListaAjax" function defined in home.js
     * 
     * @returns {void}
     */
    $scope.paginate = function () {
        $scope.cargarListaAjax('moves/paginate');
    };

    $scope.getCustomer = function ($filter) {
        return CustomerDao.getCustomerFiltered($filter).then(function (result) {
            return result.data.map(function (item) {
                return item.customer_nit + ", " + item.fullname + ", " + "Zona " + item.zone;
            });
        });
    };

    /**
     * Creates a new call script and, if success, redirects to Call scripts list view
     * 
     * @returns {void}
     */
    $scope.create = function () {

        if ($scope.formAddMove.$invalid) {
            return;
        }

        $scope.move.customer_nit = $scope.move.customer_nit.split(",")[0];

        if ($scope.action === "Editar") {
            $scope.update();
        } else {
            MoveDao.create($scope.move).then(function (result) {
                $state.go("home.ListMoves");
            });
        }
    };

    /**
     * update a call script and, if success, redirects to call scripts list view
     * 
     * @returns {void}
     */
    $scope.update = function () {
        MoveDao.update($scope.move).then(function (result) {
            $state.go("home.ListMoves");
        });
    };

    /**
     * Removes a Call Script
     * 
     * @param {Object} $callScript : Call Script to remove
     * @returns {void}
     */
    $scope.remove = function (move) {
        MoveDao.remove(move.id).then(function (result) {
            $scope.reloadTable();
        });
    };

    $scope.showConfirmRemove = function (move) {
        var modalInstance = modal.showConfirmModal('¿Está seguro que desea eliminar el movimiento?');

        modalInstance.result.then(function (data) {
            $scope.remove(move);
        });
    };

    //Initialize
    init();
});