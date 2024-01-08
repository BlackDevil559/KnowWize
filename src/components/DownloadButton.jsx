// import React from 'react';

// const DownloadButton = ({ data, filename, mime }) => {
//   const downloadFile = () => {
//     const blob = new Blob([data], { type: mime || 'application/octet-stream' });
//     const link = document.createElement('a');
//     link.href = window.URL.createObjectURL(blob);
//     link.download = filename;
//     link.click();
//   };

//   return (
//     <button onClick={downloadFile}>
//       Download Data
//     </button>
//   );
// };

// export default DownloadButton;
// import React from 'react';
// import './DownloadButton.css'; // Import your CSS file

// const DownloadButton = ({ data, filename, mime }) => {
//   const downloadFile = () => {
//     const blob = new Blob([data], { type: mime || 'application/octet-stream' });
//     const link = document.createElement('a');
//     link.href = window.URL.createObjectURL(blob);
//     link.download = filename;
//     link.click();
//   };

//   return (
//     <button className="download-button" onClick={downloadFile}>
//       Download File
//     </button>
//   );
// };

// export default DownloadButton;
import React from 'react';

const DownloadButton = ({ data, filename, mime }) => {
  const downloadFile = () => {
    const blob = new Blob([data], { type: mime || 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const buttonStyles = {
    padding: '10px 10px',
    margin: '10px 10px',
    fontSize: '16px',
    // backgroundColor: ,
    // color: 'white',
    border: 'solid',
    borderRadius: '6px',
    cursor: 'pointer',
  };

  const buttonHoverStyles = {
    backgroundColor: '#45a049',
  };

  return (
    <button
      style={buttonStyles}
      onClick={downloadFile}
      onMouseOver={() => {
        Object.assign(document.getElementById('download-button'), buttonHoverStyles);
      }}
      onMouseOut={() => {
        Object.assign(document.getElementById('download-button'), buttonStyles);
      }}
      id="download-button"
    >
      Download Data
    </button>
  );
};

export default DownloadButton;
