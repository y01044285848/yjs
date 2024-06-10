import logo from './logo.svg';
import './App.css';
import * as Y from 'yjs'
import { useEffect, useState, useRef } from 'react';
function App() {
  
  const ydoc = new Y.Doc()
  const [text, setText] = useState("");
  const [message, setMessage] = useState('');
  const text1 = useRef("");
  const socketObj = useRef(null);
  
  const ymap = ydoc.getMap()
  //ymap.set('keyA', 'valueA')

  
  const ydocRemote = new Y.Doc()
  const ymapRemote = ydocRemote.getMap()
  //ymapRemote.set('keyB', 'valueB')

  
  const update = Y.encodeStateAsUpdate(ydocRemote)
  Y.applyUpdate(ydoc, update)

  
  console.log(ymap.toJSON())

  const textHandler = (e) =>{
    console.log(e.target.value);
    text1.current = e.target.value;
    socketObj.current.send(e.target.value);
  }

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080/community/testaa'); // 백엔드 WebSocket 주소
    socketObj.current = socket;
    socket.onopen = () => {
      console.log('WebSocket connected');
      socket.send('Hello Server!');
      
    };
    socket.onmessage = (event) => {

      console.log('Message from server:', event.data);
      setMessage(event.data);
      ymap.set('keyA', event.data)
      console.log(text1)
      ymapRemote.set('keyB', text1.current)
      const update = Y.encodeStateAsUpdate(ydocRemote)
      console.log(update)
      Y.applyUpdate(ydoc, update)

      
      console.log(ymap.toJSON())
    };
    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };


    
    setTimeout(()=>{
      socket.send(Math.floor(Math.random()*10000));
    },3000)
    
    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <input type='text' onChange={textHandler} value={message}></input>
        <h1>WebSocket Message</h1>
      <p>{message}</p>
      </header>
    </div>
  );
}

export default App;
