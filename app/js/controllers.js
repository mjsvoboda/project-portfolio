'use strict';

/* Controllers */

var ppAppControllers = angular.module('ppAppControllers', []);

ppAppControllers.controller('HomeCtrl', ['$scope', '$http', '$log', 
	function($scope, $http, $log) {
		$http.get('projects/XPagesJSONLibrary.json').success(function(data) {
			$scope.dataForD3 = data;
		});
		
		$scope.dashboard = function (id, fData){
		    var barColor1 = '#3672a4';
		    var barColor2 = '#76c2e4';
		        
		    function segColor1(c){ return {"Completed":"#6998c9", "Operationally Completed":"#34495E", "Cancelled":"#E74C3C","Ongoing":"#4caf50","Soft Pipeline":"#f79321","Hard Pipeline":"#f7E301"}[c]; }
		    function segColor2(c){ return {"Completed":"#99c8f9", "Operationally Completed":"#64798E", "Cancelled":"#FF7C6C","Ongoing":"#7cdf80","Soft Pipeline":"#ffc351","Hard Pipeline":"#ffff31"}[c]; }
		    
		    // compute total for each Region.
		    fData.forEach(function(d){d.total=d.freq["Cancelled"] + d.freq["Completed"] + d.freq["Hard Pipeline"] + d.freq["Ongoing"] + d.freq["Operationally Completed"] + d.freq["Soft Pipeline"]; });

		    // function to handle histogram.
		    function histoGram(fD){
		        var hG={},    hGDim = {t: 40, r: 8, b: 50, l: 10};
		        hGDim.w = 500 - hGDim.l - hGDim.r, 
		        hGDim.h = 350 - hGDim.t - hGDim.b;
		            
		        //create svg for histogram.
		        var hGsvg = d3.select(id).append("svg")
		            .attr("width", hGDim.w + hGDim.l + hGDim.r)
		            .attr("height", hGDim.h + hGDim.t + hGDim.b).append("g")
		            .attr("transform", "translate(" + hGDim.l + "," + hGDim.t + ")");

		        // create function for x-axis mapping.
		        var x = d3.scale.ordinal().rangeRoundBands([0, hGDim.w], 0.2)
		                .domain(fD.map(function(d) { return d[0]; }));
		        
		        hGsvg.append("g").attr("class", "x axis")
		        .attr("transform", "translate(0," + hGDim.h + ")")
		        .call(d3.svg.axis().scale(x).orient("bottom"))
		         .selectAll("text")  
		        	.style("text-anchor", "middle")
		            //.attr("transform", "rotate(-10)" )
		        	.attr("dy", function (d, i)
		            	{
		            		if (i % 2) {
		            			return "15px";
		            		} else {
		            			return "35px";
		            		}
		            	})
		        
		       hGsvg.selectAll("g.x.axis g.tick line")
		           .attr("y2", function(d, i){
		        	   if ( i%2 ) //if it's an even multiple of 10%
		        		   return 10;
		        	   else
		        		   return 30;
		           	})
		           	
		        // Create function for y-axis map.
		        var y = d3.scale.linear().range([hGDim.h, 0])
		                .domain([0, d3.max(fD, function(d) { return d[1]; })]);

		        // Create bars for histogram to contain rectangles and freq labels.
		        var bars = hGsvg.selectAll(".bar").data(fD).enter()
		                .append("g").attr("class", "bar");
		        
		        //create the rectangles.

//		        bars.append("rect")
//		            .attr("x", function(d) { return x(d[0]); })
		 //           .attr("y", function(d) { return y(d[1]); })
		 //           .attr("width", x.rangeBand())
//		            .attr("height", function(d) { return hGDim.h - y(d[1]); })
//		            .attr('fill',barColor)
//		            .on("mouseover",mouseover)// mouseover is defined below.
//		            .on("mouseout",mouseout);// mouseout is defined below.
		        
		        
		        bars.append('defs')
		        .call(function (defs) {
		          // Appending the gradient
		          defs.append('linearGradient')
		            .attr('x1', '0%')
		            .attr('x2', '0%')
		            .attr('y1', '0%')
		            .attr('y2', '100%')
		            .attr('id', 'myGradient')
		            .call(function (gradient) {
		              gradient.append('stop')
		                .attr('offset', '0%')
		                .attr('stop-color', barColor1)
		                .attr('stop-opacity', '1');
		              gradient.append('stop')
		                .attr('offset', '100%')
		                .attr('stop-color', barColor2)
		                .attr('stop-opacity', '1');
		            });
		        });

		        
		        // Masking on a rect filled with a solid color
		        bars.append("rect")
		    		.attr('class', 'final-rect')
		            .attr("x", function(d) { return x(d[0]); })
		            .attr("y", function(d) { return y(d[1]); })
		            .attr("width", x.rangeBand())
		            .attr("height", function(d) { return hGDim.h - y(d[1]); })
		            .attr('fill', 'url(#myGradient)') //barColor
		            .style("stroke", '#888888')
		            .on("mouseover",mouseover)// mouseover is defined below.
		            .on("mouseout",mouseout);// mouseout is defined below.

		        
		        //Create the frequency labels above the rectangles.
		        bars.append("text").text(function(d){ return d3.format(",")(d[1])})
		            .attr("x", function(d) { return x(d[0])+x.rangeBand()/2; })
		            .attr("y", function(d) { return y(d[1])-5; })
		            .attr("text-anchor", "middle");
		        
		        function mouseover(d){  // utility function to be called on mouseover.
		            // filter for selected Region.
		            var st = fData.filter(function(s){ return s.Region == d[0];})[0],
		                nD = d3.keys(st.freq).map(function(s){ return {type:s, freq:st.freq[s]};});
		               
		            // call update functions of pie-chart and legend.    
		            pC.update(nD);
		            leg.update(nD);
		        }
		        
		        function mouseout(d){    // utility function to be called on mouseout.
		            // reset the pie-chart and legend.    
		            pC.update(tF);
		            leg.update(tF);
		        }
		        
		        // create function to update the bars. This will be used by pie-chart.
		        hG.update = function(nD, color1, color2){
		            // update the domain of the y-axis map to reflect change in frequencies.
		            y.domain([0, d3.max(nD, function(d) { return d[1]; })]);
		            
		            // Attach the new data to the bars.
		            var bars = hGsvg.selectAll(".bar").data(nD);
		            
		            bars.select('defs')
		            .call(function (defs) {
		              // Appending the gradient
		              defs.select('linearGradient')
		                .attr('x1', '0%')
		                .attr('x2', '0%')
		                .attr('y1', '0%')
		                .attr('y2', '100%')
		                .attr('id', 'myGradient')
		                .call(function (gradient) {
		                  gradient.select('stop')
		                    .attr('offset', '0%')
		                    .attr('stop-color', color1)
		                    .attr('stop-opacity', '1');
		                  gradient.select('stop:nth-child(2)')
		                    .attr('offset', '100%')
		                    .attr('stop-color', color2)
		                    .attr('stop-opacity', '1');
		                });
		            });
		            
		            // transition the height and color of rectangles.
		            bars.select("rect").transition().duration(500)
		                .attr("y", function(d) {return y(d[1]); })
		                .attr("height", function(d) { return hGDim.h - y(d[1]); })
		                .attr("fill", 'url(#myGradient)'); //

		            // transition the frequency labels location and change value.
		            bars.select("text").transition().duration(500)
		                .text(function(d){ return d3.format(",")(d[1])})
		                .attr("y", function(d) {return y(d[1])-5; });            
		        }        
		        return hG;
		    }
		    
		    // function to handle pieChart.
		    function pieChart(pD){
		        var pC ={},    pieDim ={w:250, h: 250};
		        pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;
		                
		        // create svg for pie chart.
		        var piesvg = d3.select(id).append("svg")
		            .attr("width", pieDim.w).attr("height", pieDim.h).append("g")
		            .attr("transform", "translate("+pieDim.w/2+","+pieDim.h/2+")");
		        
		        // create function to draw the arcs of the pie slices.
		        var arc = d3.svg.arc().outerRadius(pieDim.r - 10).innerRadius(0);

		        // create a function to compute the pie slice angles.
		        var pie = d3.layout.pie().sort(null).value(function(d) { return d.freq; });

		        // Draw the pie slices.
		        piesvg.selectAll("path").data(pie(pD)).enter().append("path").attr("d", arc)
		            .each(function(d) { this._current = d; })
		            .style("fill", function(d) { return segColor1(d.data.type); })
		            .on("mouseover",mouseover).on("mouseout",mouseout);

		        // create function to update pie-chart. This will be used by histogram.
		        pC.update = function(nD){
		            piesvg.selectAll("path").data(pie(nD)).transition().duration(500)
		                .attrTween("d", arcTween);
		        }        
		        // Utility function to be called on mouseover a pie slice.
		        function mouseover(d){
		            // call the update function of histogram with new data.
		            hG.update(fData.map(function(v){ 
		                return [v.Region,v.freq[d.data.type]];}),
		                segColor1(d.data.type), segColor2(d.data.type));
		        }
		        //Utility function to be called on mouseout a pie slice.
		        function mouseout(d){
		            // call the update function of histogram with all data.
		            hG.update(fData.map(function(v){
		                return [v.Region,v.total];}), barColor1, barColor2);
		        }
		        // Animating the pie-slice requiring a custom function which specifies
		        // how the intermediate paths should be drawn.
		        function arcTween(a) {
		            var i = d3.interpolate(this._current, a);
		            this._current = i(0);
		            return function(t) { return arc(i(t));    };
		        }    
		        return pC;
		    }
		    
		    // function to handle legend.
		    function legend(lD){
		        var leg = {};
		            
		        // create table for legend.
		        var legend = d3.select(id).append("table").attr('class','legend');
		        
		        // create one row per segment.
		        var tr = legend.append("tbody").selectAll("tr").data(lD).enter().append("tr");
		            
		        // create the first column for each segment.
		        tr.append("td").append("svg").attr("width", '12').attr("height", '12').append("rect")
		            .attr("width", '12').attr("height", '12')
					.attr("fill",function(d){ return segColor1(d.type); });
		            
		        // create the second column for each segment.
		        tr.append("td").text(function(d){ return d.type;});

		        // create the third column for each segment.
		        tr.append("td").attr("class",'legendFreq')
		            .text(function(d){ return d3.format(",")(d.freq);});

		        // create the fourth column for each segment.
		        tr.append("td").attr("class",'legendPerc')
		            .text(function(d){ return getLegend(d,lD);});

		        // Utility function to be used to update the legend.
		        leg.update = function(nD){
		            // update the data attached to the row elements.
		            var l = legend.select("tbody").selectAll("tr").data(nD);

		            // update the frequencies.
		            l.select(".legendFreq").text(function(d){ return d3.format(",")(d.freq);});

		            // update the percentage column.
		            l.select(".legendPerc").text(function(d){ return getLegend(d,nD);});        
		        }
		        
		        function getLegend(d,aD){ // Utility function to compute percentage.
		            return d3.format("%")(d.freq/d3.sum(aD.map(function(v){ return v.freq; })));
		        }

		        return leg;
		    }
		    
		    
		    
		    // calculate total frequency by segment for all Region.
//		    var tF = ['Soft Pipeline', 'Hard Pipeline', 'Ongoing', 'Operationally Completed', 'Completed', 'Cancelled'].map(function(d){ 
			
		    var tF = ['Hard Pipeline', 'Soft Pipeline', 'Ongoing', 'Operationally Completed', 'Completed', 'Cancelled'].map(function(d){
		        return {type:d, freq: d3.sum(fData.map(function(t){ return t.freq[d];}))}; 
		    });
		    
		    // calculate total frequency by Region for all segment.
		    var sF = fData.map(function(d){return [d.Region,d.total];});

		    var hG = histoGram(sF), // create the histogram.
		        pC = pieChart(tF), // create the pie-chart.
		        leg= legend(tF);  // create the legend.
		};
		
		//$scope.$watch("dataForD3", $scope.dashboard("#dashboard", $scope.dataForD3));
	}]);

