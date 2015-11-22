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
    url: '/search/search?txtPattern',
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
        templateUrl: 'templates/explore/exploreRegion.html'
        //controller: 'exploreRegionCtrl'
      }
    }
  })
  
  .state('app.deptos', {
    url: '/explore/exploreDepto?txtRegionId',
    views: {
      'menuContent': {
        templateUrl: 'templates/explore/exploreDepto.html'
      }
    }
  })
  
  .state('app.sites', {
    url: '/explore/exploreSites?txtDepartmentId',
    views: {
      'menuContent': {
        templateUrl: 'templates/explore/exploreSites.html'
      }
    }
  })
  
  .state('app.siteProfile', {
    url: '/explore/exploreSiteProfile?txtSiteId&txtTabId',
    views: {
      'menuContent': {
        templateUrl: 'templates/explore/exploreSiteProfile.html'
      }
    }
  })
  
  .state('app.siteGallery', {
    url: '/explore/exploreSiteGalery?txtSiteId&txtTabId',
    views: {
      'menuContent': {
        templateUrl: 'templates/explore/exploreSiteGallery.html'
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

  .state('app.tourTypeList', {
		url: '/tour/tourTypeList',
		views: {
		  'menuContent': {
			templateUrl: 'templates/tour/exploreTourType.html'
		  }
		}
	  })
  
  .state('app.tourList', {
		url: '/tour/tourList?txtTypeId',
		views: {
		  'menuContent': {
			templateUrl: 'templates/tour/exploreTour.html'
		  }
		}
	  })
  
  .state('app.tourDetails', {
		url: '/tour/tourDetails?txtTourId',
		views: {
		  'menuContent': {
			templateUrl: 'templates/tour/exploreTourDetails.html'
		  }
		}
	  })
	  
  .state('app.tourSite', {
		url: '/tour/tourSite?txtSiteId',
		views: {
		  'menuContent': {
			templateUrl: 'templates/tour/exploreTourSite.html'
		  }
		}
	  })
	  
  .state('app.tourSiteProfile', {
		url: '/tour/tourSiteProfile?txtSiteId&txtTabId',
		views: {
		  'menuContent': {
			templateUrl: 'templates/tour/exploreTourSiteProfile.html'
		  }
		}
	  })
  
  .state('app.ToursiteGallery', {
    url: '/explore/exploreTourSiteGalery?txtSiteId&txtTabId',
    views: {
      'menuContent': {
        templateUrl: 'templates/tour/exploreTourSiteGallery.html'
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
	
	.state('app.login', {
      url: '/login',
      views: {
        'menuContent': {
          templateUrl: 'templates/login.html',
        }
      }
    })
	  
	.state('app.signin', {
		url: '/moreActions/signin',
		views: {
		  'menuContent': {
			templateUrl: 'templates/moreActions/signin.html'
		  }
		}
	})
        
  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/welcome');
});