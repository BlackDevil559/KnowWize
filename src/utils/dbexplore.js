import axios from 'axios';
export async function searchData(parameter) {
  const url = `http://127.0.0.1:8000/query/${parameter}`;

  try {
    const response = await axios.get(url);

    if (response.status === 200) {
      const data = JSON.stringify(response.data, null, 2);
        
      return data;
    } else {
      return `Error: ${response.status}`;
    }
  } catch (error) {
    console.error('Error:', error.message);
    return 'Error occurred while making the request';
  }
}

