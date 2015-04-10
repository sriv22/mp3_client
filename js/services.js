// js/services/todos.js

function getRequest(http, window, _data, path, cb) {
  if(_data !== null) cb(_data);

  http.get(getBaseUrl(window) + path)
    .success(function(data, status, headers, config) {
      _data = data.data;
      cb(_data, "");
    })
    .error(function(data, status, headers, config) {
      cb(null, data);
    });
}

function postRequest(http, window, _data, newData, path, cb) {
  console.log("in here");
  console.log(newData);
  http.post(getBaseUrl(window) + path, newData)
    .success(function(data, status, headers, config) {
      cb(data, "");
    })
    .error(function(data, status, headers, config) {
      cb(null, data);
    });
}

function putRequest(http, window, newData, path, cb) {
  http.put(getBaseUrl(window) + path, newData)
    .success(function(data, status, header, config) {
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
            addUser: function(user){
                // console.log("calling add user");
                // console.log(user);
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.post(baseUrl+'/api/users',user);
            },

            deleteUser : function(id, cb) {
                deleteRequest($http, $window, '/api/users/' + id, cb);
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
            deleteTask : function(id, cb) {
                deleteRequest($http, $window, '/api/tasks/' + id, cb);
            },
            getSortedTasks : function(sort, order, cb) {
                getRequest($http, $window, _data, '/api/tasks?sort={"' + sort + '": ' + order + '}', cb);
            },
            getCompletedUserTasks : function(id, cb) {
                getRequest($http, $window, _data, '/api/tasks?where={"assignedUser": "'+ id + '", "completed": true}', cb)
            },
            getTask : function(id, cb) {
                getRequest($http, $window, _data, '/api/tasks/' + id, cb);
            }
        }
    }])
    .factory('Llamas', function($http, $window) {      
        return {
            get : function() {
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.get(baseUrl+'/api/llamas');
            }
        }
    });

