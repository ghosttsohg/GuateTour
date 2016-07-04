// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
// 'starter.services' is found in services.js

angular.module('starter', ['ionic', 'starter.controllers', 'services'])

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
    url: '/explore/exploreRegions?txtId&isSearch',
    views: {
      'menuContent': {
        templateUrl: 'templates/explore/exploreRegion.html'
      }
    }
  })
  
  .state('app.deptos', {
    url: '/explore/exploreDepto?txtId&isSearch',
    views: {
      'menuContent': {
        templateUrl: 'templates/explore/exploreDepto.html'
      }
    }
  })
  
  .state('app.sites', {
    url: '/explore/exploreSites?txtId&isSearch',
    views: {
      'menuContent': {
        templateUrl: 'templates/explore/exploreSites.html'
      }
    }
  })
  
  .state('app.siteProfile', {
    url: '/explore/exploreSiteProfile?txtId&txtTabId&isSearch',
    views: {
      'menuContent': {
        templateUrl: 'templates/explore/exploreSiteProfile.html'
      }
    }
  })
  
  .state('app.siteGallery', {
    url: '/explore/exploreSiteGalery?txtId&txtTabId',
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
		url: '/tour/tourTypeList?txtId&isSearch',
		views: {
		  'menuContent': {
			templateUrl: 'templates/tour/exploreTourType.html'
		  }
		}
	  })
  
  .state('app.tourList', {
		url: '/tour/tourList?txtId&isSearch',
		views: {
		  'menuContent': {
			templateUrl: 'templates/tour/exploreTour.html'
		  }
		}
	  })
  
  .state('app.tourDetails', {
		url: '/tour/tourDetails?txtId&isSearch',
		views: {
		  'menuContent': {
			templateUrl: 'templates/tour/exploreTourDetails.html'
		  }
		}
	  })
	  
  .state('app.tourSite', {
		url: '/tour/tourSite?txtId&isSearch',
		views: {
		  'menuContent': {
			templateUrl: 'templates/tour/exploreTourSite.html'
		  }
		}
	  })
	  
  .state('app.tourSiteProfile', {
		url: '/tour/tourSiteProfile?txtId&txtTabId',
		views: {
		  'menuContent': {
			templateUrl: 'templates/tour/exploreTourSiteProfile.html'
		  }
		}
	  })
  
  .state('app.ToursiteGallery', {
    url: '/explore/exploreTourSiteGalery?txtId&txtTabId',
    views: {
      'menuContent': {
        templateUrl: 'templates/tour/exploreTourSiteGallery.html'
      }
    }
  })
  
  .state('app.myTours', {
    url: '/myTour/myTours',
    views: {
      'menuContent': {
        templateUrl: 'templates/myTour/myTours.html'
      }
    }
  })
  
  .state('app.CreateTour', {
    url: '/myTour/createTour?txtIds',
    views: {
      'menuContent': {
        templateUrl: 'templates/myTour/createTour.html'
      }
    }
  })
  
  .state('app.SiteList', {
    url: '/myTour/siteList?txtIds&loadSitesList',
    views: {
      'menuContent': {
        templateUrl: 'templates/myTour/siteList.html'
      }
    }
  })
  
  .state('app.MyTourSiteList', {
    url: '/myTour/MyToutSiteList?txtId',
    views: {
      'menuContent': {
        templateUrl: 'templates/myTour/myTourSiteList.html'
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

  .state('app.suggestions', {
		url: '/moreActions/suggestions',
		views: {
		  'menuContent': {
			templateUrl: 'templates/moreActions/suggestions.html'
		  }
		}
	})
        
  ;
  // if none of the above states are matched, use this as the fallback
  //$urlRouterProvider.otherwise('/app/welcome');
 $urlRouterProvider.otherwise('/app/login');
});