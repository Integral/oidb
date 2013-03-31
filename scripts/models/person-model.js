oidbApp.Models.Person = Backbone.RelationalModel.extend({
  urlRoot: "http://murmuring-citadel-9747.herokuapp.com/api/persons",
  idAttribute: '_id',
	schema: {
    'lastName': { title: 'Фамилия', editorAttrs: { placeholder: 'Иванов' }, type: 'Text', dataType: 'text', validators: ['required'] },		
		'firstName': { title: 'Имя', editorAttrs: { placeholder: 'Иван' }, type: 'Text', dataType: 'text', validators: ['required'] },
    'middleName': { title: 'Отчество', editorAttrs: { placeholder: 'Иванович' }, type: 'Text', dataType: 'text' },
    'personType': { title: 'Тип', type: 'ButtonsCheckboxes', options: [{val:'задержант',class:'btn-danger'},{val:'политзэк',class:'btn-warning'},{val:'экоузник',class:'btn-success'},{val:'участник',class:'btn-info'}]},
    'region': { title: 'Регион', type: 'Select2', config: {width: '300', data: oidbApp.Helpers.regions, multiple: true}},
    'phone': { title: 'Телефон', type: 'List', listType: 'Text', dataType: 'tel' },
    'email': { title: 'E-mail', type: 'List', listType: 'Text', dataType: 'email' },
    'twitter': { title: 'Twitter', type: 'List', listType: 'Text' },
    'facebook': {title: 'Facebook',  type: 'List', listType: 'Text' }
	},
  defaults: {
    'type': 'person',
    'firstName': '',
    'lastName': '',
    'middleName': '',
    'personType': [],
    'region': [],
    'phone': [],
    'email': [],
    'twitter': [],
    'facebook': [] 
  },

  clear: function() {
    this.destroy();
  },

  validate: function(attrs) {
    if (!attrs.firstName) {
      return "Missing first name for person.";
    }
    else if (!attrs.lastName) {
      return "Missing lat name for person.";
    }
  }
});
