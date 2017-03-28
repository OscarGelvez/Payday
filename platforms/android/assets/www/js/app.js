


// ####################NO SE ESTA USANDO, NO ESTA LINKEADO EN EL INDEX.!########################




angular.module('kubeApp', ['ionic', 'chart.js', 'pascalprecht.translate', 'ngSanitize'])

  kubeApp.run(function ($ionicPlatform) {
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

  .config(function ($stateProvider, $urlRouterProvider, $provide, $translateProvider ) {
	
    $stateProvider

      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      })

      .state('singup', {
        url: '/singup',
        templateUrl: 'templates/singup.html',
        controller: 'SingupCtrl'
      })

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
      });


    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');
    $provide.decorator('$locale', ['$delegate', function ($delegate) {
      if ($delegate.id == 'en-us') {
        $delegate.NUMBER_FORMATS.PATTERNS[1].negPre = '-\u00A4';
        $delegate.NUMBER_FORMATS.PATTERNS[1].negSuf = '';
      }
      return $delegate;
    }]);

    $translateProvider.translations('es',sp_spanish);
    $translateProvider.preferredLanguage('es');
    // Enable escaping of HTML
    $translateProvider.useSanitizeValueStrategy('escape');

  })


  .controller('AppCtrl', function ($scope, $state, $rootScope, $ionicModal, $ionicSlideBoxDelegate) {

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

