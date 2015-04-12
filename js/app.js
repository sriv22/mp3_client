// var demoApp = angular.module('demoApp', ['demoControllers']);

var demoApp = angular.module('demoApp', ['ngRoute', 'demoControllers', 'demoServices']);

demoApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/firstview', {
    templateUrl: 'partials/firstview.html',
    controller: 'FirstController'
  }).
  when('/secondview', {
    templateUrl: 'partials/secondview.html',
    controller: 'SecondController'
  }).
  when('/settings', {
    templateUrl: 'partials/settings.html',
    controller: 'SettingsController'
  }).
  when('/llamalist', {
    templateUrl: 'partials/llamalist.html',
    controller: 'LlamaListController'
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
  // when("/userDetails", {
  //   templateUrl:"partials/userDetails.html",
  //   controller:"UserDetailController"
  // }).
  when("/tasklist", {
    templateUrl:"partials/tasklist.html",
    controller:"TasksController"
  }).
  when("/taskDetails", {
    templateUrl:"partials/taskDetails.html",
    controller:"TaskDetailController"
  }).
  when("/edittask", {
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