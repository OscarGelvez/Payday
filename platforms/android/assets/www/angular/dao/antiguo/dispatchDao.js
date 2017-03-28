/**
 * @author Francisco Bastos
 * @email bastosjavier@kubesoft.com
 * @version 1.0
 *
 */

var kubeAdmin = angular.module('kubeApp');

kubeAdmin.service('DispatchDao', function (queries) {

    this.getInfoReport = function ($report) {
        return queries.executeRequest('GET', 'reports/inforeport', null, $report);
    };

    this.find = function ($id) {

        $params = {dispatch_account_id: $id};
        return queries.executeRequest('GET', 'dispatchs/find', null, $params);
    };

    this.findFull = function ($id) {

        $params = {dispatch_account_id: $id};
        return queries.executeRequest('GET', 'dispatchs/findfull', null, $params);
    };

    this.getDispatchingStates = function () {
        return queries.executeRequest('GET', 'dispatchs/dispatchingstates');
    };

    this.create = function ($dispatch) {
        return queries.executeRequest('POST', 'dispatchs/create', $dispatch);
    };

    this.transferDispatchs = function (dispatch) {
        return queries.executeRequest('PUT', 'dispatchs/transferdispatchs', dispatch);
    };

    return this;
});
