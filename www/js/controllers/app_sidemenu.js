
  var kubeApp = angular.module('kubeApp');


  kubeApp.controller('SideMenuController', function ($scope, $state, $rootScope, $ionicModal, $ionicSlideBoxDelegate) {


  $scope.toggleGroup = function(group) {
      if ($scope.isGroupShown(group)) {
        $scope.shownGroup = null;
      } else {
        $scope.shownGroup = group;
      }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };
 
  $scope.group = 'deals';






























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

    // $scope.data.positionTab = 0;

    // $scope.slideHasChanged = function (index) {
    //   $scope.data.positionTab = index;
    // };

    // $scope.goState = function (index) {
    //   $ionicSlideBoxDelegate.slide(index)
    // };







    
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

  });




