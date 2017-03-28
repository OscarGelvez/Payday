/**
 * @author Francisco Bastos
 * @email bastosjavier@kubesoft.com
 * @version 1.0
 */
var kubeApp = angular.module('kubeApp');

kubeApp.controller('CustomerController', function ($scope, $state, modal, CustomerDao, $stateParams) {

    /**
     * Initialize variables depending on the state
     * 
     * @returns {void}
     */
    function init() {

        currentState = $state.$current.name;

        switch (currentState) {
            case 'home.ListCustomers':
                $scope.paginate();
                break;
            case 'home.AddCustomer':
                $scope.action = "Registrar";
                initCustomersState();
                break;
            case 'home.EditCustomer':
                $scope.action = "Editar";
                initCustomersState();
                CustomerDao.find($stateParams.customer_id).then(function (result) {
                    $scope.customer = result.data;
                });
                break;
        }
    }

    /**
     * Get all registered customers and paginate them by using "cargarListaAjax" function defined in home.js
     * 
     * @returns {void}
     */
    $scope.paginate = function () {
        $scope.cargarListaAjax('customers/paginate');
    };

    /**
     * Creates a new call script and, if success, redirects to Call scripts list view
     * 
     * @returns {void}
     */
    $scope.create = function () {

        if ($scope.formAddCustomer.$invalid) {
            return;
        }

        if ($scope.action === "Editar") {
            $scope.update();
        } else {
            CustomerDao.create($scope.customer).then(function (result) {
                $state.go("home.ListCustomers");
            });
        }
    };

    /**
     * update a call script and, if success, redirects to call scripts list view
     * 
     * @returns {void}
     */
    $scope.update = function () {
        CustomerDao.update($scope.customer).then(function (result) {
            $state.go("home.ListCustomers");
        });
    };

    /**
     * Removes a Call Script
     * 
     * @param {Object} $customer : Call Script to remove
     * @returns {void}
     */
    $scope.remove = function ($customer) {
        CustomerDao.remove($customer.id).then(function (result) {
            $scope.reloadTable();
        });
    };

    /**
     * Shows a confirm modal to delete a call script, if confirmed, sends a request to delete it.
     * 
     * @param {Object} $customer : Call Script to delete
     * @returns {undefined}
     */
    $scope.showConfirmRemove = function ($customer) {
        var modalInstance = modal.showConfirmModal('¿Está seguro que desea eliminar el cliente ' + $customer.fullname + "?");

        modalInstance.result.then(function (data) {
            $scope.remove($customer);
        });
    };

    function initCustomersState() {
        CustomerDao.getZones().then(function (result) {
            $scope.zones = result.data;
        });
    }

    //Initialize
    init();
});
