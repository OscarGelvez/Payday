/**
 * Archivo principal aplicación angular
 * Actualizado para el funcionamiento con AngularJS v1.3.4
 * Dependencias de la aplicación y estados (ui.router)
 *
 * @author Francisco Bastos
 * @email bastosjavier@kubesoft.com
 * @version 1.1
 */
 var kubeApp = angular.module('kubeApp', ['ionic', 'scrollable-table', 'ng-currency', 'ngSanitize', 'ui.select', 'chart.js', 'ngRoute', 'angularFileUpload', 'ui.bootstrap', 'ui.router', 'ngTable', 'checklist-model', 'ngTagsInput', 'ngPasswordStrength', 'ui.utils.masks', 'pascalprecht.translate', 'ngCordova', 'ui.utils.masks' ]);





kubeApp.run(function($ionicPlatform) {
    $ionicPlatform.ready(function () {
    
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
        
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
       
      }
    });
  })


kubeApp.factory('valorCaja', function(){
return{
   estado:true // False: indica que la caja no ha sido abierta. True: ya se abrio caja
};
  
})





kubeApp.filter('unsafe',function($sce){
    return function(htmlTetx){
        return $sce.trustAsHtml(htmlTetx);
    };
});

kubeApp.config(['$stateProvider', '$urlRouterProvider', '$translateProvider',
    function ($stateProvider,  $urlRouterProvider, $translateProvider) {

        //ngClipProvider.setPath("//cdnjs.cloudflare.com/ajax/libs/zeroclipboard/2.1.6/ZeroClipboard.swf");
            $translateProvider.translations('es',sp_spanish);
            $translateProvider.translations('en',sp_english);
            $translateProvider.preferredLanguage('es');
            // Enable escaping of HTML
            $translateProvider.useSanitizeValueStrategy('escape');

        var folderProject  = '/..';
        
        $stateProvider
		
	             .state('login',{
                    url : '/login',
                    templateUrl : 'login.html',
                    controller : 'SesionController'
                })

                .state('singup', {
                  url: '/singup',
                  templateUrl: 'templates/singup.html',
                  controller: 'SingupController'
               })

                 .state('forgot_password', {
                  url: '/forgot_password',
                  templateUrl: 'templates/forgot-password.html',
                  controller: 'forgot_passwordController'
               })


                 .state('app', {
                  url: '/app',
                  abstract: true,
                  templateUrl: 'templates/apps.html',
                  controller: 'SideMenuController'
                })

                 .state('app.home', {
                  url: '/home',
                  views: {
                    'menuContent': {
                      templateUrl: 'templates/app.home.html',
                      controller: 'HomeController'
                    }
                  }
                })
                 .state('app.simulator', {
                  url: '/simulator',
                  views: {
                    'menuContent': {
                      templateUrl: 'templates/app.simulator.html',
                      controller: 'LoanController'

                    }
                  }
                })

                 .state('app.moves_box', {
                  url: '/moves_box',
                  views: {
                    'menuContent': {
                      templateUrl: 'templates/app.moves_box.html',
                      controller: 'MovesBoxController'

                    }
                  }
                })

                 .state('app.admin_categories', {
                  url: '/admin_categories',
                  views: {
                    'menuContent': {
                      templateUrl: 'templates/app.admin_categories.html',
                      controller: 'AdminCategoriesController'

                    }
                  }
                })









                   /////////################# STATES de la plantilla comprada####################////////////////////////

                // setup an abstract state for the tabs directive
                .state('tab', {
                  url: '/tab',
                  abstract: true,
                  templateUrl: 'templates/tabs.html',
                  controller: 'AppCtrl'
                })

                // Each tab has its own nav history stack:

                .state('tab.calendar', {
                  url: '/calendar',
                  views: {
                    'tabContent': {
                      templateUrl: 'templates/tab-calendar.html',
                      controller: 'CalendarCtrl'
                    }
                  }
                })
                .state('tab.budget', {
                  url: '/budget',
                  views: {
                    'tabContent': {
                      templateUrl: 'templates/tab-budget.html',
                      controller: 'BudgetCtrl'
                    }
                  }
                })
                .state('tab.chart', {
                  url: '/chart',
                  views: {
                    'tabContent': {
                      templateUrl: 'templates/tab-chart.html',
                      controller: 'ChartCtrl'
                    }
                  }
                })
                .state('tab.account', {
                  url: '/account',
                  views: {
                    'tabContent': {
                      templateUrl: 'templates/tab-account.html',
                      controller: 'AccountCtrl'
                    }
                  }
                })


                /////////################# STATES ya definidos en la APP PAYDAY####################////////////////////////



             .state('home',{
                    url : '/home',
					
                    templateUrl: 'home.html',
                    controller: 'HomeController'
                })
                .state('home.newLoan',{
                    url : '/loan/new',
                    templateUrl : 'html/loans/new.html',
                    controller : 'LoanController'
                }).
                state('home.paymentPlan',{
                    url : '/loan/payment/plan',
                    templateUrl : 'html/loans/paymentPlan.html',
                    controller : 'LoanController'
                }).
                state('home.collectionDay',{
                    url : '/loan/list/day',
                    templateUrl : 'html/loans/collectionDay.html',
                    controller : 'LoanController'
                }).
                state('home.asignRoutePosition',{
                    url : '/loan/new/asignPosition',
                    templateUrl : 'html/loans/asignRoutePosition.html',
                    controller : 'LoanController'
                }).
                state('home.addPayment',{
                    url : '/loan/add/payment',
                    templateUrl : 'html/loans/addPayment.html',
                    controller : 'LoanController'
                }).
                state('home.listPaymentsLoan',{
                    url : '/loan/view/payments',
                    templateUrl : 'html/loans/paymentsHistory.html',
                    controller : 'LoanController'
                }).
                state('home.detailLoan',{
                    url : '/loan/detail/',
                    templateUrl : 'html/loans/detail.html',
                    controller : 'LoanController'
                }).
                state('home.stateFeesLoan',{
                    url : '/loan/:loan_id/state/fees',
                    templateUrl : 'html/loans/stateFees.html',
                    controller : 'LoanController'
                }).
                state('home.simulate',{
                    url : '/loan/demo',
                    templateUrl : 'html/demo/index.html',
                    controller : 'LoanController'
                }).
                state('home.movesAdd',{
                    url : '/moves/add',
                    templateUrl :   'html/moves/add.html',
                    controller : 'MoveController'
                }).
                state('home.movesList',{
                    url : '/moves/list',
                    templateUrl :   'html/moves/list.html',
                    controller : 'MoveController'
                }).
                state('home.reports',{
                    url : '/reports/',
                    templateUrl : 'html/reports/index.html',
                    controller : 'ReportController'                            
                }).
                state('home.movesOfDay',{
                    url : '/reports/movesOfDay',
                    templateUrl : 'html/reports/movesOfDay.html',
                    controller : 'MoveController'
                }).
                state('home.LoansOfDay',{
                    url :   '/reports/loans/day',
                    templateUrl : 'html/reports/loansOfDay.html',
                    controller : 'ReportController'
                }).
                state('home.nextFewToEnd',{
                    url : '/reports/loans/nextFewToEnd',
                    templateUrl : 'html/reports/nextFewToEnd.html',
                    controller : 'ReportController'
                }).
                state('home.creditHistoryClient',{
                    url : '/reports/client/history',
                    templateUrl : 'html/reports/creditHistoryClient.html',
                    controller :  'ReportControlller'
                }).
                state('home.test',{
                    url : '/db',
                    templateUrl : 'html/test/testDB.html',
                    controller : 'TestController'
                }).
                state('home.userTest',{
                    url : '/test',
                    templateUrl : 'html/test/userTest.html',
                    controller : 'TestController'
                }).
                state('home.testServer',{
                    url : '/server',
                    templateUrl : 'html/test/server.html',
                    controller : 'TestController'
                });

        $urlRouterProvider.otherwise("/login");
    }])


  kubeApp.controller('AppCtrl', function ($scope, $state, $rootScope, $ionicModal, $ionicSlideBoxDelegate) {

    $scope.data = {};

    $ionicModal.fromTemplateUrl('./templates/modals/add-transaction.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalTransaction = modal;
    });

    $scope.openModalTransaction = function() {
      $scope.modalTransaction.show();
    };

    $scope.closeModalTransaction = function() {
      $scope.modalTransaction.hide();
    };

    $scope.data.labelsBudgets = ['.','.','.','.','.','.','.','.','.','.'];
    $scope.data.dataBudgets = [
      [1000, 1400, 1700, 2000, 2800, 3000, 4100, 4200, 4800, 5600]
    ];
    $scope.onClick = function (points, evt) {
      console.log(points, evt);
    };


    $scope.reports = [
      {
        icon: 'ion ion-bag',
        name: 'Shopping',
        amount: -1596,
        percent: 38,
        iconBg: 'positive-bg'
      },
      {
        icon: 'ion ion-help-buoy',
        name: 'Entertainment',
        amount: -950,
        percent: 22,
        iconBg: 'calm-bg'
      },
      {
        icon: 'ion ion-heart',
        name: 'Relationship',
        amount: -756,
        percent: 18,
        iconBg: 'balanced-bg'
      },
      {
        icon: 'ion ion-android-car',
        name: 'Transport',
        amount: -420,
        percent: 10,
        iconBg: 'energized-bg'
      },
      {
        icon: 'ion ion-spoon',
        name: 'Eating',
        amount: -378,
        percent: 9,
        iconBg: 'assertive-bg'
      },
      {
        icon: 'ion ion-cash',
        name: 'Loan',
        amount: -100,
        percent: 2.38,
        iconBg: 'royal-bg'
      },
      {
        icon: 'ion ion-fork',
        name: 'Other',
        amount: -26,
        percent: 0.61,
        iconBg: 'dark-bg'
      }
    ]

    $scope.data.labelsChart = [];
    $scope.data.dataChart = [];

    angular.forEach($scope.reports, function (value) {
      $scope.data.labelsChart.push(value.name)
      $scope.data.dataChart.push(value.amount)
    });

    $scope.switchTabReport = function () {
      $scope.switchReport = !$scope.switchReport;
      $scope.data.labelsChart.reverse();
      $scope.data.dataChart.reverse();
      $scope.reports.reverse();
    };

    $scope.data.positionTab = 0;

    $scope.slideHasChanged = function (index) {
      $scope.data.positionTab = index;
    };

    $scope.goState = function (index) {
      $ionicSlideBoxDelegate.slide(index)
    };

    $ionicModal.fromTemplateUrl('./templates/modals/detail.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modalDetail = modal;
    });

    $scope.openModalDetail = function() {
      $scope.modalDetail.show();
    };

    $scope.closeModalDetail = function() {
      $scope.modalDetail.hide();
    };

  })

