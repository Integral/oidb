oidbApp.Models.PoliceStation = Backbone.RelationalModel.extend({
  urlRoot: "http://murmuring-citadel-9747.herokuapp.com/police-stations",
  idAttribute: '_id',
  defaults: {
    'type': 'police-station',
		'region': '',
		'name': '',
		'fullName': '',
		'phone': [],
		'address': '',
		'location': {
			'long':'',
			'lat':'',
		}
  },

  clear: function() {
    this.destroy();
  },

  /*validate: function(attrs) {
    if (!attrs.firstName) {
      return "Missing first name for person.";
    }
    else if (!attrs.lastName) {
      return "Missing lat name for person.";
    }
  }*/
});
