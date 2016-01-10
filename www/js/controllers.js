angular.module('magic8.controllers', [])

.controller('MagicCtrl', function($scope) {

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
    "Hmmm"
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

})


