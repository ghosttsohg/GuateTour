// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    
    var itRegionValues = [
		"('Metropolitana', 'Info region metropolitana')",
		"('Central', 'Info region Central')",
		"('Sur-Occidente', 'Info region sur-occidente')",
		"('Nor-Occidente', 'Info region nor-occidente')",
		"('Peten', 'Info region peten')",
		"('Norte', 'Info region norte')",
		"('Nor-Oriental', 'Info region nor-oriental')",
		"('Sur-Oriental', 'Info region sur-oriental')"
	];

    app.openDb();
    app.dropTable();
    app.createTable("region", "regionId INTEGER PRIMARY KEY ASC, name TEXT, information TEXT");
    app.insertRow("region", "(name, information)", itRegionValues);

  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search/search.html'
      }
    }
  })
  
  .state('app.exploreRegions', {
    url: '/explore/exploreRegions',
    views: {
      'menuContent': {
        templateUrl: 'templates/explore/exploreRegions.html'
        //controller: 'exploreRegionCtrl'
      }
    }
  })

    .state('app.deptos', {
    url: '/deptos',
    views: {
      'menuContent': {
        templateUrl: 'templates/metropolitan/deptos.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })

  .state('app.toursList', {
		url: '/tours/toursList',
		views: {
		  'menuContent': {
			templateUrl: 'templates/tours/toursList.html'
		  }
		}
	  })
  
  .state('app.moreActions', {
		url: '/moreActions/moreActions',
		views: {
		  'menuContent': {
			templateUrl: 'templates/moreActions/moreActions.html'
		  }
		}
	})
	
  .state('app.help', {
		url: '/moreActions/help',
		views: {
		  'menuContent': {
			templateUrl: 'templates/moreActions/help.html'
		  }
		}
	})

    .state('app.welcome', {
      url: '/welcome',
      views: {
        'menuContent': {
          templateUrl: 'templates/welcome.html',
        }
      }
    })
	
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })
	
  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/welcome');
});
