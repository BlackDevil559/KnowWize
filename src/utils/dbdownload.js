import axios from 'axios';

// API to get filters
export async function getFilters(id) {
  const url = `http://127.0.0.1:8000/filters/${id}`;

  try {
    const response = await axios.get(url);

    if (response.status === 200) {
    //   return response.data;
            return JSON.stringify(response.data, null, 2);
    } else {
      return `Error: ${response.status}`;
    }
  } catch (error) {
    console.error('Error:', error.message);
    return 'Error occurred while getting filters';
  }
}

// API to process final data
// export async function processFinalData(id, filtersJson) {
//   const url = `http://127.0.0.1:8000/database/${id}`;

//   try {
//     const response = await axios.get(url, {
//       params: { filters: filtersJson },
//     });

//     if (response.status === 200) {
//       return response.data;
//     } else {
//       return `Error: ${response.status}`;
//     }
//   } catch (error) {
//     console.error('Error:', error.message);
//     return 'Error occurred while processing final data';
//   }
// }
// getFilters('27d1d629-7cf0-419c-a342-d83f700d24d1')
//   .then(result => console.log(result))
//   .catch(error => console.error(error));
// processFinalData('27d1d629-7cf0-419c-a342-d83f700d24d1',{"states__uts":"GUJARAT"})
//   .then(result => console.log(result))
//   .catch(error => console.error(error));

export async function processFinalData(id, filtersJson) {
  const url = `http://127.0.0.1:8000/database/${id}`;
  console.log(filtersJson);
  try {
    const response = await axios.get(url, {
      params: filtersJson,
    });

    if (response.status === 200) {
      return response.data;
    } else {
      return `Error: ${response.status}`;
    }
  } catch (error) {
    console.error('Error:', error.message);
    return 'Error occurred while processing final data';
  }
}

// processFinalData('27d1d629-7cf0-419c-a342-d83f700d24d1', {"states__uts": "GUJARAT"})
//   .then(result => console.log(result))
//   .catch(error => console.error(error));
