/**
 * @author Francisco Bastos
 * @email bastosjavier@kubesoft.com
 * @version 1.0
 *
 */

var kubeAdmin = angular.module('kubeApp');

kubeAdmin.service('ReportDao', function (queries) {

    this.getInfoReport = function ($report) {
        return queries.executeRequest('GET', 'reports/inforeport', null, $report);
    };

    this.export = function ($report) {
        return queries.executeRequest('GET', 'reports/sendreport', null, $report);
    };

    this.exportBalance = function ($report) {
        return queries.executeRequest('GET', 'reports/sendreportbalance', null, $report);
    };

    this.getDailyReport = function (date) {
        params = {date: date};
        return queries.executeRequest('GET', 'reports/dailyreport', null, params);
    };

    this.getRatesByDate = function (date, product) {
        params = {date: date, product: product};
        return queries.executeRequest('GET', 'reports/ratesbydate', null, params);
    }

    return this;
});
