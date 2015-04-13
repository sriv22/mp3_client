// js/services/todos.js

function getRequest(http, window, _data, path, cb) {
  if(_data !== null) cb(_data);
  // console.log(getBaseUrl(window)+path);
  http.get(getBaseUrl(window) + path)
    .success(function(data, status, headers, config) {
      _data = data.data;
      // console.log("in getRequest");
      // console.log(path);
      // console.log(_data);
      // console.log(_data);
      cb(_data, "");
    })
    .error(function(data, status, headers, config) {
      cb(null, data);
    });
}

function postRequest(http, window, _data, newData, path, cb) {
  http.post(getBaseUrl(window) + path, newData)
    .success(function(data, status, headers, config) {
      cb(data, "");
    })
    .error(function(data, status, headers, config) {
      cb(null, data);
    });
}

function putRequest(http, window, newData, path, cb) {
  // console.log("in putRequest");
  // console.log(newData);
  // console.log(getBaseUrl(window) + path);
  http.put(getBaseUrl(window) + path, newData)
    .success(function(data, status, header, config) {
        // console.log("data in putRequest");
        // console.log(data);
      cb(data, "");
    })
    .error(function(data, status, headers, config) {
      cb(null, data);
    });
}

function deleteRequest(http, window, path, cb) {
  http.delete(getBaseUrl(window) + path)
    .success(function(data, status, headers, config) {
      cb(data, "");
    })
    .error(function(data, status, headers, config) {
      cb(null, data);
    });
}

angular.module('demoServices', [])
        .factory('CommonData', function(){
        var data = null;
        return{
            getData : function(){
                return data;
            },
            setData : function(newData){
                data = newData;                
            }
        }
    })
    .factory('Users', ['$http', '$window', function($http, $window) { 
        var _data = null;

        return {
            get : function(cb) {
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.get(baseUrl+'/api/users');
                //getRequest($http, $window, _data, '/api/users', cb);
            },
            getUser : function(id, cb) {
                // console.log(id);
                getRequest($http, $window, _data, '/api/users/' + id, cb);
            },
            addUser: function(user){
                // console.log("calling add user");
                // console.log(user);
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.post(baseUrl+'/api/users',user);
            },
            deleteUser : function(id, cb) {
                deleteRequest($http, $window, '/api/users/' + id, cb);
            },
            getSparseUsers : function(cb) {
                getRequest($http, $window, _data, '/api/users?select={"name": 1, "_id": 1}', cb);
            }

        }
    }])
    .factory('Tasks', ['$http', '$window', function($http, $window) {      
        var _data = null;
        
        return {
            get : function() {
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.get(baseUrl+'/api/tasks');
            }, 
            getUserTasks : function(id, cb) {
                getRequest($http, $window, _data, '/api/tasks?where={"assignedUser": "'+ id + '", "completed": false}', cb);
            },
            deleteTask : function(id, cb) {
                deleteRequest($http, $window, '/api/tasks/' + id, cb);
            },
            getSortedTasks : function(sort, order, cb) {
                getRequest($http, $window, _data, '/api/tasks?sort={"' + sort + '": ' + order + '}', cb);
            },
            getCompletedUserTasks : function(id, cb) {
                getRequest($http, $window, _data, '/api/tasks?where={"assignedUser": "'+ id + '", "completed": true}', cb);
            },
            getTask : function(id, cb) {
                getRequest($http, $window, _data, '/api/tasks/' + id, cb);
            },
            editTask : function(task, cb) {
                putRequest($http, $window, task, '/api/tasks/' + task._id, cb);
            },
            newTask : function(task, cb) {
                postRequest($http, $window, _data, task, '/api/tasks', cb);
            }
        }
    }]);