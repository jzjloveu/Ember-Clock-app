import Ember from 'ember';

var Router = Ember.Router.extend({
  location: ClockAppENV.locationType
});

Router.map(function() {
  this.route('worldclock', {path: '/'});
  this.route('timer');
  this.route('stopwatch');
  this.route('addcity');
});

export default Router;
