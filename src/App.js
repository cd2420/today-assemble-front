import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {

  const [ testStr, setTestStr] = useState('');

  function callback(str) {
    setTestStr(str);
  }

  useEffect(
    () => {
      axios (
        {
            url: '/api/v1/home'
            , method: 'get'
            , baseURL: 'http://localhost:8080'
            , withCredentials: true
        }
    ).then((res) => {
      callback(res.data);
    });
    }
  );

  return (
    <div className="App">
      {testStr}
    </div>
  );
}

export default App;
