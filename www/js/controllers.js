angular.module('magic8.controllers', [])

.controller('MagicCtrl', function($scope, $timeout, $ionicPlatform, $cordovaDeviceMotion) {

  $scope.currentAnimation = 'wiggle';
  $scope.currentAnswer = "?";

  $scope.answers = [
    "Not Today",
    "Soon",
    "Hell Yeah",
    "Umm",
    "Sure",
    "No",
    "Of course",
    "Who Knows?",
    "Negative",
    "Bad idea",
    "Maybe?",
    "Ask again",
    "No clue!",
    "Positive",
    "Hmmm",
    "Yes!",
    "Yup"
  ]


  randomizeAnswers = function() {

    var newList = [];

   for (i = 0; i < $scope.answers.length; i++){
    if (Math.random() * 10 > 5) {
      newList.push($scope.answers[i]);
    } else {
      newList.unshift($scope.answers[i]);
    }

   }

   $scope.answers = newList;

  };



  $scope.shake = function(){

      $scope.currentAnswer = "";
      $scope.currentAnimation = 'shake';
      randomizeAnswers();

     setTimeout(function(){
        $scope.currentAnswer = $scope.answers[0];
        $scope.currentAnimation = 'wiggle';
        $scope.$apply();
      }, 4000);

  };

 /*SHAKE DETECTION CODE GOES HERE!*/
  document.addEventListener("deviceready", function () {

   // watch Acceleration options
    $scope.options = {
        frequency: 1001, // Measure every 100ms
        deviation : 25  // We'll use deviation to determine the shake event, best values in the range between 25 and 30
    };

    // Current measurements
    $scope.measurements = {
        x : null,
        y : null,
        z : null,
        timestamp : null
    }

    // Previous measurements
    $scope.previousMeasurements = {
        x : null,
        y : null,
        z : null,
        timestamp : null
    }

    // Watcher object
    $scope.watch = null;

    // Start measurements when Cordova device is ready

        //Start Watching method
        $scope.startWatching = function() {

 // Clean previous measurements
            $scope.previousMeasurements = {
                    x: null,
                    y: null,
                    z: null
            }
            // Device motion configuration
            $scope.watch = $cordovaDeviceMotion.watchAcceleration($scope.options);

            // Device motion initilaization
            $scope.watch.then(null, function(error) {
                console.log('Error');
            },function(result) {
                // Set current data
                $scope.measurements.x = result.x;
                $scope.measurements.y = result.y;
                $scope.measurements.z = result.z;
                $scope.measurements.timestamp = result.timestamp;

                // Detecta shake
                // console.log('trying to detect shake');
                $scope.detectShake(result);

            });

        };



        // Stop watching method
        $scope.stopWatching = function() {
            $scope.watch.clearWatch();
        };

        $scope.processShake = function(){
          console.log('Shake detected'); // shake detected
          $scope.shake();
        };

        // Detect shake method
        $scope.detectShake = function(result) {


            //Object to hold measurement difference between current and old data
            var measurementsChange = {};

            // Calculate measurement change only if we have two sets of data, current and old
            if ($scope.previousMeasurements.x !== null) {
                measurementsChange.x = Math.abs($scope.previousMeasurements.x, result.x);
                measurementsChange.y = Math.abs($scope.previousMeasurements.y, result.y);
                measurementsChange.z = Math.abs($scope.previousMeasurements.z, result.z);
            }

            // If measurement change is bigger then predefined deviation
            if (measurementsChange.x + measurementsChange.y + measurementsChange.z >= $scope.options.deviation) {

                $scope.stopWatching();
                $cordovaDeviceMotion.clearWatch($scope.watch) // Stop watching because it will start triggering like hell
                $scope.processShake();

                setTimeout(function(){
                  $scope.startWatching();
                }, 5000);
                // Clean previous measurements after succesfull shake detection, so we can do it next time


            } else {
                // On first measurements set it as the previous one
                $scope.previousMeasurements = {
                    x: result.x,
                    y: result.y,
                    z: result.z
                }
            }

        }

      $scope.startWatching();

    }); //end ready device

    $scope.$on('$ionicView.beforeLeave', function(){
        $scope.watch.clearWatch(); // Turn off motion detection watcher
    });



  /*SHAKE DETECTION CODE GOES HERE!*/




})


