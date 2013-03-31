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
      name: 'edit',
      label: '',
			editable: false,
      cell: EditCell
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

oidbApp.Views.PersonsSidebar = Backbone.View.extend({
	manage:true,
	attributes:{class:'well well-small',style:'display:none;'},
  template: 'persons-sidebar',
  initialize: function() {
    this.$el.prependTo('.data-view-sidebar');
    this.render();
		$(this.el).fadeIn('slow');
  },
	serialize: function() {
    return { facet: this.collection };
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
				facet = {},
				personTypes = new oidbApp.Collections.PersonTypesFacet(),
				regions = new oidbApp.Collections.RegionsFacet();
				p = this.collection.fetch().complete(function () {
          self.insertView('.data-view-grid',new oidbApp.Views.PersonsGrid({collection:self.collection}));
	  			self.notify('hide');
        });
		var sidebar = personTypes.fetch().complete(function () {
				regions.fetch().complete(function () {
					facet = {types:personTypes,regions:regions}
					self.insertView('.data-view-sidebar',new oidbApp.Views.PersonsSidebar({collection:facet}));
				});
		});
		
		setTimeout(function() {
			self.vs();
		},1000);
  },
  cardsRender: function() {
      this.options.collection.each(function(person) {
        this.insertView('.data-view-cards', new oidbApp.Views.PersonsCards({
          model: person
        }));
      }, this);
  },
	vs: function() {
		var visualSearch = VS.init(this.searchOptions());
		this.vs = visualSearch;
	},
	searchOptions: function(vs) {
		var self = this;
  	return {	
			container : $('.visual_search'),
		 	query     : '',
			callbacks: {
				search: function(a,b) {
					var c = {"фамилия":"lastName","имя":"firstName","регион":"region","тип":"personType"};
					var s = self.vs.searchQuery.facets();
					var k = '';
					var v = '';
					var q = {};
					_.map(s, function(obj){
							var keys = [];
							for (var key in obj) {
								keys.push(key);
								v = keys.toString();
								k = c[v]; 
							}
							obj[k] = obj[v];
							delete obj[v];
							for (var attrname in obj) {
								q[attrname] = obj[attrname];
							}
					})
     			self.collection.queryParams.query = q;
					self.collection.fetch();
    			return false
       	},
				valueMatches: function(c, b, a) {
        	switch (c) {
          	case "фамилия":
            	a(self.collection.pluck("lastName"));							
              break;
            case "имя":
            	a(self.collection.pluck("firstName"));
              break;
						case "регион":
            	a(_.pluck(oidbApp.Helpers.regions,"text"));
              break;
            case "тип":
							a(["задержант", "политзек", "участник", "экоузник"]);
							break;
            default:
							break;
          }
        },
				facetMatches: function(a) {
        	var c = [{label: "фамилия",category: "", id: "lastName"}, {label: "имя",category: "", id: "firstName"}, {label: "регион",category: "", id: "region"}, {label: "тип",category: "", id: "personType"}];
          	a(c)
         }}
	}},
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
		'click .data-view-sidebar li a': '_onFacetFilter',
  },
  _onFacetFilter: function(e) {
    e.preventDefault();
		var disable = $(e.currentTarget.parentElement).hasClass('active');
		if(!disable) {		
			$('.data-view-sidebar li').removeClass('active');
			$('.data-view-sidebar li span').removeClass('badge-inverse');
			$(e.currentTarget.parentElement).addClass('active');
			$(e.currentTarget.children[0]).addClass('badge-inverse');
			var region = $(e.currentTarget).attr('data-region');
			var type = $(e.currentTarget).attr('data-type');
			var query = ((region)? {region: region} : {personType: type} );
			this.collection.queryParams.query = query;
			this.collection.fetch();
		} else {
			$('.data-view-sidebar li').removeClass('active');
			$('.data-view-sidebar li span').removeClass('badge-inverse');
			delete this.collection.queryParams.query;
			this.collection.fetch();
		}
  },
  _onSwitchView: function(e) {
    e.preventDefault();
    var viewName = $(e.target).attr('data-bypass');
    this.notify('show','Загрузка данных...','info');
    this.switchView(viewName);
  },
	_onAddModal: function(e) {
		var person = new oidbApp.Models.Person();
		this.insertView('div', new oidbApp.Views.PersonsModal({model:person,collection:this.collection}));
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
	beforeRender: function() {
		var form = new Backbone.Form({
    	model: this.model
		}).render();
		this.form = form;
	},
	afterRender: function() {
		var self = this;
		setTimeout(function() {
			$('div.modal-body').append(self.form.el);			
			$('#addPerson').modal();
		}, 0);
	},
	_onAdd: function(e) {
		var self = this;
		var errors = this.form.commit();		
		if(!errors) {
			this.model.set({created: {author: 'Daniel Beilinson',time: moment().format('X')}});
			this.model.set({edited: {author: 'Daniel Beilinson',time: moment().format('X')}});
 			this.collection.create(self.model, {
				wait: true,
				success: function(model,resp){ 
					self.notify('show','Запись сохранена','success'); 
				},
				error: function(model,err){ 
					self.notify('show','Произошла ошибка','danger');
				}
			});
			$('#addPerson').modal('hide');
			this.destroy();
		}	
	},
	_onEdit: function(e) {
		var self = this;
		var errors = this.form.commit();		
   	if(!errors) {		
			this.model.set({edited: {author: 'Daniel Beilinson',time: moment().format('X')}});	
 			this.model.save(self.model, {
				wait: true,
				success: function(model,resp){ 
					self.notify('show-hide','Запись сохранена','success'); 
				},
				error: function(model,err){ 
					self.notify('show-hide','Произошла ошибка','danger');
				}
			});
			$('#addPerson').modal('hide');
			this.destroy();
		}
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
		if (this.model.id) {
    	return { person: { new: false }};
		} else {
			return { person: { new: true }};
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
