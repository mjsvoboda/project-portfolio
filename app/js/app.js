'use strict';

/* App Module */

var ppApp = angular.module('ppApp', [
    'ngResource',
	'ui.router',
	'ui.bootstrap',
	'ppAppControllers',
	'ppAppServices'
]);

ppApp.config(['$stateProvider', '$urlRouterProvider',
               function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/projects');

    $stateProvider
     .state('administrative', {
        url: '',
        templateUrl: 'partials/common/layout.html',
        abstract: true,
      })
      .state('administrative.home', {
        url: '/home',
        templateUrl: 'partials/home.html'
      })
      .state('administrative.projects', {
        url: '/projects',
        templateUrl: 'partials/project-list.html',
        controller: 'ProjectListCtrl'
      })
      .state('administrative.project', {
        url: '/project/:id',
        templateUrl: 'partials/project-detail.html',
		controller: 'ProjectDetailCtrl'
      })
}]);
