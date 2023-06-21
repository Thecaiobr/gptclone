import logo from './logo.svg';
import './App.css';
import './normal.css';
import { useState, useEffect } from 'react';

function App() {

  //use effect run once whenapp loads
  useEffect(() => {
    getEngines();
  }, [])

  //add state for input and chat log
  const [input, setInput] = useState("");
  const [models, setModels] = useState([]);
  const [currentModel, setCurrentModel] = useState("ada");
  const [chatLog, setChatLog] = useState([{
    user: "gpt",
    message: "How can i help you today?"
  },{
    user: "me",
    message: "Oi chatgpt?"
  }
]);

function clearChat(){
  setChatLog([]);
}

//api request for the models
function getEngines(){
  fetch("http://localhost:3080/models")
  .then(res => res.json())
  .then(data => setModels(data.models))
}

  async function handleSubmit(e) {
    e.preventDefault();
    let chatLogNew = [...chatLog,{ user: "me", message: `${input}`}]
    setInput("");
    setChatLog(chatLogNew)
    //obtém(fetch) a resposta para a API combinando o array de mensagens do chat log e enviando-o como uma mensagem para localhost:3000 como um post
    const messages = chatLogNew.map((message) => message.message).join("\n")

    const response = await fetch("http://localhost:3080/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      //mensagem que estaremos enviando para a api
      body:JSON.stringify({
        message: messages,
        currentModel,
      })
    });
    const data = await response.json();
    setChatLog([...chatLogNew, { user: "gpt", message: `${data.message}`}])
    
  }

  return (
    <div className="App">
      <aside className="sidemenu">
        <div className="side-menu-button" onClick={clearChat}>
          <span>+</span>
          New Chat
        </div>
        <div className='models'>
          <select onChange={(e) => {
            setCurrentModel(e.target.value);
          }}>
          {models.map((model, index) => (
              <option key={model.id} value={model.id}>{model.id}</option>
            ))}
          </select>
        </div>
      </aside>
      <section className="chatbox">
        <div className="chat-log">
          {chatLog.map((message, index) => (
          <ChatMessage key={index} message={message} />
          ))}
          
        </div>
        <div className="chat-input-holder">
        <form onSubmit={handleSubmit}>
          <input 
            rows="1"
            value={input}
            onChange={(e) => setInput(e.target.value)} 
            className="chat-input-textarea"></input>
        </form>

        </div>
      </section>
    </div>
  );
}

const ChatMessage = ({ message }) => {
  return (
    <div className={`chat-message ${message.user === "gpt" && "chatgpt"}`}>
            <div className="chat-message-center">
              <div className={`avatar ${message.user === "gpt" && "chatgpt"}`}>
                
                </div>
                <div className="message">
                    {message.message}
                </div>
            </div>
          </div>
  )
}

export default App;
