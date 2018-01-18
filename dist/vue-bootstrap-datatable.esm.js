import orderBy from 'lodash/orderBy';
import toPairs from 'lodash/toPairs';
import uniq from 'lodash/uniq';
import map from 'lodash/map';
import Pagination from 'vue-bootstrap-pagination';

function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

var filterItems = function (items, filterObj) {
  var filteredItems = items.slice();
  var filterOpts = toPairs(filterObj);

  filterOpts.forEach(function (ref) {
    var key = ref[0];
    var value = ref[1];

    var pattern = new RegExp(escapeRegExp(value), "i");
    filteredItems = filteredItems.filter(function (item) {
      return item[key].match(pattern)
    });
  });

  return filteredItems;
};

var paginate = function (items, options) {
  var itemsPerPage = options.per_page;
  var lastPage = Math.ceil(items.length / itemsPerPage);
  var currentPage = options.current_page > lastPage ? 1 : options.current_page;
  var offset = itemsPerPage * (currentPage - 1);

  var paginated = items.slice(offset, offset + itemsPerPage);

  options.total = paginated.length;
  // Hide pagination if there's only a single page of results
  options.last_page = (lastPage > 1) ? lastPage : 0;
  // Move to first page if current page doesn't exist in paginated results
  options.current_page = currentPage;

  return paginated;
};

var generateFilterOptions = function (items, columnOpts) { return toPairs(columnOpts)
    .filter(function (ref) {
      var column = ref[0];
      var options = ref[1];

      return options.filter === 'dropdown';
    })
    .reduce(function (values, ref) {
      var column = ref[0];
      var options = ref[1];

      values[column] = uniq(map(items, column)).sort();
      return values;
    }, {}); };

var SortableTh = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('th',{class:_vm.order,on:{"click":_vm.handleClick}},[_vm._t("default")],2)},staticRenderFns: [],_scopeId: 'data-v-2165a65e',
  name: 'SortableHeader',
  props: ['order', 'column'],
  methods: {
    handleClick: function handleClick() {
      this.$emit('sort', this.column);
    }
  }
};

var VueBootstrapDatatable$1 = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('table',{staticClass:"table table-hover"},[_c('thead',[_c('tr',[_vm._l((_vm.columns),function(config,column){return [(config.sortable)?_c('sortable-th',{key:column,attrs:{"column":column,"order":_vm.getSortOrder(column)},on:{"sort":_vm.setSort}},[_vm._v(" "+_vm._s(config.name)+" ")]):_c('th',{key:column},[_vm._v(_vm._s(config.name))])]}),_vm._v(" "),(_vm.actions)?_c('th'):_vm._e()],2),_vm._v(" "),(_vm.hasFilters)?_c('tr',[_vm._l((_vm.columns),function(config,column){return [_c('th',{key:column},[(config.filter === 'dropdown')?_c('select',{directives:[{name:"model",rawName:"v-model",value:(_vm.filters[column]),expression:"filters[column]"}],staticClass:"form-control",on:{"change":function($event){var $$selectedVal = Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return val}); _vm.$set(_vm.filters, column, $event.target.multiple ? $$selectedVal : $$selectedVal[0]);}}},[_c('option',{attrs:{"value":""}}),_vm._v(" "),_vm._l((_vm.dropdowns[column]),function(option){return _c('option',{key:option,domProps:{"value":option}},[_vm._v(" "+_vm._s(option)+" ")])})],2):_vm._e(),_vm._v(" "),(config.filter === true)?_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.filters[column]),expression:"filters[column]"}],staticClass:"form-control",domProps:{"value":(_vm.filters[column])},on:{"input":function($event){if($event.target.composing){ return; }_vm.$set(_vm.filters, column, $event.target.value);}}}):_vm._e()])]}),_vm._v(" "),(_vm.actions)?_c('th'):_vm._e()],2):_vm._e()]),_vm._v(" "),_c('tbody',_vm._l((_vm.processedItems),function(row,idx){return _c('tr',{key:row[_vm.itemKey],on:{"click":function($event){_vm.onRowClick(row);}}},[_vm._l((_vm.columns),function(config,column){return _c('td',{key:idx + column},[_vm._v(_vm._s(row[column]))])}),_vm._v(" "),(_vm.actions)?_c('td',_vm._l((_vm.actions),function(action,index){return _c('button',{key:index,staticClass:"btn btn-delete-project btn-danger btn-xs",attrs:{"type":"button"},on:{"click":function($event){action.callback(row);}}},[_c('span',{class:'glyphicon glyphicon-'+action.icon,attrs:{"aria-hidden":"true"}})])})):_vm._e()],2)}))]),_vm._v(" "),_c('pagination',{attrs:{"pagination":_vm.pagination,"callback":function () {},"options":_vm.paginationOptions}})],1)},staticRenderFns: [],_scopeId: 'data-v-7a8d38da',
  components: { SortableTh: SortableTh, Pagination: Pagination },

  props: {
    items: {
      type: Array,
      default: function default$1$$1() {
        return {}
      }
    },
    columns: {
      type: Object,
      default: function default$2$$1() {
        return {}
      }
    },
    actions: {
      type: Array,
      default: function default$3$$1() {
        return []
      }
    },
    paginate: {
      type: Boolean,
      default: false
    },
    rowCallback: {
      type: Function,
      default: null
    }
  },

  created: function created() {
    var this$1 = this;

    this.filters = Object.keys(this.columns).reduce(function (filters, key) {
      if (this$1.columns[key].filter) {
        filters[key] = '';
      }
      return filters
    }, {});
  },

  computed: {
    dropdowns: function dropdowns() {
      return generateFilterOptions(this.items, this.columns)
    },

    processedItems: function processedItems() {
      var this$1 = this;

      // filter items
      var filtered = filterItems(this.items, this.filters);

      // sort items
      var iteratee = function (item) { return (
        (this$1.sortKey === 'name') 
          ? item[this$1.sortKey].toLowerCase() 
          : item[this$1.sortKey]
      ); };

      var ordered = orderBy(filtered, [iteratee], this.sortOrder);

      return (this.paginate) ? paginate(ordered, this.pagination) : ordered
    },

    hasFilters: function hasFilters() {
      return Object.values(this.columns).some(function (column) { return column.filter; })
    }
  },

  data: function data() {
    return {
      // dropdowns: {},
      sortKey: 'id',
      sortOrder: 'asc',
      filters: {},
      pagination: {
        total: 0,
        per_page: 10,    // required 
        current_page: 1, // required 
        last_page: 0,    // required 
        from: 1,
        to: 10           // required 
      },
      paginationOptions: {
        offset: 4,
        previousText: 'Prev',
        nextText: 'Next',
        alwaysShowPrevNext: true
      },
    }
  },

  methods: {
    onRowClick: function onRowClick(item) {
      if (this.rowCallback && typeof this.rowCallback === 'function') {
        this.rowCallback(item);
      }
    },

    setSort: function setSort(key) {
      this.sortKey = key;
      this.sortOrder = (this.sortOrder === 'asc') ? 'desc' : 'asc';
    },

    getSortOrder: function getSortOrder(key) {
      if (key === this.sortKey) { return this.sortOrder }
    },
  }
};

export default VueBootstrapDatatable$1;
