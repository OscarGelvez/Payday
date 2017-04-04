
  var kubeApp = angular.module('kubeApp');


  kubeApp.controller('SideMenuController', function ($scope, $state, $rootScope, $ionicModal, $ionicSlideBoxDelegate, $translate, $ionicLoading, $cordovaNetwork, SaveData, SessionService ) {



   
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


// ##########CODIGO MODAL PARA CAMBIAR IDIOMA DE LA APP ######################

$scope.idiomaSelect= {};

$ionicModal.fromTemplateUrl('templates/modals/change_language.html', {
        scope: $scope,
        animation: 'fade-in-scale',
        backdropClickToClose: false,
        hardwareBackButtonClose: false
      }).then(function(modal) {
        $scope.changeLanguage = modal;
      });
      $scope.openModal = function() {
        $scope.changeLanguage.show();

      };
      $scope.closeModal = function() {
        $scope.changeLanguage.hide();
       

      };
      
      $scope.openModalChange=function(){
         $scope.openModal();
      }


      $scope.elige=function(val){
        $scope.idiomaSelect.value=val;
        console.log($scope.idiomaSelect.value);
      }

    $scope.change=function () {
            if($scope.idiomaSelect.value==1){
                $translate.use('es');
            }else{
                $translate.use('en');
            }
              $scope.closeModal();
    };



//######################################CODIGO PARA REVISAR EL ESTADO DE LA RED##################################################

 function disableVista(){
  var valAlert = $translate.instant('Alerts.AlertNoConection');
    $ionicLoading.show({
      template: '<div class="msgOfflineApp" > <br> <h4 style="margin-top:0px !important">'+valAlert +'</h4> </div>',
      hideOnStateChange: true
    });


  }

 if(ionic.Platform.isWebView()){
    document.addEventListener("deviceready", function () {

    var type = $cordovaNetwork.getNetwork()

    var isOnline = $cordovaNetwork.isOnline()

    var isOffline = $cordovaNetwork.isOffline()


    // listen for Online event
    $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
      var onlineState = networkState;
      console.log(onlineState)
      $ionicLoading.hide();
    })

    // listen for Offline event
    $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
      var offlineState = networkState;
      console.log(offlineState)
      disableVista();
    })

  }, false);
}else{
  
    //Same as above but for when we are not running on a device
      window.addEventListener("online", function(e) {
      console.log("is online ahora");
      $ionicLoading.hide();

      }, false);    

      window.addEventListener("offline", function(e) {
        disableVista();
          console.log("is offline ahora")

      }, false); 
}


//############################################## CODIGO CERRAR SESION ############################################



 $scope.logoutHome = function(){
        console.log(SaveData.removeFolder("config",true));
        SessionService.destroy();
        $state.go("login");
    };
//############################################## FIN CODIGO CERRAR SESION ############################################







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




