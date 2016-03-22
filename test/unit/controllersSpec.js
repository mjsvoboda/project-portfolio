'use strict';

/* jasmine specs for controllers go here */
describe('Project Portfolio controllers', function() {

  describe('ProjectListCtrl', function(){
    var scope, ctrl, $httpBackend;

    beforeEach(module('ppApp'));
    
    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('projects/projects.json').
          respond([{ProjectNumber: 'AFGF01'}, {ProjectNumber: 'AFGF02'}]);

      scope = $rootScope.$new();
      ctrl = $controller('ProjectListCtrl', {$scope: scope});
    }));

   

    it('should create "projects" model with 2 projects fetched from xhr', function() {
      expect(scope.projects).toBeUndefined();
      $httpBackend.flush();

      expect(scope.projects).toEqual([{ProjectNumber: 'AFGF01'},{ProjectNumber: 'AFGF02'}]);
    });
  });
});
