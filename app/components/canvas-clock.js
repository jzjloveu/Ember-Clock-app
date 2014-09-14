import Ember from 'ember';

var CanvasClockComponent = Ember.Component.extend({
  tagName:        'canvas',
  width:           70,
  height:          70,
  pi:              Math.PI,
  isNightTime:     false,
  dayOrNight:      null,
  currentHr:       null,
  currentMin:      null,
  currentSec:      null,
  currentMillsec:  null,
  fontSize:        null,
  clockRadius:     null,
  armSize:         null,
  armXOffset:      null,
  hrArmXOffset:    null,
  hourNumOffset:   null,
  canvasCtx:       null,

  attributeBindings: ['width','height'],
  
  didInsertElement: function() {
    var width = this.get('width');
	this.setPara(width);
	this.set('canvasCtx', this.get('element').getContext('2d'));
    this.analogClock();
  },
  
  analogClock: function() {
    this.cleanCanvas();
    var context  = this.get('canvasCtx'),
	    timetext = this.get('data');
	var timepart = timetext.split(" ")[0],
	    amOrpm   = timetext.split(" ")[1];

 	context.font = this.get('fontSize')+'px Arial';
 	this.setTimeElements(amOrpm,timepart);
	this.drawTimeFace();
	this.drawArms();
	this.timeNumbers();
	
  }.observes('data'),
  
  setPara: function(width){
 	this.set('pi', Math.PI);
	this.set('fontSize', width/8); 
	this.set('armSize', width/28);
	this.set('armXOffset', width/5);
	this.set('hrArmXOffset', width/11);
	this.set('clockRadius', width/2);
	this.set('hourNumOffset', width*(7/18));
  },

  cleanCanvas: function() {
    var context = this.get('canvasCtx');
    context.fillStyle = '#fff';
    context.fillRect(0, 0, this.get('width'), this.get('height'));
  },

  setTimeElements: function(amOrpm, currTime) {
    this.set('dayOrNight', amOrpm);
	this.set('currentHr', currTime.split(":")[0]);
	this.set('currentMin', currTime.split(":")[1]);
	this.set('currentSec', currTime.split(":")[2]);
	this.set('currentMillsec', currTime.split(":")[3]);
	if(this.isNight(amOrpm, currTime.split(":")[0])){
		this.set('isNightTime', true);
	}
  },

  drawTimeFace: function() { 
  	var context = this.get('canvasCtx'),
  		width   = this.get('width'),
  		height  = this.get('height'),
  		raidus  = this.get('clockRadius'),
  		pi      = this.get('pi');

  	context.beginPath(); 
	context.arc(width/2, height/2, raidus, 0, pi*2, true); 
    context.fillStyle = '#efefef';
	if(this.get('isNightTime')){
		context.fillStyle = 'black';
	}
    context.fill();
  },
  
  timeNumbers: function() { 
	var timeNums = [1,2,3,4,5,6,7,8,9,10,11,12], 
	    angle    = 0, 
	    nowidth  = 0,
	    width    = this.get('width'),
	    height   = this.get('height'),
	    font     = this.get('fontSize'),
	    HrNumX   = this.get('hourNumOffset'),
	    pi       = this.get('pi'),
	    context  = this.get('canvasCtx');

	context.fillStyle = 'black';
	if(this.get('isNightTime')){
		context.fillStyle = 'white';
	}
	timeNums.forEach(function (number) { 
		angle = pi/6 * (number-3); 
		nowidth = context.measureText(number).width; 
		context.fillText(number,width/2 + Math.cos(angle)*HrNumX - nowidth/2, 
		    height/2 + Math.sin(angle)*HrNumX + font/3); 
	}); 
	this.drawDot();
  }, 
  
  drawDot: function() { 
	var context = this.get('canvasCtx'),
	    width   = this.get('width'),
	    height  = this.get('height'),
		armSize = this.get('armSize'),
	    pi      = this.get('pi');

	context.beginPath(); 
	context.arc(width/2, height/2, armSize, 0, pi*2, true); 
	context.fillStyle = 'black';
	if(this.get('isNightTime')){
		context.fillStyle = 'white';
	}
	context.fill(); 
  },
  
  timeArm: function (loc, handType) { 
    var context    = this.get('canvasCtx'),
	    width      = this.get('width'),
        height     = this.get('height'),
        armSize    = this.get('armSize'),
        raidus     = this.get('clockRadius'),
        xOffset    = this.get('armXOffset'),
        hourOffset = this.get('hrArmXOffset'),
        millisec   = this.get('currentMillsec'),
        pi         = this.get('pi'),
        angle      = (pi*2)*(loc/60) - pi/2, 
	    handRadius = handType === 'hour'? raidus - xOffset - hourOffset : raidus- xOffset;
    	
	context.beginPath();
	if (handType === 'second'){
	    handRadius = handRadius - armSize;
	    angle = angle + (pi/30)*(millisec/1000);
        context.lineWidth = armSize/2;
		context.strokeStyle = 'red';
	}
	else{
		context.lineWidth = armSize;
		context.strokeStyle = 'black';
		if(this.get('isNightTime')){
			context.strokeStyle = 'white';
		}
	}
	context.moveTo(width/2, height/2); 
	context.lineTo(width/2 + Math.cos(angle)*handRadius, height/2 + Math.sin(angle)*handRadius); 
	context.stroke(); 
  },
  
  drawArms: function() { 
  	this.timeArm(this.get('currentHr')*5 + (this.get('currentMin')/60)*5, 'hour');
    this.timeArm(this.get('currentMin'), 'minute'); 
	this.timeArm(this.get('currentSec'), 'second');
  },

  isNight: function(dayNite, hours) {
  	return (((hours >= 6 && hours!=='12') && dayNite === 'PM')|| 
  		((hours<6 || hours==='12') && dayNite === 'AM'));
  }
});

export default CanvasClockComponent;