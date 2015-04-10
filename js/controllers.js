var demoControllers = angular.module('demoControllers', []);

demoControllers.controller('UsersController', ['$scope', '$http', 'Users', '$window' , function($scope, $http,  Users, $window) {

  Users.get().success(function(data){
    $scope.users = data['data'];
  });

  $scope.deleteUser = function(index, id) {
    Users.deleteUser(id, function(data, err) {
      $scope.errorMes = err;
      $scope.users.splice(index, 1);
    });
  };

  // $scope.nextPage = function() {
  //   if($scope.curPage * 10 >= $scope.users.length) return;
  //   $scope.curPage += 1;
  // };

  // $scope.prevPage = function() {
  //   if($scope.curPage === 0) return;
  //   $scope.curPage -= 1;
  // };

}]);

function getBaseUrl(window) {
  var url = window.sessionStorage.baseurl || 'localhost:4000';
  return url;
}

function deleteRequest(http, window, path) {
  http.delete(getBaseUrl(window) + path)
    .success(function(data, status, headers, config) {
      cb(data, "");
    })
    .error(function(data, status, headers, config) {
      cb(null, data);
    });
}

demoControllers.controller('TasksController', ['$scope', '$http', 'Tasks', '$window' , function($scope, $http,  Tasks, $window) {
  $scope.tasks = {};
  $scope.displayText = " ";
  $scope.taskRadioFilter = false;
  $scope.curPage = 0;
  $scope.taskSorter = "";
  $scope.taskOrder = 1;

  $scope.$watchGroup(['taskSorter', 'taskOrder'], function(newValues, oldValues) {

    if(newValues[0].length === 0) {
      Tasks.getTasks(function(data, err) {
        $scope.tasks = data;
        $scope.errorMes = err;
      });
    }
    else {
      Tasks.getSortedTasks(newValues[0], newValues[1], function(data, err) {
        $scope.tasks = data;
        $scope.errorMes = err;
      });
    }
  });

  Tasks.get().success(function(data){
    $scope.tasks = data['data'];
    $scope.errorMes = err;
  });

  $scope.nextPage = function() {
    if($scope.curPage * 10 >= $scope.tasks.length) return;
    $scope.curPage += 1;
  };

  $scope.prevPage = function() {
    if($scope.curPage === 0) return;
    $scope.curPage -= 1;
  };

  $scope.deleteTask = function(id, index) {
    Tasks.deleteTask(id, function(data, err) {
      $scope.errorMes = err;
      $scope.tasks.splice(index, 1);
    });
  };

}]);

demoControllers.controller('AddUserController', ['$scope', '$http', 'Users', '$window', function($scope, $http, Users, $window) {
  $scope.displayText = " ";
  $scope.newUser = {};

  $scope.setData = function(){
    console.log($scope.newUser);
    Users.addUser($scope.newUser).success(function(data) {
      console.log(data);
      $scope.response = data;
      console.log($scope.response);
      $scope.displayText = $scope.response['message'];
    });
  };
}]);

demoControllers.controller('LlamaListController', ['$scope', '$http', 'Llamas', '$window' , function($scope, $http,  Llamas, $window) {

  Llamas.get().success(function(data){
    $scope.llamas = data;
  });
}]);

demoControllers.controller('SettingsController', ['$scope' , '$window' , function($scope, $window) {
  $scope.url = $window.sessionStorage.baseurl;

  $scope.setUrl = function(){
    $window.sessionStorage.baseurl = $scope.url; 
    $scope.displayText = "URL set";
  };
}]);

demoControllers.filter('pagination', function(){
  return function(input, start) {
    start = parseInt(start, 10);
    return input.slice(start);
  };
});

