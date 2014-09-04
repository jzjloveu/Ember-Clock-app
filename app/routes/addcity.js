import Ember from 'ember';

var AddCityRoute = Ember.Route.extend({
	setupController: function(controller, context) {
	    controller.reset();
	  }
});

export default AddCityRoute;