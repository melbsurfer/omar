'use strict';
omarApp.controller('wfsCtrl', ['$scope', '$http', '$filter', '$log', '$q', 'usSpinnerService', function ($scope, $http, $filter, $log, $q, usSpinnerService) {

    //OpenLayers.ProxyHost = "/ogc/wfsParser/proxyWFS?url="

    $scope.source = [];
	$scope.endPoint = 'http://demo.boundlessgeo.com/geoserver/wfs';
    //$scope.endPoint = 'http://omar.ossim.org/omar/wfs';
    //$scope.endPoint = 'http://localhost:8080/geoserver/wfs';
    //$scope.endPoint = 'http://demo.opengeo.org/geoserver/wfs';
    //$scope.endPoint = 'http://giswebservices.massgis.state.ma.us/geoserver/wfs';
    //$scope.endPoint = 'http://clc.developpement-durable.gouv.fr/geoserver/wfs';
    //$scope.endPoint = 'http://localhost:8080/omar/wfs'
    //$scope.endPoint = 'http://localhost:8080/wfs';
    //$scope.endPoint = 'http://10.0.10.183/geoserver/wfs';

    $scope.showFeatureTypeSelect = false;
    $scope.showFeatureTypeTable = false;
    $scope.showGetFeatureTable = false;
    $scope.featureTypeItem = {};
	$scope.featureTypes = [];
     
    //$scope.getCapabilitiesUrl = '?service=WFS&version=1.1.0&request=GetCapabilities';
    //$scope.describeFeatureUrl = '?service=WFS&version=1.1.0&request=DescribeFeatureType&typeName=';
	//$scope.getFeatureUrl = '?service=WFS&version=1.1.0&request=GetFeature&outputFormat=JSON&maxFeatures=50&typeName=';
 	
 	var wfsClient; 

 	//TODO: Move to a factory
	//Refactored: 10.05.2015 - GetCapabilities 
	$scope.getCapabilities = function () {
        $log.warn('outputFormat', $scope.outputFormat);
		wfsClient = new OGC.WFS.Client($scope.endPoint);

		$scope.showFeatureTypeSelect = false;
		$scope.showFeatureTypeTable = false;

		//Refactored: 10-06.2015 - Use the Client request from wfsClient library
        $scope.capabilities = wfsClient.getFeatureTypes();
        $log.debug('$scope.capabilities', $scope.capabilities);
        $log.debug('$scope.capabilities.length', $scope.capabilities.length);
        if ($scope.capabilities.length >= 1){

			$scope.showFeatureTypeSelect = true;

		}
		else{
			$scope.showFeatureTypeSelect = false;
			$scope.showFeatureTypeTable = false;
			alert('Error. Could not retrieve data from end point.  Please check the URL and try again.')
		}

	}
	
	//TODO: Move to a factory
	// DescribeFeature
    $scope.describeFeature = function () {

		$scope.columns = wfsClient.getFeatureTypeSchema($scope.selectedCapability.name, $scope.selectedCapability.featureNS).featureTypes[0].properties;
		$log.debug('$scope.columns (describeFeature)', $scope.columns); 
		$log.debug('$scope.columns.length', $scope.columns.length);
		if($scope.columns.length >= 1){
			$scope.getFeature();
			$scope.showFeatureTypeTable = true;
		}

	}
	
	//TODO: Move to a factory
	// GetFeature
	$scope.getFeature = function () {

        usSpinnerService.spin('spinner');

		// $scope.getFeatureObj = wfsClient.getFeature('omar:raster_entry', 'http://omar.ossim.org', "file_type='nitf'", function(it) {
		//	$log.warn('getFeature', it);
  		// } );

		var deferred = $q.defer();

		wfsClient.getFeature(
			$scope.selectedCapability.name,
			$scope.selectedCapability.featureNS,
			$scope.outputFormat,
			undefined,
            //"STATE_ABBR='IN'",
			function(data) {	

				deferred.resolve(data);

        	});

			var promise = deferred.promise;
			promise.then(function(data){

				$scope.features = data;
				$log.warn('$scope.features', $scope.features);
				$scope.showGetFeatureTable = true;
                usSpinnerService.stop('spinner');

			});

	}
}]);