ppAppControllers.controller('ProjectListCtrl', ['$scope', '$http', '$log', 
	function($scope, $http, $log) {
		$http.get('projects/projects.json').success(function(data) {
			$scope.projects = data;

			$scope.currentPage = 1;
			$scope.numPerPage = 15;
			$scope.totalItems = data.length;
			
			$scope.$watch("currentPage", function() {
				//var begin = (($scope.currentPage - 1) * $scope.numPerPage);
	        	//var end = begin + $scope.numPerPage;

				//$scope.filteredProjects = $scope.projects.slice(begin, end);
				$scope.begin =  (($scope.currentPage - 1) * $scope.numPerPage);
			});
			
			$scope.pageChanged = function() {
				$log.log('Page changed to: ' + $scope.currentPage);
			};
		});
	}]);

ppAppControllers.controller('ProjectDetailCtrl', ['$scope', '$stateParams', '$http', 'projectService', 
  function($scope, $stateParams, $http, projectService) {
    //$http.get('projects/' + $stateParams.id + '.json').success(function(data) {
	//  $scope.project = data;
	//});
	$scope.data = projectService.get({id: $stateParams.id}, function (){
		console.log($scope.data);
		$scope.project = $scope.data;
	});
	
	$scope.save = function() {
		$scope.data.$update(function () {
			console.log('update');
		});
		//projectService.save($scope.project, function () {
		//	console.log('saved');
		//});
	};
    
  }]);


ppAppControllers.controller('NavigationCtrl', ['$scope', '$location', '$state',
	function ($scope, $location, $state) {
		$scope.getClass = function (path) {
			if ($location.path().indexOf(path) > 0) {
				return 'active';
			} else {
				return '';
			}
		};
	}]);

ppAppControllers.controller('PaginationDemoCtrl', function ($scope, $log) {
	  $scope.totalItems = 400;
	  //$scope.currentPage = 4;
	  $scope.currentPage = $scope.mypage;
	  
	  $scope.setPage = function (pageNo) {
		  
	    //$scope.currentPage = pageNo;
		  $scope.currentPage = mypage;
	  };

	  $scope.pageChanged = function() {
		  $scope.setLimit ($scope.currentPage);
	    $log.log('Page changed to: ' + $scope.currentPage);
	  };

	});