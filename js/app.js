/**
 * AngularJS module to process a form.
 */
angular.module('myApp', ['ajoslin.promise-tracker'])
  .controller('help', function ($scope, $http, $log, promiseTracker, $timeout) {
    $scope.sourceTypeOptions = {
      'inmobi': 'Inmobi',
      'aerserv': 'Aerserv',
      'inmobi-publisher': 'Inmobi Publisher',
      'aerserv-publisher': 'Aerserv Publisher',
      'other': 'Other'
    };

    // Inititate the promise tracker to track form submissions.
    $scope.progress = promiseTracker();

    // Form submit handler.
    $scope.submit = function(form) {
      // Trigger validation flag.
      $scope.submitted = true;

      // If form is invalid, return and let AngularJS show validation errors.
      /*if (form.$invalid) {
        return;
      }*/

      // Default values for the request.
      var config = {
        params : {
          'userId' : $scope.userId,
          'userIdType' : $scope.userIdType,
          'sourceType' : $scope.sourceType,
          'sourceName' : $scope.sourceName,
          'sourceId' : $scope.sourceId
        },
      };


      /*var req = {
       method: 'GET',
       url: 'http://dsr.data.dfw1.inmobi.com:8080'
      }

      $http(req).then(function(response) {
                                        $scope.greeting = response.data;
                                        console.log(response);
                                    },
                                    function(error) {
                                        console.log(error);
                                    });*/

      // Perform JSONP request.
      var url = "http://dsr.data.dfw1.inmobi.com:8080/";
      $log.info('TEST url' +  url);
      var $promise = $http.get(url)
        .success(function(data, status, headers, config) {
          $log.debug('TEST Log');
          $log.debug(status);
          $log.debug(data.status);
          if (status == 200) {
            $scope.userId = null;
            $scope.userIdType = null;
            $scope.sourceType = null;
            $scope.sourceName = null;
            $scope.sourceId = null;
            $scope.messages = 'Your form has been sent!';
            $scope.submitted = false;
          } else {
            $scope.messages = 'Oops, we received your request, but there was an error processing it.';
            $log.error(data);
          }
        })
        .error(function(data, status, headers, config) {
          $log.info('Error - data' + data);
          $log.info('Error - status' + status);
          $scope.progress = data;
          $scope.messages = 'There was a network error. Try again later.';
          $log.error(data);
        })
        .finally(function() {
          // Hide status messages after three seconds.
          $timeout(function() {
            $scope.messages = null;
          }, 5000);
        });

      // Track the request and show its progress to the user.
      $scope.progress.addPromise($promise);
    };
  });
