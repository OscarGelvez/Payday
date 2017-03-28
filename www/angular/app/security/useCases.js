/**
 * Contiene todas las funcionalidades de gestión de casos de uso
 *
 * @author Francisco Bastos
 * @email bastosjavier@kubesoft.com
 * @version 1.0
 */
var kubeApp = angular.module('kubeApp');

kubeApp.controller('UseCasesController', function ($scope, queries, arrays) {

    /**
     * inicializa los objetos necesarios
     */
    function initialize() {
        $scope.useCase = {};
        $scope.newPermissions = [];
        getModules();
    }

    /**
     *  Obtiene todos los modulos del sistema
     */
    function getModules() {

        queries.executeRequest('GET', 'permissions/modules')
            .then(function (result) {
                if (result.success) {
                    $scope.modules = result.data;
                }
            });
    }

    /**
     * Obtiene todos los casos de uso de un módulo dado
     */
    $scope.getUseCases = function (source) {

        $params = {
            module_id: source.id
        };

        queries.executeRequest('GET', 'usecases/usecases', null, $params)
            .then(function (result) {
                if (result.success) {
                    $scope.useCases = result.data;
                    //checkPermissions();
                }
            });
    }

    $scope.getAllActions = function (callback) {

        queries.executeRequest('GET', 'usecases/allactions')
            .then(function (result) {
                if (result.success) {
                    $scope.actions = result.data;
                    //checkPermissions();
                    if (callback != undefined) {
                        callback();
                    }
                }
            });
    }

    $scope.getActions = function (callback) {

        $params = {
            use_case_id: $scope.useCase.id
        }

        queries.executeRequest('GET', 'usecases/actions', null, $params)
            .then(function (result) {
                if (result.success) {
                    $scope.useCase.actions = result.data;
                    //checkPermissions();
                    if (callback != undefined) {
                        callback();
                    }
                }
            });
    }

    /**
     * Muestra el modal de agregar una acción
     */
    $scope.showAddAction = function () {
        var modalInstance = $scope.showModal('assets/admin/templates/configuraciones/addAction.html');

        modalInstance.result.then(function (data) {
            $scope.addAction(data);
        });
    }

    /**
     * Función para agregar una acción
     */
    $scope.addAction = function (source) {

        queries.executeRequest('POST', 'usecases/createaction', source)
            .then(function (result) {
                if (result.success) {
                    $scope.actions.push(result.data);
                }
            });
    }

    /**
     * Muestra el modal de editar una acción
     */
    $scope.showUpdateAction = function (source) {
        var modalInstance = $scope.showModal('assets/admin/templates/configuraciones/addAction.html', null, source);

        modalInstance.result.then(function (data) {
            $scope.updateAction(data);
        });
    }

    /**
     * Función para editar una acción
     */
    $scope.updateAction = function (source) {

        $params = {
            _method: "PUT"
        };

        queries.executeRequest('POST', 'usecases/updateaction', source, $params)
            .then(function (result) {
                if (result.success) {

                    //Primero actualizo el elemento en la lista de todas las acciones
                    index = arrays.getIndex($scope.actions, result.data);
                    if (index != -1) {
                        $scope.actions[index] = result.data;
                    }

                    //Luego actualizo el elemento en la lista de acciones del caso de uso, si este se encuentra presente
                    index2 = arrays.getIndex($scope.useCase.actions, result.data);
                    if (index2 != -1) {
                        $scope.useCase.actions[index2] = result.data;
                    }
                }
            });
    }

    /**
     *   Elimina una acción
     */
    $scope.deleteAction = function ($action) {

        $params = {
            action_id: $action.id
        };

        if (confirm("¿Esta seguro que desea eliminar la Acción: " + $action.name + "?")) {
            queries.executeRequest('DELETE', 'usecases/destroyaction', null, $params)
                .then(function (result) {
                    if (result.success) {
                        //Primero elimino el elemento en la lista de todas acciones
                        index = $scope.actions.indexOf($action);
                        if (index != -1) {
                            $scope.actions.splice(index, 1);
                        }

                        //Luego elimino el elemento en la lista de acciones del caso de uso, si este se encuentra presente
                        index2 = $scope.useCase.actions.indexOf($action);
                        if (index2 != -1) {
                            $scope.useCase.actions.splice(index2, 1);
                        }
                    }
                });
        }
    }

    /**
     * Función para actualizar las acciones de un caso de uso
     */
    $scope.updateUseCaseActions = function () {

        $params = {
            _method: "PUT",
            use_case_id: $scope.useCase.id
        };

        queries.executeRequest('POST', 'usecases/update', $scope.useCase.actions, $params)
            .then(function (result) {
                if (result.success) {
                    //
                }
            });
    }

    //Inicializa las variables necesarias
    initialize();
});
