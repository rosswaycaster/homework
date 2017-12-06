import fetch from '../util/fetch-fill';
import URI from 'urijs';

// /records endpoint
window.path = 'http://localhost:3000/records';

function retrieve(options = {}) {
  var page = options.page && options.page > 1 ? options.page : 1;

  return fetchRecords(options.colors)
    .then(results => {
      var records = results[page - 1];

      return {
        ids: getIDs(records),
        open: getOpen(records),
        closedPrimaryCount: getClosed(records),
        previousPage: getPreviousPage(page),
        nextPage: getNextPage(page, results.length),
      };
    })
    .catch(error => {
      console.log(`Error: ${error}`);
    });
}

function fetchRecords(colors, offset = 0, results = []) {
  var uri = URI(window.path).search({
    limit: 10,
    offset,
    'color[]': colors,
  });
  return fetch(uri.toString())
    .then(res => res.json())
    .then(json => {
      if (json.length > 0) {
        results.push(json);
      }
      if (json.length === 10) {
        return fetchRecords(colors, offset + 10, results);
      } else {
        return results;
      }
    })
    .catch(error => {
      console.log(`Error: ${error}`);
    });
}

function getIDs(json = []) {
  return json.reduce((array, obj) => {
    array.push(obj.id);
    return array;
  }, []);
}

function getOpen(json = []) {
  return json.filter(obj => obj.disposition === 'open').map(obj => {
    obj.isPrimary = isPrimary(obj.color);
    return obj;
  });
}

function isPrimary(color) {
  return ['red', 'blue', 'yellow'].includes(color);
}

function getClosed(json = []) {
  return json.filter(obj => obj.disposition === 'closed' && isPrimary(obj.color)).length;
}

function getPreviousPage(currentPage) {
  if (currentPage > 1) {
    return currentPage - 1;
  } else {
    return null;
  }
}

function getNextPage(currentPage, lastPage) {
  if (currentPage < lastPage) {
    return currentPage + 1;
  } else {
    return null;
  }
}

export default retrieve;
