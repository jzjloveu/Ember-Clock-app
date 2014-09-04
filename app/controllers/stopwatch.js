import Ember from 'ember';
import Utils from './utils';

var StopwatchController = Ember.ArrayController.extend({
  
  isRunning: false,
  isStopped: false,
  
  startTime:       null,
  lapTime:         null,
  ellapsedTime:    0,
  ellapsedLapTime: 0,
  timeInterval:    10,
  
  totalTimeFormatted:      '00:00.00',
  currentLapTimeFormatted: '00:00.00',
  
  content: Ember.A(),
  
  leftButtonClass: function() {
    if (this.get('isRunning')) {
      return 'button-stop';
    }
    return 'button-start';
  }.property('isRunning'),
  
  leftButtonLabel: function() {
    if (this.get('isRunning')) {
      return 'Stop';
    }
    return 'Start';
  }.property('isRunning'),

  rightButtonClass: function() {
    if (this.get('isRunning')) {
      return 'button-lap';
    }
    return 'button-reset';
  }.property('isRunning'),

  rightButtonLabel: function() {
    if (this.get('isRunning') || (!this.get('isStopped') && !this.get('isRunning'))) {
      return 'Lap';
    }
    return 'Reset';
  }.property('isRunning', 'isStopped'),

  rightButtonDisabled: function() {
    return !(this.get('isRunning') || this.get('isStopped'));
  }.property('isRunning', 'isStopped'),

  actions: {
    leftButton: function() {
      if(this.get('isRunning')) {
        this.stop();
      } else {
        this.start();
      }
    },
    
    rightButton: function() {
      if(this.get('isRunning')) {
        this.lap();
      } else {
        this.reset();
      }
    }
  },
  
  start: function() {
    this.set('startTime', new Date().getTime() - this.get('ellapsedTime'))
        .set('lapTime',   new Date().getTime() - this.get('ellapsedLapTime'))
        .set('isRunning', true)
        .set('isStopped', false);

    this.handleTimer();
  },
  
  stop: function() {
    this.set('isRunning', false)
        .set('isStopped', true);
  },
  
  
  lap: function() {
    var lap = Ember.Object.create({
                  lapLabel: "Lap %@".fmt(this.get('content.length')+1),
                  lapTime:  this.formatTimeFromMilliseconds(new Date().getTime()-this.get('lapTime'))
              });
                  
    this.insertAt(0, lap);
    this.set('lapTime', new Date().getTime());
  },
  
  reset: function() {
    this.set('ellapsedTime',            0)
        .set('ellapsedLapTime',         0)
        .set('isRunning',               false)
        .set('isStopped',               false)
        .set('totalTimeFormatted',      this.formatTimeFromMilliseconds(0))
        .set('currentLapTimeFormatted', this.formatTimeFromMilliseconds(0))
        .set('content',                 Ember.A());
        
  },
  
  handleTimer: function() {
    var now       = new Date().getTime(),
        startTime = this.get('startTime'),
        lapTime   = this.get('lapTime');
        
    this.set('totalTimeFormatted',      this.formatTimeFromMilliseconds(now-startTime))
        .set('currentLapTimeFormatted', this.formatTimeFromMilliseconds(now-lapTime))
        .set('ellapsedTime',            now-startTime)
        .set('ellapsedLapTime',         now-lapTime);
    
    if(this.get('isRunning')) {
      Ember.run.later(this, function() {
        this.handleTimer();
      },  this.get('timeInterval'));
    }
  },
  
  formatTimeFromMilliseconds: function(milliseconds) {
    var minutes = parseInt((milliseconds / 60 / 1000),10),
        seconds = parseInt(milliseconds / 1000, 10) - minutes*60,
        tenths  = parseInt((milliseconds - seconds*1000 - minutes*60000)/10, 10);

    return Utils.addZeroes(minutes)  + ":" + Utils.addZeroes(seconds) + "." + Utils.addZeroes(tenths); 
  }
});


export default StopwatchController;
