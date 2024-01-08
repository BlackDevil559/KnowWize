import { useState, useRef, useEffect, useContext } from 'react';
import Message from './Message';
import { ChatContext } from '../context/chatContext';
import Thinking from './Thinking';
import { MdSend } from 'react-icons/md';
import { HiArrowCircleUp,HiArrowCircleDown } from 'react-icons/hi'
import { FaSdCard } from 'react-icons/fa'
import { replaceProfanities } from 'no-profanity';
import { davinci } from '../utils/davinci';
import { dalle } from '../utils/dalle';
import { searchData } from '../utils/dbexplore';
import { getFilters, processFinalData } from '../utils/dbdownload';
import Modal from './Modal';

const options = ['Chat Bot', 'Image Generation','DataBase Query','DataBase Filters','DataBase Download','Image Prompt'];
const gptModel = ['gpt-3.5-turbo'];
const template = [
  { 
    title: 'Chat Bot',
    prompt: 'I want to plan a trip to New York City.',
  },
  {
    title: 'Image Generator',
    prompt: 'Father and Son',
  },
  {
    title: 'DataBase Query',
    prompt: 'mgnrega',
  },
  {
    title: 'DataBase Download',
    prompt: 'id : 8d3b6596-b09e-4077-aebf-425193185a5b, year : 2023',
  },
  {
    title: 'DataBase Filters',
    prompt: '8d3b6596-b09e-4077-aebf-425193185a5b',
  },
  {
    title: 'Image Prompt',
    prompt: 'Who is he?',
  },
];

/**
 * A chat view component that displays a list of messages and a form for sending new messages.
 */
