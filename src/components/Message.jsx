// import PropTypes from 'prop-types';
// import { MdComputer, MdPerson } from 'react-icons/md';
// import moment from 'moment';
// import Image from './Image';
// import Markdown from './Markdown';

// /**
//  * A chat message component that displays a message with a timestamp and an icon.
//  *
//  * @param {Object} props - The properties for the component.
//  */
// const Message = (props) => {
//   const { id, createdAt, text, ai = false, selected } = props.message;

//   return (
//     <div
//       key={id}
//       className={`flex items-end my-2 gap-2 ${
//         ai ? 'flex-row-reverse justify-end' : 'flex-row justify-end'
//       }`}>
//       {selected === 'Image Generation' && ai ? (
//         <Image url={text} />
//       ) : selected === 'DataBase Query' && ai ? (
//         Const tableRows = text.slice(0, 20).map((entry, index) => (
//           <tr key={index}>
//             <td>{entry.resource_id}</td>
//             <td>{entry.title}</td>
//           </tr>
//         ));
        
//         return (
//           <table>
//             <thead>
//               <tr>
//                 <th>Resource ID</th>
//                 <th>Title</th>
//               </tr>
//             </thead>
//             <tbody>
//               {tableRows}
//             </tbody>
//           </table>
//         );
        
//       ):(
//         <div
//           className={` w-screen overflow-hidden chat ${
//             ai ? 'chat-start' : 'chat-end'
//           }`}>
//           <div className='chat-bubble text-neutral-content'>
//             <Markdown markdownText={text} />
//             <div className={`${ai ? 'text-left' : 'text-right'} text-xs`}>
//               {moment(createdAt).calendar()}
//             </div>
//           </div>
//         </div>
//       )}
//       <div className='avatar'>
//         <div className='w-8 border rounded-full border-slate-400'>
//           {ai ? (
//             <MdComputer className='w-6 h-full m-auto' />
//           ) : (
//             <MdPerson className='w-6 h-full m-auto' />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Message;

// Message.propTypes = {
//   message: PropTypes.shape({
//     id: PropTypes.number.isRequired,
//     createdAt: PropTypes.number.isRequired,
//     text: PropTypes.string,
//     ai: PropTypes.bool,
//     selected: PropTypes.string,
//   }).isRequired,
// };
import PropTypes from 'prop-types';
import { MdComputer, MdPerson } from 'react-icons/md';
import moment from 'moment';
import Image from './Image';
import Markdown from './Markdown';
import DownloadButton from './DownloadButton';
import {convertJSONStringToCSV} from '../utils/converter'
/**
 * A chat message component that displays a message with a timestamp and an icon.
 *
 * @param {Object} props - The properties for the component.
 */
const Message = (props) => {
  const { id, createdAt, text, ai = false, selected } = props.message;

  return (
    <div
      key={id}
      className={`flex items-end my-2 gap-2 ${
        ai ? 'flex-row-reverse justify-end' : 'flex-row justify-end'
      }`}
    >
      {selected === 'Image Generation' && ai ? (
        <Image url={text} />
      ) : selected === 'DataBase Query' && ai ? (
        <div className="chat-bubble text-neutral-content">
          {text && (
            <div><table className="border-collapse">
              <thead>
                <tr>
                  <th className="border p-2">Resource ID</th>
                  <th className="border p-2">Title</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(JSON.parse(text).resource_id).slice(0, 20).map(([key, value]) => (
                  <tr key={key}>
                    <td className="border p-2">{value}</td>
                    <td className="border p-2">{JSON.parse(text).title[key]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* <DownloadButton data={convertJSONStringToCSV(text)} filename="query_data.csv" /></div> */}
            
            // </div>
          )}
        </div>
      ) : selected=== 'DataBase Filters' && ai ?(<div  className="chat-bubble text-neutral-content"><table className="border-collapse">
      <thead>
        <tr>
          <th className="border p-2">ID</th>
          <th className="border p-2">Name</th>
          <th className="border p-2">Type</th>
        </tr>
      </thead>
      <tbody>
        {JSON.parse(text).map((item) => (
          <tr key={item.id}>
            <td className="border p-2">{item.id}</td>
            <td className="border p-2">{item.name}</td>
            <td className="border p-2">{item.type}</td>
          </tr>
        ))}
      </tbody>
    </table><DownloadButton data={convertJSONStringToCSV(text)} filename="filters_details.csv" /></div>):selected === 'DataBase Download' && ai ? (
  <div  className="chat-bubble text-neutral-content">
    <table className="border-collapse">
      <thead>
        <tr>
          {Object.keys(JSON.parse(text)[0]).map((key) => (
            <th key={key} className="border p-2">
              {key}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {JSON.parse(text).map((item, index) => (
          <tr key={index}>
            {Object.values(item).map((value, subIndex) => (
              <td key={subIndex} className="border p-2">
                {value}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    <DownloadButton data={convertJSONStringToCSV(text)} filename="dataBase.csv" />
  </div>
) :(
        <div
          className={`w-screen overflow-hidden chat ${
            ai ? 'chat-start' : 'chat-end'
          }`}
        >
          <div className='chat-bubble text-neutral-content'>
            <Markdown markdownText={text} />
            <div className={`${ai ? 'text-left' : 'text-right'} text-xs`}>
              {moment(createdAt).calendar()}
            </div>
          </div>
        </div>
      )}
      <div className='avatar'>
        <div className='w-8 border rounded-full border-slate-400'>
          {ai ? (
            <MdComputer className='w-6 h-full m-auto' />
          ) : (
            <MdPerson className='w-6 h-full m-auto' />
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;

Message.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.number.isRequired,
    createdAt: PropTypes.number.isRequired,
    text: PropTypes.string,
    ai: PropTypes.bool,
    selected: PropTypes.string,
  }).isRequired,
};
