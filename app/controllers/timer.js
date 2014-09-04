import Ember from 'ember';
import Utils from './utils';

var TimerController = Ember.Controller.extend({

  hours:     0,
  minutes:   0,
  totalTime: '00:00',
  timeLeft:  0,
  
  snoozeDuration: 10 * 1000 * 60, // 10 min
  timeInterval:   1000,

  isRunning:      false,
  isPaused:       false,

  leftButtonClass: function() {
    if (this.get('isRunning') || this.get('isPaused')) {
      return 'button-cancel';
    }
    return 'button-start';
  }.property('isRunning', 'isPaused'),
  
  leftButtonLabel: function() {
    if (this.get('isRunning') || this.get('isPaused')) {
      return 'Cancel';
    }
    return 'Start';
  }.property('isRunning', 'isPaused'),

  rightButtonClass: function() {
    if (this.get('isPaused')) {
      return 'button-resume';
    }
    return 'button-pause';
  }.property('isPaused'),

  rightButtonLabel: function() {
    if (this.get('isPaused')) {
      return 'Resume';
    }
    return 'Pause';
  }.property('isPaused'),

  rightButtonDisabled: function() {
    return !(this.get('isRunning') || this.get('isPaused'));
  }.property('isRunning', 'isPaused'),
  
  hideInputs: function() {
    return this.get('isRunning') || this.get('isPaused');
  }.property('isRunning', 'isPaused'),
  
  actions: {
    leftButton: function() {
      if(this.get('isRunning') || this.get('isPaused')) {
        this.cancel();
      } else {
        this.start();
      }
    },

    rightButton: function() {
      if(this.get('isRunning')) {
        this.pause();
      } else {
        this.resume();
      }
    }
  },

  start: function() {

    var timerDurationInMilliseconds = (this.get('hours') * 3600000) +  (this.get('minutes') * 60000);

    if(timerDurationInMilliseconds !== 0) {
      this.set('timeLeft',  timerDurationInMilliseconds)
          .set('isRunning', true)
          .set('isPaused',  false);

      this.handleTimer();
    }
  },

  cancel: function() {
    this.set('isRunning', false)
        .set('isPaused',  false)
        .set('timeLeft',  0);
  },

  pause: function() {
    this.set('isRunning', false)
        .set('isPaused',  true); 
  },

  resume: function() {

    if(!this.get('rightButtonDisabled')) {

      this.set('isRunning', true)
          .set('isPaused',  false);
                           
      this.handleTimer();
    }
  },

  alarm: function() {
    var turnedOff = confirm("Alarm! If you want to snooze, press cancel.");

    if(!turnedOff) {
      this.set('timeLeft',this.snoozeDuration); // 10 minutes
      this.handleTimer();
    } else {
      this.cancel();
    }
  },

  handleTimer: function() {

    if(this.get('isRunning')) {
      var timeLeft    = this.get('timeLeft'),
          newTimeLeft = timeLeft-this.get('timeInterval');

      this.set('timeLeft', newTimeLeft);
      if(newTimeLeft <= 0) {
        this.alarm();
        return;
      }

      this.set('totalTime', this.formatTimeFromMilliseconds(newTimeLeft));

      Ember.run.later(this, function() {
        this.handleTimer();
      },  this.get('timeInterval'));
    }
  },
  formatTimeFromMilliseconds: function(milliseconds) {
    var hours   = parseInt(milliseconds / 3600000, 10),
        minutes = parseInt(milliseconds / 60000, 10) - hours*60,
        seconds = parseInt(milliseconds / 1000, 10) - minutes*60 - hours*3600,
        ret     = '';

    if(hours !== 0) {
      ret += hours + ':';
    }

    ret += Utils.addZeroes(minutes) + ':' + Utils.addZeroes(seconds);

    return ret;
  }

});


export default TimerController;