const ChatView = () => {
  const messagesEndRef = useRef();
  const inputRef = useRef();
  const [formValue, setFormValue] = useState('');
  const [thinking, setThinking] = useState(false);
  const [selected, setSelected] = useState(options[0]);
  const [gpt, setGpt] = useState(gptModel[0]);
  const [messages, addMessage] = useContext(ChatContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [ImageName, setImageValue] = useState('');
  const [log, setLog] = useState([]);
  /**
   * Scrolls the chat area to the bottom.
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  

  /**
   * Adds a new message to the chat.
   *
   * @param {string} newValue - The text of the new message.
   * @param {boolean} [ai=false] - Whether the message was sent by an AI or the user.
   */
  const updateMessage = (newValue, ai = false, selected) => {
    const id = Date.now() + Math.floor(Math.random() * 1000000);
    const newMsg = {
      id: id,
      createdAt: Date.now(),
      text: newValue,
      ai: ai,
      selected: `${selected}`,
    };

    addMessage(newMsg);
    setLog((prevLog) => [...prevLog, newMsg]);
  };
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
  
    reader.onload = async (e) => {
      const csvData = e.target.result;
      setFormValue((prevValue) => prevValue + '\n' + csvData);
    };
  
    reader.readAsText(file);
  };
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
  
    reader.onload = async (e) => {
      const csvData = e.target.result;
      setImageValue((prevValue) => prevValue + '\n' + csvData);
    };
  
    reader.readAsText(file);
  }
  const downloadLogs = () => {
    const logContent = JSON.stringify(log, null, 2);
    const blob = new Blob([logContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chat_logs.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  /**
   * Sends our prompt to our API and get response to our request from openai.
   *
   * @param {Event} e - The submit event of the form.
   */
  const sendMessage = async (e) => {
    e.preventDefault();

    // const key = window.localStorage.getItem('api-key');
    const key="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";
    if (!key) {
      setModalOpen(true);
      return;
    }

    const cleanPrompt = replaceProfanities(formValue);

    const newMsg = cleanPrompt;
    const aiModel = selected;
    const gptVersion = gpt;

    setThinking(true);
    setFormValue('');
    updateMessage(newMsg, false, aiModel);
    console.log(gptVersion);

    console.log(selected);
    try {
      if (aiModel === options[0]) {
        const LLMresponse = await davinci(cleanPrompt, key, gptVersion);
        //const data = response.data.choices[0].message.content;
        // console.log("bhumesh2");
        setLog((prevLog) => [...prevLog,"Response Received Sucessfully by ChatBot"]);
        LLMresponse && updateMessage(LLMresponse, true, aiModel);
      } else if(aiModel === options[1]) {
        const response = await dalle(cleanPrompt, key);
        setLog((prevLog) => [...prevLog, "Response Received Sucessfully by Image Generator"]);
        const data = response.data.data[0].url;
        data && updateMessage(data, true, aiModel);
      } else if(aiModel == options[2]) {
        // const LLMresponse = await davinci("Who is Dhoni?", key, gptVersion);
        // //const data = response.data.choices[0].message.content;
        // console.log("bhumesh2");
        // LLMresponse && updateMessage(LLMresponse, true, aiModel);
        const res = await searchData(cleanPrompt);
        setLog((prevLog) => [...prevLog, "Response Received Sucessfully by DataBase Query"]);
        res && updateMessage(res,true,aiModel);
      }
      else if(aiModel == options[3]) {
        const res = await getFilters(cleanPrompt);
        // console.log(res);
        setLog((prevLog) => [...prevLog, "Response Received Sucessfully by DataBase Filters"]);
        res && updateMessage(res,true,aiModel);
      }
      else if(aiModel == options[4]) {
        const parts = cleanPrompt.split(',').map((part) => part.trim().split(':'));
        let id;
        parts.forEach(([key, value]) => {
          if (key.trim() === 'id') {
            id = value.trim();
          }
        });
        const restData = {};
        parts.forEach(([key, value]) => {
          if (key.trim() !== 'id') {
            restData[key.trim()] = value.trim();
          }
        });
        console.log(id);
        console.log(restData);
        setLog((prevLog) => [...prevLog, "Response Received Sucessfully by DataBase Download"]);
        const res = await processFinalData(id,restData);
        res && updateMessage(res,true,aiModel);
      }
      else if(aiModel == options[5]){

        
        "Upcoming, Please be patience" && updateMessage("Upcoming, Please be patience", true, aiModel);
      }
    } catch (err) {
      window.alert(`Error: ${err} please try again later`);
      setLog((prevLog) => [...prevLog, "Response Not Recieved"]);
    }

    setThinking(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // 👇 Get input value
      sendMessage(e);
    }
  };

  /**
   * Scrolls the chat area to the bottom when the messages array is updated.
   */
  useEffect(() => {
    scrollToBottom();
  }, [messages, thinking]);

  /**
   * Focuses the TextArea input to when the component is first rendered.
   */
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <main className='relative flex flex-col h-screen p-1 overflow-hidden dark:bg-light-grey'>
      <div className='mx-auto my-4 tabs tabs-boxed w-fit'>
        Welcome to {selected}
      </div>

      <section className='flex flex-col flex-grow w-full px-4 overflow-y-scroll sm:px-10 md:px-32'>
        {messages.length ? (
          messages.map((message, index) => (
            <Message key={index} message={{ ...message }} />
          ))
          
        ) : (
          <div className='flex my-2'>
            <div className='w-screen overflow-hidden'>
              <ul className='grid grid-cols-2 gap-2 mx-10'>
                {template.map((item, index) => (
                  <li
                    onClick={() => setFormValue(item.prompt)}
                    key={index}
                    className='p-6 border rounded-lg border-slate-300 hover:border-slate-500'>
                    <p className='text-base font-semibold'>{item.title}</p>
                    <p className='text-sm'>{item.prompt}</p>
                  </li>
                  
                ))
                }
              </ul>
            </div>
          </div>
        )}

        {thinking && <Thinking />}

        <span ref={messagesEndRef}></span>
      </section>
      <form
        className='flex flex-col px-10 mb-2 md:px-32 join sm:flex-row'
        onSubmit={sendMessage}>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className='w-full sm:w-40 select select-bordered join-item'>
          <option>{options[0]}</option>
          <option>{options[1]}</option>
          <option>{options[2]}</option>
          <option>{options[3]}</option>
          <option>{options[4]}</option>
          <option>{options[5]}</option>
        </select>
        <div className='flex items-stretch justify-between w-full'>
          <textarea
            ref={inputRef}
            className='w-full grow input input-bordered join-item max-h-[20rem] min-h-[3rem]'
            value={formValue}
            onKeyDown={handleKeyDown}
            onChange={(e) => setFormValue(e.target.value)}
          />
        <button type='submit' className='join-item btn' disabled={!formValue}>
          <MdSend size={30} />
        </button>

        <button
          className='join-item btn'
          disabled={selected !== options[0]}
          style={{ marginLeft: '10px', position: 'relative' }}
        >
          <HiArrowCircleUp size={30} />
          <input
            type="file"
            id="fileInput"
            accept=".csv"
            onChange={handleFileUpload}
            style={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          />
        </button>

        <button className='join-item btn' disabled={selected !== options[5]} style={{ marginLeft: '10px' , position: 'relative'}}>
          <FaSdCard size={30} />
          <input
            type="file"
            id="fileInput"
            accept=".png"
            onChange={handleImageUpload}
            style={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          />
        </button>
        <button onClick={downloadLogs} className='btn' style={{ marginLeft: '10px', size :"20px"}}>
        <HiArrowCircleDown size={30}/>
        </button>;
        </div>
      </form>
      {/* <Modal title='Setting' modalOpen={modalOpen} setModalOpen={setModalOpen}>
        <Setting modalOpen={modalOpen} setModalOpen={setModalOpen} />
      </Modal> */}
    </main>
  );
};

export default ChatView;
