var kubeAdmin = angular.module('kubeApp');

kubeAdmin.factory('notifications', function () {
    var notification = {};

    notification.showError = function ($message) {
        toastr.error($message, "ERROR");
    };

    return notification;
});
