var kubeApp = angular.module('kubeApp');

kubeApp.config(function ($httpProvider, $provide) {

    // register the interceptor as a service
    $provide.factory('myHttpInterceptor', function ($q, $injector) {
        return {
            // optional method
            'request': function (config) {
                // do something on success
                Metronic.blockUI({
                    target: angular.element('.listaAjax'),
                    animate: true,
                    overlayColor: 'none'
                });
                return config;
            },
            // optional method
            'requestError': function (rejection) {
                // do something on error
                if (canRecover(rejection)) {
                    return responseOrNewPromise;
                }
                return $q.reject(rejection);
            },
            // optional method
            'response': function (response) {
                // do something on success
                Metronic.unblockUI(angular.element('.listaAjax'));

                return response;
            },
            // optional method
            'responseError': function (rejection) {
                // do something on error
//                if (rejection.status === 401 || rejection.status === 403 || rejection.status === 404) {
//                    toastr.error(rejection.data.mensaje, "ERROR");
//                }
                Metronic.unblockUI(angular.element('.listaAjax'));
                $injector.invoke(function (SessionService) {
                    switch (rejection.status) {
                        case 401:
                            SessionService.destroy();
                            SessionService.redirectToLogin();
                            break;
                        case 403:
                            SessionService.unauthorized();
                            break;
                        case 404:
                            SessionService.notFound();
                            break;
                    }
                });

                return $q.reject(rejection);
            }
        };
    });

    $httpProvider.interceptors.push('myHttpInterceptor');

});
