oidbApp.Views.Index = Backbone.View.extend({
  manage:true,
  template: "index-layout",
  close: function(){
      this.remove();
      this.unbind();
  }
});

oidbApp.Views.PersonsGrid = Backbone.View.extend({
 manage:true,
 initialize: function() {
    this.columns = [{
      name: 'lastName',
      label: 'Фамилия',
			editable: false,
      cell: 'string'
      },
      {
      name: 'firstName',
      label: 'Имя',
			editable: false,
      cell: 'string'
      },
      {
      name: 'middleName',
      label: 'Отчество',
			editable: false,
      cell: 'string'
      },
      {
      name: 'phone',
      label: 'Телефон',
			editable: false,
      cell: 'string'
      },
      {
      name: 'email',
      label: 'E-mail',
			editable: false,
      cell: 'string'
      },
      {
      name: 'twitter',
      label: 'Twitter',
			editable: false,
      cell: 'string'
      },
      {
      name: 'facebook',
      label: 'Facebook',
			editable: false,
      cell: 'string'
      },
			{
      name: 'edit',
      label: '',
			editable: false,
      cell: EditCell
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

oidbApp.Views.PersonsCards = Backbone.View.extend({
  tagName:'li',
  attributes:{class:'clip clip-grid'},
  manage:true,
  template: 'persons-cards',
  initialize: function() {
    //console.log(this);
    this.$el.prependTo('.data-view-cards');
    this.render();
  },
  events: {
    'click h3': '_showDetails'
  },
  serialize: function() {
    return { person: this.model.attributes };
  },
  _showDetails: function() {
    Backbone.history.navigate('persons/' + this.model.id, true);
  },
  close: function(){
      this.remove();
      this.unbind();
  }
});

oidbApp.Views.Persons = Backbone.Layout.extend({
  template: 'persons-layout',
	attributes:{class:'page'},
  initialize: function() {
    this.notify('show','Загрузка данных...','info');
    var self = this,
				p = this.collection.fetch().complete(function () {
          self.insertView('.data-view-grid',new oidbApp.Views.PersonsGrid({collection:self.collection}));
	  			self.notify('hide');
        });
		var user = new oidbApp.Models.Person();
		var form = new Backbone.Form({
    	model: user
		}).render();

		$('body').append(form.el);
  },
  cardsRender: function() {
      this.options.collection.each(function(person) {
        this.insertView('.data-view-cards', new oidbApp.Views.PersonsCards({
          model: person
        }));
      }, this);
  },
  switchView: function(id){
    if (id=='cards') {
      this.getView('.data-view-grid').close();
      this.cardsRender();
      this.notify('hide');
    }	else if (id=='grid') {
      this.getView(function(nestedView) {
				if (nestedView.$el.is(".clip")) {
	  			nestedView.close();
				}
      });
     	this.setView('.data-view-grid', new oidbApp.Views.PersonsGrid({collection:this.collection}));
      this.notify('hide');
    }
  },
  events: {
    'click .navigation a': '_onSwitchView',
		'click .addperson': '_onAddModal',
  },  
  _onSwitchView: function(e) {
    e.preventDefault();
    var viewName = $(e.target).attr('data-bypass');
    this.notify('show','Загрузка данных...','info');
    this.switchView(viewName);
  },
	_onAddModal: function(e) {
		this.insertView('div', new oidbApp.Views.PersonsModal({model:{},collection:this.collection}));
	},
  close: function(){
      this.remove();
      this.unbind();
  }
});

oidbApp.Views.PersonsModal = Backbone.View.extend({
	manage: true,
	attributes: {id:'modal'},
	template: 'persons-modal',
  initialize: function() {
    this.render().view.$el.appendTo('#main');
  },
	events: {
		'click .modal-footer .create': '_onAdd',
		'click .modal-footer .edit': '_onEdit',
		'click .remove': '_onDelete',
		'click .destroy': 'destroy'
  },  
	afterRender: function() {
		setTimeout(function() {
			$('#addPerson input.multiple').select2({tags:[],tokenSeparators: [","]});
			$("#addPerson #region").select2({data: oidbApp.Helpers.regions, multiple: true});
			$('#addPerson div.bfh-phone .select2-input').bfhphone({format: "+7 (ddd) ddd-dd-dd"});
			$("#addPerson .type .btn").click(function(e) { e.preventDefault(); });
			$('#addPerson').modal();
		}, this, 100);
	},
	_onAdd: function(e) {
		var self = this;
   	var formValues = $('#addPersonForm input[id]');
 	 	var person = {};
 		$.map(formValues, function(n, i) {
			if ($(n).val()) { 
				person[n.id] = $(n).val();
				if($(n).hasClass('multiple')) {
					person[n.id] = person[n.id].split(',');
				}
			}
 	 	});
		person['personType'] = [];
		$('#addPerson #personType .btn.active').each(function() {
    	person['personType'].push(this.value);
		});
		person['created'] = {author: 'Daniel Beilinson',time: moment().format('X')};
		person['edited'] = {author: 'Daniel Beilinson',time: moment().format('X')};
 		this.collection.create(person, {
			wait: true,
			success: function(model,resp){ 
				self.notify('show','Запись сохранена','success'); 
			},
			error: function(model,err){ 
				self.notify('show','Произошла ошибка','danger');
			}
		});
		this.destroy();	
	},
	_onEdit: function(e) {
		var self = this;
   	var formValues = $('#addPersonForm input[id]');
 	 	var person = {};
 		$.map(formValues, function(n, i) {
			if ($(n).val()) { 
				person[n.id] = $(n).val();
				if($(n).hasClass('multiple')) {
					person[n.id] = person[n.id].split(',');
				}
			}
 	 	});
		person['personType'] = [];
		$('#addPerson #personType .btn.active').each(function() {
    	person['personType'].push(this.value);
		});
		person['edited'] = {author: 'Daniel Beilinson',time: moment().format('X')};
		console.log(person);
 		this.model.save(person, {
			wait: true,
			success: function(model,resp){ 
				self.notify('show-hide','Запись сохранена','success'); 
			},
			error: function(model,err){ 
				self.notify('show-hide','Произошла ошибка','danger');
			}
		});
		this.destroy();
	},
	_onDelete: function(){
		var self = this;
		bootbox.confirm("Вы уверены?", "Отмена", "Да", function(result) {
  		if (result) {
				self.model.destroy({
					wait: true,
					success: function(model,resp){ 
						self.notify('show-hide','Запись удалена','success');
					},
					error: function(model,err){ 
						self.notify('show-hide','Произошла ошибка','danger'); 
					}
				});
				self.destroy();
			} else {
				$('#addPerson').modal();
			}
		});
	},
	serialize: function() {
		if (this.model) {
    	return { person: this.model.attributes };
		}
  },
	destroy: function(){
		var self = this;
		setTimeout(function() {
			self.close();
		}, 500);
	},
  close: function(){
    this.remove();
    this.unbind();
  }
});

oidbApp.Views.Person = Backbone.Layout.extend({
  template: 'person-layout',
  serialize: function() {
    return { person: this.model.attributes };
  },
  close: function(){
    this.remove();
    this.unbind();
  }
});
