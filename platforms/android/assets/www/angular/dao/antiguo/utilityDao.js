/**
 * @author Francisco Bastos
 * @email bastosjavier@kubesoft.com
 * @version 1.0
 *
 */

var kubeAdmin = angular.module('kubeApp');

kubeAdmin.service('UtilityDao', function (queries) {

    this.getUtilitiesReport = function (start, end) {

        params = {
            startingDate: start,
            finalDate: end
        };

        return queries.executeRequest('GET', 'utilities/report', null, params);
    };

    this.liquidate = function ($utility) {
        return queries.executeRequest('POST', 'utilities/liquidate', $utility);
    };

    this.addPayment = function (utility) {
        return queries.executeRequest('POST', 'utilities/addpayment', utility);
    };

    this.removePayment = function (payment_id) {

        params = {payment_id: payment_id};
        return queries.executeRequest('DELETE', 'utilities/destroypayment', null, params);
    };

    this.getLiquidationDetails = function (liquidation_id) {
        params = {liquidation_id: liquidation_id};
        return queries.executeRequest('GET', 'utilities/liquidationdetails', null, params);
    };

    this.removeLiquidation = function (liquidation_id) {

        params = {liquidation_id: liquidation_id};
        return queries.executeRequest('DELETE', 'utilities/destroyliquidation', null, params);
    };

    return this;
});
