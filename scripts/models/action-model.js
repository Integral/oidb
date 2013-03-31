oidbApp.Models.Action = Backbone.RelationalModel.extend({
  urlRoot: "http://murmuring-citadel-9747.herokuapp.com/api/actions",
  idAttribute: '_id',
  defaults: {
    'type': 'action',
		'name': '',
		'start': '',
		'end': '',
		'detSum': 0
  },

  clear: function() {
    this.destroy();
  },
});
