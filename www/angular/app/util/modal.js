var kubeAdmin = angular.module('kubeApp');

kubeAdmin.factory('modal', function ($modal) {
    var modal = {};

    /**
     * Muestra un modal en pantalla
     * Esta funciòn hace uso del modal de bootstra-ui
     *
     * @param $template: La url de la plantilla que se va a cargar en el modal
     * @param $size: El tamaño del modal (Correspondiente a los tamaños del modal de bootstrap), puede ser "lg" (grande), "sm" (pequeño) o null (mediano)
     * @param $data: Los datos que se van a mostrar en el modal (opcional)
     *
     * @return modalInstance: La instancia del modal
     */
    modal.showModal = function ($template, $size, $data) {

        var modalInstance = $modal.open({
            templateUrl: $template,
            controller: 'ModalInstanceCtrl',
            size: $size,
            resolve: {
                item: function () {
                    return $data;
                }
            }
        });

        return modalInstance;
    };

    /**
     * Muestra un modal de confirmación en pantalla
     * Esta función hace uso del modal de bootstra-ui
     *
     * @param $template: La url de la plantilla que se va a cargar en el modal
     * @param $size: El tamaño del modal (Correspondiente a los tamaños del modal de bootstrap), puede ser "lg" (grande), "sm" (pequeño) o null (mediano)
     * @param $data: Los datos que se van a mostrar en el modal (opcional)
     *
     * @return modalInstance: La instancia del modal
     */
    modal.showConfirmModal = function ($mensaje) {

        var modalInstance = $modal.open({
            templateUrl: 'angular/templates/global/confirm.html',
            controller: 'ModalInstanceCtrl',
            resolve: {
                item: function () {
                    return $mensaje;
                }
            }
        });

        return modalInstance;
    };

    modal.showInformationModal = function ($mensaje) {

        var modalInstance = $modal.open({
            templateUrl: 'angular/templates/global/information.html',
            controller: 'ModalInstanceCtrl',
            resolve: {
                item: function () {
                    return $mensaje;
                }
            }
        });

        return modalInstance;
    };

    return modal;
});