kubeApp.controller('CalendarCtrl', function ($scope, $cordovaCalendar) {

  $cordovaCalendar.createCalendar({
    calendarName: 'Cordova Calendar',
    calendarColor: '#FF0000'
  }).then(function (result) {
    // success
  }, function (err) {
    // error
  });

  $cordovaCalendar.deleteCalendar('Cordova Calendar').then(function (result) {
    // success
  }, function (err) {
    // error
  });

  $cordovaCalendar.createEvent({
    title: 'Space Race',
    location: 'The Moon',
    notes: 'Bring sandwiches',
    startDate: new Date(2015, 0, 6, 18, 30, 0, 0, 0),
    endDate: new Date(2015, 1, 6, 12, 0, 0, 0, 0)
  }).then(function (result) {
    // success
  }, function (err) {
    // error
  });

  $cordovaCalendar.createEventWithOptions({
    title: 'Space Race',
    location: 'The Moon',
    notes: 'Bring sandwiches',
    startDate: new Date(2015, 0, 6, 18, 30, 0, 0, 0),
    endDate: new Date(2015, 1, 6, 12, 0, 0, 0, 0)
  }).then(function (result) {
    // success
  }, function (err) {
    // error
  });

  $cordovaCalendar.createEventInteractively({
    title: 'Space Race',
    location: 'The Moon',
    notes: 'Bring sandwiches',
    startDate: new Date(2015, 0, 6, 18, 30, 0, 0, 0),
    endDate: new Date(2015, 1, 6, 12, 0, 0, 0, 0)
  }).then(function (result) {
    // success
  }, function (err) {
    // error
  });

  $cordovaCalendar.createEventInNamedCalendar({
    title: 'Space Race',
    location: 'The Moon',
    notes: 'Bring sandwiches',
    startDate: new Date(2015, 0, 6, 18, 30, 0, 0, 0),
    endDate: new Date(2015, 1, 6, 12, 0, 0, 0, 0),
    calendarName: 'Cordova Calendar'
  }).then(function (result) {
    // success
  }, function (err) {
    // error
  });

  $cordovaCalendar.findEvent({
    title: 'Space Race',
    location: 'The Moon',
    notes: 'Bring sandwiches',
    startDate: new Date(2015, 0, 6, 18, 30, 0, 0, 0),
    endDate: new Date(2015, 1, 6, 12, 0, 0, 0, 0)
  }).then(function (result) {
    // success
  }, function (err) {
    // error
  });

  $cordovaCalendar.listEventsInRange(
    new Date(2015, 0, 6, 0, 0, 0, 0, 0),
    new Date(2015, 1, 6, 0, 0, 0, 0, 0)
  ).then(function (result) {
    // success
  }, function (err) {
    // error
  });

  $cordovaCalendar.listCalendars().then(function (result) {
    // success
  }, function (err) {
    // error
  });

  $cordovaCalendar.findAllEventsInNamedCalendar('Cordova Calendar').then(function (result) {
    // success
  }, function (err) {
    // error
  });

  $cordovaCalendar.modifyEvent({
    title: 'Space Race',
    location: 'The Moon',
    notes: 'Bring sandwiches',
    startDate: new Date(2015, 0, 6, 18, 30, 0, 0, 0),
    endDate: new Date(2015, 1, 6, 12, 0, 0, 0, 0),
    newTitle: 'Ostrich Race',
    newLocation: 'Africa',
    newNotes: 'Bring a saddle',
    newStartDate: new Date(2015, 2, 12, 19, 0, 0, 0, 0),
    newEndDate: new Date(2015, 2, 12, 22, 30, 0, 0, 0)
  }).then(function (result) {
    // success
  }, function (err) {
    // error
  });

  $cordovaCalendar.deleteEvent({
    newTitle: 'Ostrich Race',
    location: 'Africa',
    notes: 'Bring a saddle',
    startDate: new Date(2015, 2, 12, 19, 0, 0, 0, 0),
    endDate: new Date(2015, 2, 12, 22, 30, 0, 0, 0)
  }).then(function (result) {
    // success
  }, function (err) {
    // error
  });

})


