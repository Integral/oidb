oidbApp.Models.Detention = Backbone.RelationalModel.extend({
  urlRoot: "http://murmuring-citadel-9747.herokuapp.com/detentions",
  idAttribute: '_id',
  defaults: {
    'type': 'detention',
		'action': '',
		'detTime': '',
		'person': '',
		'policeSt': ''
  },

  clear: function() {
    this.destroy();
  },

	relations: [{
		type: Backbone.HasOne,
		key: 'action',
		relatedModel: 'oidbApp.Models.Action',
		includeInJSON: '_id',
		autoFetch: true,
		reverseRelation: {
			collectionType: 'oidbApp.Collections.Detentions',
			key: 'detentions',
		}
	},
	{
		type: Backbone.HasOne,
		key: 'person',
		relatedModel: 'oidbApp.Models.Person',
		includeInJSON: '_id',
		autoFetch: true,
		reverseRelation: {
			collectionType: 'oidbApp.Collections.Persons',
			key: 'detentions',
		}
	},
	{
		type: Backbone.HasOne,
		key: 'policeSt',
		relatedModel: 'oidbApp.Models.PoliceStation',
		includeInJSON: '_id',
		autoFetch: true,
		reverseRelation: {
			collectionType: 'oidbApp.Collections.PoliceStations',
			key: 'detentions',
		}
	}],
	
	initialize: function() {
		//this.fetchRelated('action');
		var action = this.get('action');
		var person =  this.get('person');
		var policeStation = this.get('policeSt');
		this.attributes['actionName'] = action.get('name');
		this.attributes['personName'] = person.get('lastName') + ' ' + person.get('firstName');
		this.attributes['policeStName'] = policeStation.get('name');
		//if (this.actionName !== actionName)	{
		//this.set({actionName:actionName},{silentChange:true});
		//}
	}

  /*validate: function(attrs) {
    if (!attrs.firstName) {
      return "Missing first name for person.";
    }
    else if (!attrs.lastName) {
      return "Missing lat name for person.";
    }
  }*/
});
