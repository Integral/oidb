oidbApp.Collections.PoliceStations = Backbone.Collection.extend({
  model: oidbApp.Models.PoliceStation,
  url: "http://murmuring-citadel-9747.herokuapp.com/police-stations"
});
