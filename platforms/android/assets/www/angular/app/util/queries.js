/**
 * Servicio que contiene funcionalidades para realizar consultas asìncronas
 * Este Servicio requiere del módulo de seguridad 'security-service' para su funcionamiento
 *
 * @author Francisco Bastos
 * @email bastosjavier@kubesoft.com
 * @version 2.0
 *
 */

var kubeAdmin = angular.module('kubeApp');

kubeAdmin.factory('queries', function ($http, $q, SessionService, APP, $upload) {

    var queries = {};


    queries.executeRequest = function ($method, $url, $data, $params, $useCase, $showError,options) {

        $http.defaults.headers.common['useCase'] = $useCase ? $useCase : SessionService.useCase;

        $showError = ($showError === false) ? $showError : true;
        var deferred = $q.defer();

        $http({
            method: $method,
            url: APP.BASE_URL + $url,
            data: $data,
            params: $params
        }).success(function (data) {
            if ($method.toUpperCase() !== 'GET' && $showError) {
                toastr.success(data.mensaje, "EXITO");
            }
            deferred.resolve(data);
        }).error(function (data) {
            if ($method.toUpperCase() !== 'GET' && $showError) {
                toastr.error(concatErrors(data.mensaje), "ERROR");
            }
            deferred.reject(data);
        });

        return deferred.promise;
    };

    /**
     * Function for upload a file
     *
     * @param {String} $method : POST or PUT
     * @param {String} $url : service URL
     * @param {Object} $data : information what will be send with request
     * @param {Object} $file : file to upload
     * @param {String} $useCase : (optional) use case code
     *
     * @returns {promise}
     */
    queries.upload = function ($method, $url, $data, $file, $useCase) {

        if ($method.toLowerCase() !== 'post' && $method.toLowerCase() !== 'put') {
            return;
        }

        $http.defaults.headers.common['useCase'] = $useCase ? $useCase : SessionService.useCase;
        var deferred = $q.defer();

        /** Because laravel PUT requests problem*/
        if ($method === 'PUT') {
            $url += '?_method=PUT';
            $method = 'POST';
        }

        $upload.upload({
            method: $method,
            url: APP.BASE_URL + $url,
            file: $file,
            data: $data
        }).success(function (data) {
            toastr.success(data.mensaje, "EXITO");
            deferred.resolve(data);
        }).error(function (data) {
            toastr.error(concatErrors(data.mensaje), "ERROR");
            deferred.reject(data);
        });

        return deferred.promise;
    };
    /**
     * Concatena todos los errores devueltos en una sola cadena
     *
     * @param {array} $array :El array que contiene los errores
     * @returns {String} :La cadena que contiene todos los errores concatenados
     */
    function concatErrors($array) {

        var string = "";
        for (var key in $array) {
            for (i = 0; i < $array[key].length; i++) {
                string += $array[key][i] + "\n";
            }
        }


        return string;
    }

    return queries;
});
