import DS from 'ember-data';
 
var CityList = DS.Model.extend({
  cityName: DS.attr(),
  timezoneName: DS.attr(),
  timezoneOffset: DS.attr()
});

export default CityList;