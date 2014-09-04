import Ember from 'ember';

var SearchInputView = Ember.TextField.extend({
  didInsertElement: function() {
    this.$().focus();
  }
});

export default SearchInputView;