var Utils = {
  index: '',
  addZeroes: function(value) {
    if(value < 10) {
      return '0'+value;
    }
    return value;
  }
};

export default Utils;