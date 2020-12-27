import React, {useState} from 'react';

function App() {

  const [url, setUrl] = useState('https://www.google.com');
  const [crawlingStatus, setCrawlingStatus] = useState(null);
  const [data, setData] = useState(null);
  const [taskID, setTaskID] = useState(null);
  const [uniqueID, setUniqueID] = useState(null);
  const [statusInterval, setStatusInterval] = useState(1);

  async function startCrawl() {
    if(!url) {
      return false;
    }
    const response = await fetch('api/crawl/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({url: url})
    })
      .then(response => response.json())
      .then(data => console.log('Success:', data))
      .catch((error) => console.error('Error:', error));
  }

  return (
    <div className="App">
      <button onClick={() => startCrawl()}>Click Me!</button>
    </div>
  );
}

export default App;
