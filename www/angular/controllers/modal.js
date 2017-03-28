/**
 * Controlador utilizado por el Modal de Bootstrap UI
 *
 * @author Francisco Bastos
 * @email bastosjavier@kubesoft.com
 * @version 1.0
 */
var kubeApp = angular.module('kubeApp');

kubeApp.controller('ModalInstanceCtrl', function ($scope, $modalInstance, item) {

    if (item !== undefined) {
        $scope.item = angular.copy(item);
    } else {
        $scope.item = {};
    }
    
    $scope.ok = function () {
        $modalInstance.close($scope.item);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    
    //********************************************************************************
    // funciones para el modal de consulta de  cuentas de asignaciones de un usuario
    //********************************************************************************
    
    $scope.getAccountsAssignments = function(){
        
    };
    
});
