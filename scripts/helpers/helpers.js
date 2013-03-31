Backbone.Layout.configure({
  prefix: "/scripts/templates/",

  // This method will check for prebuilt templates first and fall back to
  // loading in via AJAX.
  fetch: function(path) {
    path = path + ".html";
    // Check for a global JST object.  When you build your templates for
    // production, ensure they are all attached here.
    var JST = window.JST || {};

    // If the path exists in the object, use it instead of fetching remotely.
    if (JST[path]) {
      return JST[path];
    }

    // If it does not exist in the JST object, mark this function as
    // asynchronous.
    var done = this.async();
    
    // Fetch via jQuery's GET.  The third argument specifies the dataType.
    $.get(path, function(contents) {
      // Assuming you're using underscore templates, the compile step here is
      // `_.template`.
      done(_.template(contents));
    }, "text");
  }
});

Backbone.View.prototype.notify = function(state, message, type) {
	if (state=='show') {
  	$('#main').prepend('<div class="alert alert-' + type + ' alert-loader"><button type="button" class="close" data-dismiss="alert">×</button>' + message + '<span class="notification-loader">&nbsp;</span></div>');
  }
	else if (state=='show-hide') {
		$('#main').prepend('<div class="alert alert-' + type + ' alert-loader"><button type="button" class="close" data-dismiss="alert">×</button>' + message + '<span class="notification-loader">&nbsp;</span></div>');
		setTimeout(function() {
			$('div.alert').fadeOut(1000, function() { 
				$(this).remove(); 
    	});
		},3000);
	}
  else if (state=='hide') {
    $('div.alert').fadeOut(1000, function() { 
			$(this).remove(); 
    });
  }
}; 

var DeleteCell = Backgrid.DeleteCell = Backgrid.Cell.extend({
  className: "delete-cell",	
	events: {
		'click': '_onDelete'
	},
	_onDelete: function(){
		var self = this;
		bootbox.confirm("Вы уверены?", "Отмена", "Да", function(result) {
  		if (result) {
				self.model.destroy({
					wait: true,
					success: function(model,resp){ 
						self.notify('show','Запись удалена','success'); 
					},
					error: function(model,err){ 
						self.notify('show','Произошла ошибка','danger'); 
					}
				});
			}
		});
	},
  render: function () {
    this.$el.empty();
    this.$el.append($("<i class='icon-remove'></i>"));
    return this;
  }
});

var EditCell = Backgrid.EditCell = Backgrid.Cell.extend({
  className: "edit-cell",	
	events: {
		'click': '_onEdit'
	},
	_onEdit: function(){
		oidbApp.rooter.currentView.insertView('div', new oidbApp.Views.PersonsModal({model: this.model}));
	},
  render: function () {
    this.$el.empty();
    this.$el.append($("<a href='#addPerson'><i class='icon-edit'></i>"));
    return this;
  }
});

oidbApp.Helpers.regions = [
	{id:'Москва',text:'Москва'},
	{id:'Санкт-Петербург',text:'Санкт-Петербург'},
	{id:'Нижний Новгород',text:'Нижний Новгород'},
	{id:'Волгоград',text:'Волгоград'},
	{id:'Казань',text:'Казань'}
];
