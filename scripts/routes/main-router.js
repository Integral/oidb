oidbApp.Routers.Main = Backbone.Router.extend({
  initialize: function() {
  },
  routes: {
    '' : 'index' ,
    'persons' : 'persons',
    'persons/:id' : 'personDetails',
		'actions' : 'actions',
		'detentions' : 'detentions',
  },
  index: function() {
    oidbApp.rooter.showView('.data-cont', new oidbApp.Views.Index());
  },
  persons: function() {
    var personsGrid = new oidbApp.Collections.Persons();
    oidbApp.rooter.showView('.data-cont', new oidbApp.Views.Persons({collection: personsGrid}));
  },
  personDetails: function(id) {
    var person = oidbApp.Models.Person.findOrCreate({_id:id});
    person.fetch().complete(function () {
      oidbApp.rooter.showView('.data-cont', new oidbApp.Views.Person({model: person}));
    });
  },
  actions: function() {
    var actionsGrid = new oidbApp.Collections.Actions();
    oidbApp.rooter.showView('.data-cont', new oidbApp.Views.Actions({collection: actionsGrid}));
  },
  detentions: function() {
    var detentionsGrid = new oidbApp.Collections.Detentions();
    oidbApp.rooter.showView('.data-cont', new oidbApp.Views.Detentions({collection: detentionsGrid}));
  },
  showView: function(selector, view) {
        if (this.currentView)
            this.currentView.close();
        view.$el.prependTo(selector);
				view.render();
        this.currentView = view;
        return view;
  },
});
