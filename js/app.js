// var demoApp = angular.module('demoApp', ['ngRoute', 'demoControllers', 'demoServices']);
var demoApp = angular.module('demoApp', ['ngRoute', 'demoControllers', 'demoServices']);

demoApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/settings', {
    templateUrl: 'partials/settings.html',
    controller: 'SettingsController'
  }).
  when("/userlist", {
    templateUrl:"partials/userlist.html", 
    controller:"UsersController" 
  }).
  when("/addUserView", {
    templateUrl:"partials/addUserView.html", 
    controller:"AddUserController" 
  }).
  when("/userlist/:id", {
    templateUrl:"partials/userDetails.html",
    controller:"UserDetailController"
  }).
  when("/tasklist", {
    templateUrl:"partials/tasklist.html",
    controller:"TasksController"
  }).
  when("/tasklist/:id", {
    templateUrl:"partials/taskDetails.html",
    controller:"TaskDetailController"
  }).
  when("/edittask/:id", {
    templateUrl:"partials/edittask.html",
    controller:"EditTaskController"
  }).
  when("/addtask", {
    templateUrl:"partials/addtask.html",
    controller:"NewTaskController"
  }).
  otherwise({
    redirectTo: '/settings'
  });
}]);