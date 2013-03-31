oidbApp.Views.DetentionsGrid = Backbone.View.extend({
 manage:true,
 initialize: function() {
    this.columns = [{
      name: 'personName',
      label: 'Задержан',
			editable: false,
      cell: 'string'
      },			
			{
      name: 'actionName',
      label: 'Акция',
			editable: false,
      cell: 'string'
      },
 			{
      name: 'detTime',
      label: 'Время задержания',
			editable: false,
      cell: Backgrid.Extension.MomentCell.extend({
				modelInUTC: true,
      	modelFormat: "X",
      	displayFormat: "DD.MM.YY HH:mm:ss",
				displayInUTC: false
    	})
      },
      {
      name: 'policeStName',
      label: 'ОВД',
			editable: false,
      cell: 'string'
      },
			{
      name: 'delTime',
      label: 'Время доставления',
			editable: false,
      cell: Backgrid.Extension.MomentCell.extend({
				modelInUTC: true,
      	modelFormat: "X",
      	displayFormat: "DD.MM.YY HH:mm:ss",
				displayInUTC: false
    	})
      }];
    this.grid = new Backgrid.Grid({
      columns: this.columns,
      collection: this.options.collection
    });
    $('.data-view-grid').prepend(this.grid.render().$el);
  },
  close: function(){
      this.grid.remove();
      this.remove();
      this.unbind();
  }
});

oidbApp.Views.Detentions = Backbone.Layout.extend({
  template: 'persons-layout',
	attributes:{class:'page'},
  initialize: function() {
    $('#main').prepend('<div class="alert alert-info alert-loader">Loading...<span class="notification-loader">&nbsp;</span></div>');
    var self = this,
				actions = new oidbApp.Collections.Actions(),
				persons = new oidbApp.Collections.Persons(),
				policeStations = new oidbApp.Collections.PoliceStations();
		$.when(actions.fetch(), persons.fetch(), policeStations.fetch()).done(function(){
				//p = actionsGrid.fetch().complete(function () {
					self.collection.fetch().done(function(){				
      			self.insertView('.data-view-grid',new oidbApp.Views.DetentionsGrid({collection:self.collection}));
	  				$('.alert-info').fadeOut(1000, function() { 
	    				$(this).remove(); 
	  				});
    			});
				});
  },
  alertMessage: function (s) {
    if (s=='show') {
      $('.data-view-container').prepend('<div class="alert alert-info alert-loader">Loading...<span class="notification-loader">&nbsp;</span></div>');
    }
    else if (s=='hide') {
      $('.alert-info').fadeOut(1000, function() { 
	$(this).remove(); 
      });
    }
  },
  close: function(){
      this.remove();
      this.unbind();
  }
});
