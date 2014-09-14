import Ember from 'ember';
import Utils from './utils';

var WorldclockController = Ember.ArrayController.extend({

  timerInterval: 1000/60,
  timer: null,
  isDigi: false,
  isEdit: false,

  contentDidChange: function() {
    this.updateCityInfo();
  }.observes('content'),

  hasContent: function() {
    return this.get('content').get('length') > 0;
  }.property('content'),

  updateCityInfo: function() {
    // get this recordArray from promiseArray in route,
    // make recordArray into array
    var content = this.get('content');

    // handle data directly as a recordArray, use objectAt(index) to
    // access elements
    for (var i=0, iLen=content.get('length'); i<iLen; i++) {
     this.updateTimeForCity(content.objectAt(i));
    }

    // handle data as an array
    // content = content.toArray();
    // for (var i=0, iLen=content.length; i<iLen; i++) {
    //   this.updateTimeForCity(content[i]);
    // }
    
    // cancel any other timers that might be assigned since the last time
    Ember.run.cancel(this.get('timer'));
    this.set('timer', Ember.run.later(this, 'updateCityInfo', this.get('timerInterval')));
  },

  updateTimeForCity: function(city) {
    var myTime       = new Date(),
        utcTime      = new Date(new Date().setMinutes(new Date().getMinutes()+myTime.getTimezoneOffset())),
        cityTime     = new Date(new Date(utcTime.getTime()).setMinutes(new Date().getMinutes()+city.get('timezoneOffset'))),
        isToday      = cityTime.getDate() === myTime.getDate(),
        isTomorrow   = cityTime.getDate() > myTime.getDate() || cityTime.getMonth() > myTime.getMonth() || cityTime.getFullYear() > myTime.getFullYear(),
        hourTimeDiff = parseInt((cityTime.getTime() - myTime.getTime()) / (1000 * 60 * 60),10),
        fmtString    = '%@ hour%@ ahead';

    if(hourTimeDiff <  0) {
      fmtString = '%@ hour%@ behind';
      hourTimeDiff *= -1;
    } else if(hourTimeDiff === 0) {
      fmtString = '';
    }
    
    var diffString = fmtString.fmt(hourTimeDiff, hourTimeDiff !== 1 ? 's' : ''),
        localTime  = '',
        localTime2  = '',
        hours      = cityTime.getHours(),
        minutes    = cityTime.getMinutes(),
        seconds    = cityTime.getSeconds(),
        millisec   = cityTime.getMilliseconds();

    if (hours > 11) {
      if (hours > 12) {
        hours = hours - 12;
      }
      localTime  = hours + ':' + Utils.addZeroes(minutes) + ' PM';
      localTime2 = hours + ':' + minutes + ':' + seconds + ':' + millisec + ' PM';
    } else {

      // If it is midnight, show it as 12 instead of 0.
      if(hours === 0) {
        hours = 12;
      }

      localTime  = hours + ':' + Utils.addZeroes(minutes) + ' AM';
      localTime2 = hours + ':' + minutes + ':' + seconds + ':' + millisec + ' AM';
    }

    city.set('day',       isToday ? 'Today' : isTomorrow ? 'Tomorrow' : 'Yesterday')
        .set('hours',     diffString)
        .set('localTime', localTime)
        .set('localTime2', localTime2);
  },

  actions: {
    showDone: function() {
      if(this.get('isEdit')){
        this.set('isEdit', false);
      }
      else{
        this.set('isEdit', true);
      }
    },

    showDigi: function() {
      if(!this.get('isEdit')){
          if(this.get('isDigi')){
            this.set('isDigi', false);
          }
          else{
            this.set('isDigi', true);
          }
      }
    },

    removeCity: function (city) {
      var self = this;
      this.store.find('citylist',city.id).then(function(post){
          post.destroyRecord();
      }).then(function() {
        self.updateCityInfo();
      });
    }
  }
});


export default WorldclockController;
