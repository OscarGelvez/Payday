/**
 * Contiene todas las funcionalidades de gestión de usuarios del sistema
 *
 * @author Francisco Bastos
 * @email bastosjavier@kubesoft.com
 * @version 1.0
 */
var kubeApp = angular.module('kubeApp');

kubeApp.controller('UsersController', function ($scope, $state, modal, UserDao, queries, $stateParams, UserDao) {

    /**
     * Función para inicializar los objetos necesarios
     */
    function init() {
        $scope.$parent.init();
        $scope.user = {};

        $scope.user_id = $stateParams.user_id;

        $scope.datepickerOptions = {
            maxDate: "'" + Date.today().toString('yyyy-MM-dd') + "'"
        };

        currentState = $state.$current.name;

        switch (currentState) {
            case 'home.listUsers':
                $scope.paginate();
                break;
            case 'home.addUser':
                $scope.action = "Registrar";
                $scope.getRoles();
                break;
            case 'home.userEdit':
                $scope.action = "Editar";
                $scope.getRoles();
                UserDao.find($scope.user_id).then(function (result) {
                    result.data.roles_id = result.data.roles.map(function (item) {
                        return item.id;
                    });
                    delete result.data.roles;

                    $scope.user = result.data;
                });
                break;
        }
    }

    /**
     * Gets all registered users and paginate them by using "cargarListaAjax" function defined in home.js
     * 
     * @returns {void}
     */
    $scope.paginate = function () {
        $scope.cargarListaAjax('users/paginate');
    };

    /**
     *   Obtiene la lista de todos los roles
     */
    $scope.getRoles = function () {

        queries.executeRequest('GET', 'permissions/roles')
                .then(function (result) {
                    $scope.roles = result.data;
                });
    };

    /**
     * Agrega un usuario
     */
    $scope.addUser = function () {

        if ($scope.registrarUsuarioForm.$invalid) {
            return;
        }

        if ($scope.action === "Editar") {
            UserDao.update($scope.user).then(function (result) {
                $state.go("home.listUsers");
            });
        } else {
            UserDao.create($scope.user).then(function (result) {
                $state.go("home.listUsers");
            });
        }
    };

    /**
     * Edita el password del usuario actual
     */
    $scope.editPassword = function () {

        if ($scope.formChangePassword.$invalid) {
            return;
        }

        UserDao.changePassword($scope.user).then(function (result) {
            $scope.user = {};
            $scope.formChangePassword.$setPristine();
        });

    };

    /**
     * Reset form to pristine state and clean scope variable
     * 
     * @returns {void}
     */
    $scope.reset = function () {
        $scope.user = {};
        $scope.formChangePassword.$setPristine();
    };

    /**
     * Removes an user
     * 
     * @param {Object} $user : User to remove
     * @returns {void}
     */
    $scope.remove = function ($user) {
        UserDao.remove($user.id).then(function (result) {
            $scope.reloadTable();
        });
    };

    /**
     * Shows a confirm modal to delete a user, if confirmed, sends a request to remove it from database.
     * 
     * @param {Object} $user : User to delete
     * @returns {void}
     */
    $scope.showConfirmRemove = function ($user) {

        var modalInstance = modal.showConfirmModal('¿Está seguro que desea Eliminar el usuario ' + $user.name + "?");

        modalInstance.result.then(function (data) {
            $scope.remove($user);
        });
    };

    /**
     * show user's information in a modal
     * 
     * @param {type} $user : The user to show in the modal
     * @returns {void}
     */
    $scope.showDetails = function ($user) {
        $scope.showModal('assets/admin/templates/users/detail.html', 'lg', $user);
    };

    init();
});
