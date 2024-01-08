// import { parse } from 'json2csv';

// export function convertJSONStringToCSV(jsonString) {
//     try {
//       // Parse the JSON string into a JavaScript object
//       const jsonData = JSON.parse(jsonString);
  
//       // Ensure jsonData is not empty
//       if (!jsonData || jsonData.length === 0) {
//         console.error('JSON data is empty or invalid.');
//         return null;
//       }
  
//       // Specify fields for CSV format
//       const fields = Object.keys(jsonData[0]);
  
//       // Convert JSON to CSV format
//       const csv = parse(jsonData, { fields });
  
//       return csv;
//     } catch (error) {
//       console.error('Error parsing JSON string:', error.message);
//       return null;
//     }
//   }

export function convertJSONStringToCSV(jsonString) {
          const jsonData = JSON.parse(jsonString);
      
          if (!jsonData || jsonData.length === 0) {
            console.error('JSON data is empty or invalid.');
            return null;
          }
      
          const headers = Object.keys(jsonData[0]);
      
          const csvRows = [];
          csvRows.push(headers.join(','));
      
          for (const row of jsonData) {
            const values = headers.map(header => {
              const value = row[header];
              return typeof value === 'undefined' ? '' : value;
            });
            csvRows.push(values.join(','));
          }
      
          return csvRows.join('\n');
      }
      