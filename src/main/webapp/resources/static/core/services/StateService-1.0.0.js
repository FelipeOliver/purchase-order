/**
 * 
 */
app.factory('StateService', ['$http', function($http) {

	var serverURL = function(url) {
		return SERVER_APP + '/state' + url;
	};
	
	/**
	 * Pega Todos
	 */
	var _getAll = function() {
		return $http.get(serverURL('/get/all'));
	};
	
	return {
		
		getAll : _getAll
		
	};
	
}]);
