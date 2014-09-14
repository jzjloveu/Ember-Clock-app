import Ember from 'ember';
import Utils from './utils';

var AddCityController = Ember.ArrayController.extend({
	cachedCities: null,
	noResult: false,
	notice: '',

	reset: function() {
	    this.setProperties({
	      cachedCities: null,
	      searchVal: ''
	    });
	},

	actions: {
		addCity: function (citydata) {
			// create a stroe record by specified attribute
			// var cityinfo = this.store.createRecord('citylist', { 
		    //      cityName: citydata.cityName,
	        //		timezoneName: citydata.timezoneName,
	        //	    timezoneOffset: citydata.timezoneOffset
	        //   });
		    var cityinfo = this.store.push('citylist',citydata);
	     	cityinfo.save();
	     	this.transitionTo('worldclock');
		}
	},

	searchObserver: function() {
		this.set('cachedCities', null);
		var keyword = this.get('searchVal');
		if(!keyword || keyword.length === 0) {
			this.set('notice', 'Please type to find a city.');
		}
		else if(keyword.length <= 2) {
			this.set('notice', 'Keep typing...');
		}
		else {
			Utils.index = '';
			this.set('notice', '');
			this.searCities(keyword);
			this.set('notice', 'No results found, try another city.');
		}
	}.observes('searchVal'),

    searCities: function(keyword) {
	    var self = this;
	    return Ember.$.ajax({
	      url: 'http://coen268.peterbergstrom.com/timezones.php?search=' + keyword,
	      dataType: 'jsonp'
	      }).then(function(response) {
		      var cities = [];
		      if (response && response.length) {
		        for(var i=0; i<response.length; i++) {
		          cities.push(Ember.Object.create(response[i]));
		        }
		      }
		      self.set('cachedCities', cities);
		});
    }
});


export default AddCityController;
