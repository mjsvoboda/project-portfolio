'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('Project Portfolio App', function() {

  describe('Project list view', function() {

    beforeEach(function() {
      browser.get('app/index.html');
    });

    it('should filter the project list as a user types into the search box', function () {
    	var projectList = element.all(by.repeater('project in projects'));
    	var query = element(by.model('query'));
    	
    	expect(projectList.count()).toEqual(15);
    	
    	query.sendKeys('AFGF06').then(function(){
    		expect(projectList.count()).toEqual(1);
        });
    	
    	query.clear();
    	query.sendKeys('AFGF').then(function(){
    		expect(projectList.count()).toEqual(6);
        });
    });
  });
});
