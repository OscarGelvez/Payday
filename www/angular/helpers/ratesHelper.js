/**
 * @author Francisco Bastos
 * @email bastosjavier@kubesoft.com
 * @version 1.0
 *
 */

var kubeAdmin = angular.module('kubeApp');

kubeAdmin.service('RatesHelper', function (queries) {

    this.refresh = function () {
        return queries.executeRequest('GET', 'reports/rates');
    };

    return this;
});
