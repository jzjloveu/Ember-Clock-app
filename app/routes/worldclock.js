import Ember from 'ember';

var WorldclockRoute = Ember.Route.extend({

  cachedCities: null,

  model: function() {
     var cachedCities = this.get('cachedCities');

     if(cachedCities !== null) {
        return cachedCities;
     }

    // this store find will return a promiseArray, it will be resolved when/if
    // the collection is actually loaded.
    // cannot use store all in model, since will return 0 when pass to controller
    var cities = this.store.find('citylist'); 
    this.set('cachedCities', cities);
    return cities;

  },
   setupController: function(controller, model) {
     controller.set('content', model);
     controller.propertyDidChange('content');
  }
});


export default WorldclockRoute;
