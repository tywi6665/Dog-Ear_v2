import React, {useEffect, useState, useRef} from 'react';
// import axios from 'axios';

function App() {

  const [url, setUrl] = useState('https://www.google.com');
  const [crawlingStatus, setCrawlingStatus] = useState(null);
  const [data, setData] = useState(null);
  const [taskID, setTaskID] = useState(null);
  const [uniqueID, setUniqueID] = useState(null);
  // const [statusInterval, setStatusInterval] = useState(1);
  let statusInterval = 1;

  // useEffect(() => {
  //   statusInterval = setInterval(checkCrawlStatus, 2000)
  //   return () => clearInterval(statusInterval)
  // }, [taskID, uniqueID, crawlingStatus])

  async function startCrawl() {
    if(!url) {
      return false;
    }
    const response = await fetch('api/crawl/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({method: 'POST', url: url}) 
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data)
        setTaskID(data.task_id)
        setUniqueID(data.unique_id)
        setCrawlingStatus(data.status)
        statusInterval = setInterval(() => checkCrawlStatus(data.task_id, data.unique_id), 2000)
      })
      // .then(statusInterval = setInterval(checkCrawlStatus, 2000))
      .catch((error) => console.error('Error:', error));
  }

  async function checkCrawlStatus(task_id, unique_id) {
    console.log("Checking Crawl Status")
    console.log(task_id, unique_id)
    const data = JSON.stringify({
      method: 'GET', 
      task_id: task_id, 
      unique_id: unique_id
    })
    // Making a request to server to ask status of crawling job
    const response = await fetch('api/crawl/', 
    {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },  
        body: data  
      }, 
      data
      )
      .then(response => response.json())
      .then(data => {
        if (data.data) {
          clearInterval(statusInterval)
          setData(data.data)
        } else if (data.error) {
          clearInterval(statusInterval)
          console.log(data.error)
        } else if (data.status) {
          setCrawlingStatus(data.status)
        }
      })
  }

  return (
    <div className="App">
      <button onClick={() => startCrawl()}>Click Me!</button>
    </div>
  );
}

export default App;
