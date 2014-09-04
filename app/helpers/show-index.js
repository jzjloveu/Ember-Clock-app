import Ember from "ember";
import Utils from '../controllers/utils';



var showIndexHelper = Ember.Handlebars.makeBoundHelper(function(val) {
    var initial = val.substring(0,1);
	if(initial !== Utils.index){
        Utils.index = initial;
	    return new Ember.Handlebars.SafeString("<li class=\"index\"><p class=\"letter\">" + initial +"</p></li>");
	}
});

export default showIndexHelper;