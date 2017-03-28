var kubeApp = angular.module('kubeApp');

kubeApp.run(function (SessionService,localDatabase, RatesHelper) {

    //Refresh session variables
    SessionService.refresh();


});

