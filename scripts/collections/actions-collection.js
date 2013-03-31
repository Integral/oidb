oidbApp.Collections.Actions = Backbone.PageableCollection.extend({
  model: oidbApp.Models.Action,
  url: "http://murmuring-citadel-9747.herokuapp.com/api/actions",
	state: {
    pageSize: 30,
    sortKey: "start",
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
