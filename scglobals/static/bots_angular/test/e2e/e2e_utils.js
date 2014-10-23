var TestUtils = function() {
  this.base_url = "http://localhost:8000/";

  this.get_display_date = function(d){
      var d = new Date(d);
      var months = [ "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December" ];
      return months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  };
};

module.exports = new TestUtils();