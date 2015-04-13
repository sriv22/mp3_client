var demoControllers = angular.module('demoControllers', []);

demoControllers.controller('UsersController', ['$scope', '$http', 'Users', 'Tasks', '$window' , function($scope, $http,  Users, Tasks, $window) {

  Users.get().success(function(data){
    $scope.users = data['data'];
  });

  $scope.deleteUser = function(index, id) {
    Tasks.getUserTasks(id, function(tasks) {
      $scope.tasks = tasks;
      for(var i=0; i<$scope.tasks.length; i++){
        Tasks.editTask({_id:$scope.tasks[i]._id,
                        name:$scope.tasks[i].name,
                        deadline:$scope.tasks[i].deadline,
                        assignedUser:"",
                        assignedUserName:"unassigned"}, function(data, err) {
                                                          $scope.errorMes = err;
                                                        });
      }
    });
    Users.deleteUser(id, function(data, err) {
      $scope.errorMes = err;
      $scope.users.splice(index, 1);
    });
  };
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

  Tasks.get().success(function(data, err){
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

demoControllers.controller('TaskDetailController', ['$scope', '$http', 'Tasks', '$routeParams','$window' , function($scope, $http, Tasks, $routeParams, $window) {
  Tasks.getTask($routeParams.id, function(task){
    $scope.task = task;
  });
}]);



demoControllers.controller('NewTaskController', ['$scope', 'Tasks', 'Users', function($scope, Tasks, Users) {
  $scope.newTask = {};
  $scope.displayText = " ";
  $scope.users = [];
  $scope.selectedUser = -1;
  $scope.showMissingFields = false;

  Users.getSparseUsers(function(data, err) {
    $scope.users = data;
    $scope.errorMes = err;
  });

  $scope.createTask = function() {
    if(!$scope.newTask.name || !$scope.newTask.deadline) {
      $scope.showMissingFields = true;
      return;
    }

    $scope.newTask.completed = false;

    if($scope.selectedUser !== -1) {
      $scope.newTask.assignedUser = $scope.users[$scope.selectedUser]._id;
      $scope.newTask.assignedUserName = $scope.users[$scope.selectedUser].name;
    }
    else {
      $scope.newTask.assignedUser = 'default';
      $scope.newTask.assignedUserName = 'unassigned';
    }

    Tasks.newTask($scope.newTask, function(data, err) {
      $scope.errorMes = err;
      $scope.selectedUser = -1;
      $scope.newTask = {};
      $scope.displayText = "Task Created!";
    });
  };
}]);

demoControllers.controller('EditTaskController', ['$scope', '$routeParams', 'Tasks', 'Users', function($scope, $routeParams, Tasks, Users) {
  $scope.showMissingFields = true;
  $scope.selectedUser = -1;
  $scope.displayText = " ";
  var oldUser = "";

  Tasks.getTask($routeParams.id, function(task, err) {
    $scope.task = task;
    $scope.task.deadline = new Date(task.deadline);
    $scope.errorMes = err;

    Users.getSparseUsers(function(users, err) {
      $scope.errorMes = err;
      $scope.users = users;
      for(var i = 0; i < $scope.users.length; i++) {
        if($scope.users[i].name === $scope.task.assignedUserName) {
          $scope.selectedUser = i;
          break;
        }
      }
    });
  });

  $scope.editTask = function() {

    if(!$scope.task.name || !$scope.task.deadline) {
      $scope.showMissingFields = true;
      return;
    }

    if($scope.selectedUser !== -1) {
      $scope.task.assignedUser = $scope.users[$scope.selectedUser]._id;
      $scope.task.assignedUserName = $scope.users[$scope.selectedUser].name;
    }

    Tasks.editTask($scope.task, function(data, err) {
      $scope.errorMes = err;
    });
    $scope.displayText = "Task Updated!";
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
      // console.log($scope.response);
      $scope.displayText = $scope.response['message'];
    });
  };
}]);

demoControllers.controller('UserDetailController', ['$scope', '$http', 'Users', 'Tasks', '$routeParams','$window', function($scope, $http, Users, Tasks, $routeParams, $window) {
  // console.log("inside userdetail controller");
  $scope.completedTasks = [];

  Users.getUser($routeParams.id, function(user) {
     $scope.user = user;
     console.log(user);

    Tasks.getUserTasks(user._id, function(tasks) {
      $scope.tasks = tasks;
    });
  });

  $scope.loadCompleted = function() {
    Tasks.getCompletedUserTasks($routeParams.id, function(data) {
      $scope.completedTasks = data;
      // console.log($scope.completedTasks);
    });
  };

  $scope.completeTask = function(index, task) {
    Tasks.editTask({_id: task._id, description:task.description, name:task.name, deadline:task.deadline, completed:true}, function(data) {
      // console.log(data);
      $scope.tasks.splice(index, 1);
    });
  };
}]);


demoControllers.controller('SettingsController', ['$scope' , '$window' , function($scope, $window) {
  $scope.url = $window.sessionStorage.baseurl;

  $scope.setUrl = function(){
    $window.sessionStorage.baseurl = $scope.url; 
    $scope.displayText = "URL set";
  };
}]);

demoControllers.filter('pagination', function() {
  return function(input, start) {
    start = parseInt(start, 10);
    return input.slice(start);
  };
});

