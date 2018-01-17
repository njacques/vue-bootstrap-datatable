import toPairs from 'lodash/toPairs';
import uniq from 'lodash/uniq';
import map from 'lodash/map';

function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export const filterItems = (items, filterObj) => {
  let filteredItems = items.slice();
  const filterOpts = toPairs(filterObj);

  filterOpts.forEach(([ key, value ]) => {
    let pattern = new RegExp(escapeRegExp(value), "i");
    filteredItems = filteredItems.filter(item => {
      return item[key].match(pattern)
    })
  });

  return filteredItems;
};

export const paginate = (items, options) => {
  const itemsPerPage = options.per_page;
  const lastPage = Math.ceil(items.length / itemsPerPage);
  const currentPage = options.current_page > lastPage ? 1 : options.current_page;
  const offset = itemsPerPage * (currentPage - 1);

  const paginated = items.slice(offset, offset + itemsPerPage);

  options.total = paginated.length;
  // Hide pagination if there's only a single page of results
  options.last_page = (lastPage > 1) ? lastPage : 0;
  // Move to first page if current page doesn't exist in paginated results
  options.current_page = currentPage;

  return paginated;
}

export const generateFilterOptions = (items, columnOpts) =>
  toPairs(columnOpts)
    .filter(([column, options]) => options.filter === 'dropdown')
    .reduce((values, [column, options]) => {
      values[column] = uniq(map(items, column)).sort();
      return values;
    }, {});