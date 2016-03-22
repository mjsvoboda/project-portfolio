'use strict';

/* Services */

var ppAppServices = angular.module('ppAppServices', []);

ppAppServices.factory('projectService', ['$resource', function ($resource) {
	return $resource('projects/:id.json', {id: '@ProjectNumber' }, {
		update: {
			method: 'POST'
		}
	});
}]);

/*
phonecatServices.factory('Phone', ['$resource',
                                   function($resource){
                                     return $resource('phones/:phoneId.json', {}, {
                                       query: {method:'GET', params:{phoneId:'phones'}, isArray:true}
                                     });
                                   }]);
*/