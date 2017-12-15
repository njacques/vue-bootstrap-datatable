<template>
  <div>
    <table class="table table-hover">

      <thead>

        <tr>
          <template v-for="(config, column) in columns">
            <sortable-th
              v-if="config.sortable"
              @sort="setSort"
              :column="column"
              :order="getSortOrder(column)"
              :key="column"
            >
              {{ config.name }}
            </sortable-th>

            <th v-else :key="column">{{ config.name }}</th>
          </template>
          <th v-if="actions"></th>
        </tr>

        <tr v-if="hasFilters">
          <template v-for="(config, column) in columns">
            <th :key="column">
              <select 
                v-if="config.filter === 'dropdown'" 
                v-model="filters[column]" 
                class="form-control"
              >
                <option value="" />
                <option v-for="option in dropdowns[column]" :value="option" :key="option">
                  {{ option }}
                </option>
              </select>

              <input v-if="config.filter === true" v-model="filters[column]" class="form-control" />
            </th>
          </template>
          <th v-if="actions"></th>
        </tr>

      </thead>

      <tbody>
        <tr v-for="(row, idx) in processedItems" :key="row[itemKey]" @click="onRowClick(row)">
          <td v-for="(config, column) in columns" :key="idx + column">{{ row[column] }}</td>
          <td v-if="actions">
            <button
              v-for="(action, index) in actions"
              :key="index"
              @click="action.callback(row)"
              type="button" 
              class="btn btn-delete-project btn-danger btn-xs"
            >
              <span aria-hidden="true" :class="'glyphicon glyphicon-'+action.icon"></span>
            </button>
          </td>
        </tr>
      </tbody>

    </table>

    <pagination 
      :pagination="pagination" 
      :callback="() => {}" 
      :options="paginationOptions">
    </pagination>
  </div>
</template>

<script>
import orderBy from 'lodash/orderBy'
import toPairs from 'lodash/toPairs'
import uniq from 'lodash/uniq'
import map from 'lodash/map'
import { filterItems, paginate, generateFilterOptions } from './helpers'
import Pagination from 'vue-bootstrap-pagination';
import SortableTh from './SortableHeader.vue'



function ucFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export default {
  components: { SortableTh, Pagination },

  props: {
    items: {
      type: Array,
      default() {
        return {}
      }
    },
    columns: {
      type: Object,
      default() {
        return {}
      }
    },
    actions: {
      type: Array,
      default() {
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

  created() {
    this.filters = Object.keys(this.columns).reduce((filters, key) => {
      if (this.columns[key].filter) {
        filters[key] = ''
      }
      return filters
    }, {})
  },

  computed: {
    dropdowns() {
      return generateFilterOptions(this.items, this.columns)
    },

    processedItems() {
      // filter items
      const filtered = filterItems(this.items, this.filters)

      // sort items
      const iteratee = item => (
        (this.sortKey === 'name') 
          ? item[this.sortKey].toLowerCase() 
          : item[this.sortKey]
      )

      const ordered = orderBy(filtered, [iteratee], this.sortOrder)

      return (this.paginate) ? paginate(ordered, this.pagination) : ordered
    },

    hasFilters() {
      return Object.values(this.columns).some(column => column.filter)
    }
  },

  data() {
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
    onRowClick(item) {
      if (this.rowCallback && typeof this.rowCallback === 'function') {
        this.rowCallback(item);
      }
    },

    setSort(key) {
      this.sortKey = key
      this.sortOrder = (this.sortOrder === 'asc') ? 'desc' : 'asc'
    },

    getSortOrder(key) {
      if (key === this.sortKey) return this.sortOrder
    },
  }
}
</script>

<style scoped></style>
