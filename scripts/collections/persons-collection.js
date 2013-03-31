oidbApp.Collections.Persons = Backbone.PageableCollection.extend({
  model: oidbApp.Models.Person,
  url: "http://murmuring-citadel-9747.herokuapp.com/api/persons",
	state: {
    pageSize: 30,
    sortKey: "lastName",
    order: -1,
  },
	queryParams: {
		currentPage: "page",
		pageSize:	"per_page",
		totalPages:	"total_pages",
		totalRecords: "total_entries",
		sortKey: "sort_by",
	}
});
