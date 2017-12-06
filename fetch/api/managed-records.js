import fetch from '../util/fetch-fill';
import URI from 'urijs';

// /records endpoint
window.path = 'http://localhost:3000/records';

// Return a promise that resolves with an object of requested records
// Each page/object returned has 10 records
function retrieve(options = {}) {
  // If page in options is ommited or less than 1, set it to 1
  var page = options.page > 1 ? options.page : 1;

  // Set the starting index we want to splice at based on the requested page
  var offsetIndex = (page - 1) * 10;

  return fetchRecords(options.colors)
    .then(records => {
      // Extract the set of records that we need
      var pageRecords = records.splice(offsetIndex, 10);

      // Calculate the last page of results
      var lastPage = Math.ceil(records.length / 10);

      return {
        ids: getIDs(pageRecords),
        open: getOpen(pageRecords),
        closedPrimaryCount: getClosedPrimaryCount(pageRecords),
        previousPage: getPreviousPage(page),
        nextPage: getNextPage(page, lastPage),
      };
    })
    .catch(error => {
      console.log(`Error: ${error}`);
    });
}

// Recursively fetch and return an array of all the records
function fetchRecords(colors, offset = 0, records = []) {
  // Construct the URL to fetch
  var uri = URI(window.path).search({
    limit: 100, // Only fetch 100 records at a time
    offset,
    'color[]': colors,
  });

  // Fetch the set of records
  return fetch(uri)
    .then(res => res.json())
    .then(json => {
      // Append this set of records to the array
      records = records.concat(json);

      // Determine if another set of records needs to be fetched
      if (json.length === 100) {
        // Increase the offset by 100 and call the function again
        return fetchRecords(colors, offset + 100, records);
      } else {
        // If not then return the array of all the records
        return records;
      }
    })
    .catch(error => {
      console.log(`Error: ${error}`);
    });
}

// Return a booleon determining if a primary color
function isPrimary(color) {
  return ['red', 'blue', 'yellow'].includes(color);
}

// Return an array of item ids
function getIDs(json = []) {
  return json.reduce((array, obj) => {
    array.push(obj.id);
    return array;
  }, []);
}

// Return an array containing all of the items that have a disposition
// value of "open" and add an isPrimary property to each item
function getOpen(json = []) {
  return json
    .filter(obj => {
      return obj.disposition === 'open';
    })
    .map(obj => {
      obj.isPrimary = isPrimary(obj.color);
      return obj;
    });
}

// Return the total number of items returned from the request that have
// a disposition value of "closed" and contain a primary color
function getClosedPrimaryCount(json = []) {
  return json.filter(obj => {
    return obj.disposition === 'closed' && isPrimary(obj.color);
  }).length;
}

// Return the previous page number unless this is the first page
function getPreviousPage(currentPage) {
  if (currentPage > 1) {
    return currentPage - 1;
  } else {
    return null;
  }
}

// Return the next page number unless this is the last page
function getNextPage(currentPage, lastPage) {
  if (currentPage < lastPage) {
    return currentPage + 1;
  } else {
    return null;
  }
}

export default retrieve;
