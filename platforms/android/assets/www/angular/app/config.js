var kubeApp = angular.module('kubeApp');

kubeApp.config(function (datepickerConfig, datepickerPopupConfig) {

    /* Toastr Settings START*/
    toastr.options.closeButton = true;

    /* Settings for datepicker START */
    datepickerConfig.startingDay = 1;
    datepickerConfig.showWeeks = false;

    datepickerPopupConfig.currentText = "Hoy";
    datepickerPopupConfig.clearText = "Limpiar";
    datepickerPopupConfig.closeText = "Cerrar";
    /* Settings for datepicker END */
});
