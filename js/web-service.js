angular.module('WebService', ['ionic', 'ngResource'])

.factory('Post', function($resource) {
  return $resource('/api/post/:id');
})

.controller('wsController', function($scope, Post) {
  // Get all posts
  $scope.posts = Post.query();

  // Our form data for creating a new post with ng-model
  $scope.postData = {};
  $scope.newPost = function() {
    var post = new Post($scope.postData);
    post.$save();
  }
})

.controller('LoginCtrl', function($scope, $state, DataBaseService, $stateParams) {
	console.log("LoginCtrl");
	
	setTimeout(function() {
        Waves.displayEffect();
        // Mi.motion.panInLeft({
            // selector: '.animate-pan-in-left'
        // });
    }, 1500);
  	
    $scope.goTo = function(txtState, tourId){
		console.log("$scope.goTo");
		console.log("txtState:"+txtState);
		console.log("txtTourId:"+tourId);
		$state.go(txtState, {txtTourId: tourId});		  
    };
})

;

//angular.module('ionicApp', ['ionic', 'ngResource'])
//
//.factory('Post', function($resource) {
//  return $resource('/api/post/:id');
//})
//
//.controller('MainCtrl', function($scope, Post) {
//  // Get all posts
//  $scope.posts = Post.query();
//
//  // Our form data for creating a new post with ng-model
//  $scope.postData = {};
//  $scope.newPost = function() {
//    var post = new Post($scope.postData);
//    post.$save();
//  }
//});