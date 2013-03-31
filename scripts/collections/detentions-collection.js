oidbApp.Collections.Detentions = Backbone.Collection.extend({
  model: oidbApp.Models.Detention,
  url: "http://murmuring-citadel-9747.herokuapp.com/detentions"
});
