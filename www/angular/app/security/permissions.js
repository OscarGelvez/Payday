/**
 * Contiene todas las funcionalidades de gestión de permisos
 *
 * @author Francisco Bastos
 * @email bastosjavier@kubesoft.com
 * @version 2.0
 */
var kubeApp = angular.module('kubeApp');

kubeApp.controller('PermissionsController', function ($scope, queries, arrays) {

    //Inicialización de variables
    getRoles();
    getModules();
    initialize();

    /**
     * inicializa los objetos necesarios
     */
    function initialize() {
        $scope.usuario = {};
        $scope.newPermissions = [];
    }

    /**
     *   Obtiene la lista de todos los usuarios
     */
    function getRoles() {

        queries.executeRequest('GET', 'permissions/roles')
            .then(function (result) {
                if (result.success) {
                    $scope.roles = result.data;
                }
            });
    };

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
     * Obtiene todos los casos de uso de un rol dado
     */
    $scope.getUseCases = function (source) {

        $params = {
            role_id: source.id
        };

        queries.executeRequest('GET', 'permissions/usecases', null, $params)
            .then(function (result) {
                if (result.success) {
                    $scope.useCases = result.data;
                    checkPermissions();
                }
            });
    }

    /**
     * Verifica los casos de uso del rol en la lista de casos de uso del sistema y los "Chequea"
     */
    function checkPermissions() {
        for (i = 0; i < $scope.modules.length; i++) {
            for (j = 0; j < $scope.modules[i].use_cases.length; j++) {
                if ($scope.modules[i].use_cases[j].codename in $scope.useCases) {
                    $scope.modules[i].use_cases[j].allowed = true;
                } else {
                    delete $scope.modules[i].use_cases[j].allowed;
                }
            }
        }
    }

    /**
     * Función para agregar un rol
     */
    $scope.addRole = function () {

        queries.executeRequest('POST', 'permissions/createrole', $scope.newRole)
            .then(function (result) {
                if (result.success) {
                    $scope.roles.push(result.data);
                    $scope.newRole = {};
                }
            });
    }

    /**
     * Función para actualizar los permisos de un rol
     */
    $scope.updatePermissions = function () {

        $params = {
            _method: "PUT",
            role_id: $scope.role.id
        };

        queries.executeRequest('POST', 'permissions/update', $scope.concatPermissions(), $params)
            .then(function (result) {
                if (result.success) {
                    //
                }
            });
    }

    /**
     * Concatena las listas de permisos de todos los modulos del sistema
     */

    $scope.concatPermissions = function () {

        var arr = [];
        for (i = 0; i < $scope.modules.length; i++) {
            arr = arr.concat($scope.modules[i].use_cases);
        }

        return arr;
    }

    /**
     *  Función para mostrar el formulario de edición de usuarios
     */
    $scope.showMaterialEdit = function (source) {
        $scope.material = source;
        $scope.flag = "editarUsuario";
    };

    /**
     * muestra el modal de agregar rol
     */
    $scope.showAddRole = function () {
        var modalInstance = $scope.showModal('angular/templates/configuraciones/addRole.html');

        modalInstance.result.then(function (data) {
            $scope.newRole = data;
            $scope.addRole();
        });
    }

    /**
     * Muestra el modal de agregar un caso de uso
     */
    $scope.showAddUseCase = function (source) {
        var modalInstance = $scope.showModal('angular/templates/configuraciones/addUseCase.html');
        $scope.currentModule = source;

        modalInstance.result.then(function (data) {
            $scope.newUseCase = data;
            $scope.newUseCase.module_id = $scope.currentModule.id;
            $scope.addUseCase();
        });
    }

    /**
     * Función para agregar un caso de uso
     */
    $scope.addUseCase = function () {

        queries.executeRequest('POST', 'permissions/createusecase', $scope.newUseCase)
            .then(function (result) {
                if (result.success) {
                    $scope.currentModule.use_cases.push(result.data);
                    $scope.currentModule = {};
                    $scope.newUseCase = {};
                }
            });
    }

    /**
     * Función para agregar un módulo
     */
    $scope.addModule = function () {

        queries.executeRequest('POST', 'permissions/createmodule', $scope.newModule)
            .then(function (result) {
                if (result.success) {
                    $scope.modules.push(result.data);
                    $scope.newModule = {};
                }
            });
    }

    /**
     * muestra el modal de agregar modulo
     */
    $scope.showAddModule = function () {
        var modalInstance = $scope.showModal('angular/templates/configuraciones/addModule.html');

        modalInstance.result.then(function (data) {
            $scope.newModule = data;
            $scope.addModule();
        });
    }

    /**
     *   Elimina un módulo y todos sus permisos asociados
     */
    $scope.deleteModule = function (source) {

        $params = {
            module_id: source.id
        };

        if (confirm("¿Esta seguro que desea eliminar el módulo: " + source.name + " y todos sus permisos asociados?")) {
            queries.executeRequest('DELETE', 'permissions/destroymodule', null, $params)
                .then(function (result) {
                    if (result.success) {
                        index = $scope.modules.indexOf(source);
                        if (index != -1) {
                            $scope.modules.splice(index, 1);
                        }
                    }
                });
        }
    }

    /**
     *   Elimina un rol
     */
    $scope.deleteRole = function () {

        $params = {
            role_id: $scope.role.id
        };

        if (confirm("¿Esta seguro que desea eliminar el Rol: " + $scope.role.name + "?")) {
            queries.executeRequest('DELETE', 'permissions/destroyrole', null, $params)
                .then(function (result) {
                    if (result.success) {
                        index = $scope.roles.indexOf($scope.role);
                        if (index != -1) {
                            $scope.roles.splice(index, 1);
                        }
                        delete $scope.useCases;
                    }
                });
        }
    }

    /**
     * muestra el modal de actualizar módulo
     */
    $scope.showUpdateModule = function (source) {
        var modalInstance = $scope.showModal('angular/templates/configuraciones/updateModule.html', null, source);

        modalInstance.result.then(function (data) {
            $scope.newModule = data;
            $scope.updateModule();
        });
    }

    /**
     * Función para editar un usuario
     */
    $scope.updateModule = function () {

        $params = {
            _method: "PUT"
        };

        queries.executeRequest('POST', 'permissions/updatemodule', $scope.newModule, $params)
            .then(function (result) {
                if (result.success) {
                    $scope.newModule = {};
                    index = arrays.getIndex($scope.modules, result.data);
                    if (index != -1) {
                        $scope.modules[index] = result.data;
                    }
                }
            });
    }

    /**
     *   Elimina un caso de uso
     */
    $scope.deleteUseCase = function ($useCase, $module) {

        $params = {
            use_case_id: $useCase.id
        };

        if (confirm("¿Esta seguro que desea eliminar el Permiso: " + $useCase.name + "?")) {
            queries.executeRequest('DELETE', 'permissions/destroyusecase', null, $params)
                .then(function (result) {
                    if (result.success) {
                        index = $module.use_cases.indexOf($useCase);
                        if (index != -1) {
                            $module.use_cases.splice(index, 1);
                        }
                    }
                });
        }
    }

    /**
     * muestra el modal de actualizar/Agregar caso de uso
     */
    $scope.showUpdateUseCase = function (useCase, $module) {
        $scope.currentModule = $module;
        var modalInstance = $scope.showModal('angular/templates/configuraciones/addUseCase.html', null, useCase);

        modalInstance.result.then(function (data) {
            $scope.newPermission = data;
            $scope.updateUseCase();
        });
    }

    /**
     * Función para editar un permiso
     */
    $scope.updateUseCase = function () {

        $params = {
            _method: "PUT"
        };

        queries.executeRequest('POST', 'permissions/updatepermission', $scope.newPermission, $params)
            .then(function (result) {
                if (result.success) {
                    $scope.newPermission = {};
                    index = arrays.getIndex($scope.currentModule.use_cases, result.data);
                    if (index != -1) {
                        $scope.currentModule.use_cases[index] = result.data;
                        $scope.currentModule.use_cases[index].allowed = true;
                    }
                }
            });
    }

    /**
     * muestra el modal de actualizar rol
     */
    $scope.showUpdateRole = function (role) {

        var modalInstance = $scope.showModal('angular/templates/configuraciones/addRole.html', null, role);

        modalInstance.result.then(function (data) {
            $scope.newRole = data;
            $scope.updateRole();
        });
    }

    /**
     * Función para editar un permiso
     */
    $scope.updateRole = function () {

        $params = {
            _method: "PUT"
        };

        queries.executeRequest('POST', 'permissions/updaterole', $scope.newRole, $params)
            .then(function (result) {
                if (result.success) {
                    $scope.newRole = {};
                    index = arrays.getIndex($scope.roles, result.data);
                    if (index != -1) {
                        $scope.roles[index] = result.data;
                    }
                }
            });
    }

});
