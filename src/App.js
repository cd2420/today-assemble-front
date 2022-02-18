import React, { useState, useEffect } from 'react';
import customAxios from './config/customAxios';
import METHOD_TYPE from './common/MethodType';

function App() {

  const [ testStr, setTestStr] = useState('');

  function callback(str) {
    setTestStr(str);
  }

  useEffect(
    () => {
      customAxios(METHOD_TYPE.GET, "/home", callback);
    }
  );

  return (
    <div className="App">
      {testStr}
    </div>
  );
}

export default App;
