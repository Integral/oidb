oidbApp.Views.ActionsGrid = Backbone.View.extend({
 manage:true,
 initialize: function() {
    this.columns = [{
      name: 'name',
      label: 'Название',
      cell: 'string'
      },
      {
      name: 'start',
      label: 'Начало',
      editable: false,
      cell: Backgrid.Extension.MomentCell.extend({
				modelInUTC: true,
      	modelFormat: "X",
      	displayFormat: "DD.MM.YY HH:mm:ss",
				displayInUTC: false
    	})
      },
      {
      name: 'end',
      label: 'Конец',
      editable: false,
      cell: Backgrid.Extension.MomentCell.extend({
				modelInUTC: true,
      	modelFormat: "X",
      	displayFormat: "DD.MM.YY HH:mm:ss",
				displayInUTC: false
    	})
      },
      {
      name: 'detSum',
      label: 'Задержано',
			editable: false,
      cell: 'integer'
      }];
    this.grid = new Backgrid.Grid({
      columns: this.columns,
      collection: this.options.collection,
			footer: Backgrid.Extension.Paginator.extend({
		    hasFastForward: true,
				fastForwardHandleLabels: {
      		prev: "<",
      		next: ">"
    		}
  		})
    });
    $('.data-view-grid').prepend(this.grid.render().$el);
  },
  close: function(){
      this.grid.remove();
      this.remove();
      this.unbind();
  }
});

oidbApp.Views.Actions = Backbone.Layout.extend({
  template: 'actions-layout',
	attributes:{class:'page'},
  initialize: function() {
    this.notify('show','Загрузка данных...','info');
    var self = this,
				p = this.collection.fetch().complete(function () {
          self.insertView('.data-view-grid',new oidbApp.Views.ActionsGrid({collection:self.collection}));
	  			self.notify('hide');
        });
  },
  close: function(){
      this.remove();
      this.unbind();
  }
});
