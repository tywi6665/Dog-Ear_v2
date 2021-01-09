import React, { useState, useEffect } from 'react';
import RecipeCard from './Components/RecipeCard';
import RecipeEntry from "./Components/RecipeEntry";
import './App.scss';
import api from './utils/api';

function App() {

  const [url, setUrl] = useState('https://food52.com/blog/25722-what-is-marzipan');
  const [crawlingStatus, setCrawlingStatus] = useState(null);
  const [allRecipes, setAllRecipes] = useState(null);
  const [taskID, setTaskID] = useState(null);
  const [uniqueID, setUniqueID] = useState(null);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [tagsList, setTagsList] = useState([])
  const [sortBy, setSortBy] = useState("TIME_DESC");
  const [query, setQuery] = useState("");
  const [isOverlay, setIsOverlay] = useState(false);
  const [recipe, setRecipe] = useState({});

  let statusInterval = 1;

  useEffect(() => {
     fetch('api/recipes', {
          method: 'GET',
      })
      .then(response => response.json())
      .then(data => {
          console.log(data)
          setAllRecipes(data.data)
      setFilteredRecipes(data.data)
      })
  }, [])

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
        console.log(data)
        if (data.data) {
          clearInterval(statusInterval)
          setAllRecipes(data.data)
        } else if (data.error) {
          clearInterval(statusInterval)
          console.log(data.error)
        } else if (data.status) {
          setCrawlingStatus(data.status)
        }
      })
  }

  return (
      <div id="client_page">
        <button onClick={() => startCrawl()}>Click Me!</button>
      <div className="overlay"
        style={isOverlay && url.length ? { display: "block" } : { display: "none" }}
      >
        {
        // loadClient && 
        url && isOverlay ?
          (<div className="entry_popup">
            {Object.keys(recipe).length ?
              <>
                <header className="popup-header">
                  <div className="back">
                    <button 
                    // onClick={() => disconnect()}
                    ></button>
                  </div>
                  <h3><em>Example Recipe Entry:</em></h3>
                </header>
                <RecipeEntry
                  recipe={recipe}
                  key={recipe.id}
                  url={url}
                  setRecipe={setRecipe}
                  setIsOverlay={setIsOverlay}
                  setUrl={setUrl}
                />
              </>
              :
              <>
                <div className="dog-loader">
                  <div className="dog-head">
                    <img src="http://www.clker.com/cliparts/j/3/Z/Y/D/5/dog-head-md.png" />
                  </div>
                  <div className="dog-body">
                  </div>
                </div>
                <p className="dog-loader-p"><em>Scraping data...</em></p>
              </>
            }
          </div>)
          :
          <></>
        }
      </div>
      <header className="page-header">
        <div className="titles">
          <h1>Dog-Ear</h1>
          <h2>Recipe Repository</h2>
        </div>
        <div className="dog-image">
          <img src="./graphics/dog.png" alt="Woof woof" />
        </div>
      </header>
      <div className="interaction-wrapper">
        <div className="search-sort">
          <div className="dropdown">
            <select value={sortBy} onChange={e => setSortBy(e.currentTarget.value)}>
              <option value="TIME_DESC">Newest</option>
              <option value="TIME_ASC">Oldest</option>
              <option value="TITLE_ASC">Title A-Z</option>
              <option value="TITLE_DESC">Title Z-A</option>
              <option value="COOKED">Has Been Cooked</option>
              <option value="NOT_COOKED">Has NOT Been Cooked</option>
            </select>
          </div>
          <div className="search-wrapper">
            <div className="search">
              <input type="search" placeholder="Search" value={query} onChange={e => setQuery(e.target.value)} />
              <span
                className="cancel"
                onClick={() => setQuery("")}>x</span>
            </div>
          </div>
        </div>
        <div className="scrape-wrapper">
          <div className="scrape">
            <form 
            // onSubmit={e => connect(e)}
            >
              <label htmlFor="#scrape-input">Create New Recipe Entry:</label>
              <input type="text"
                className="scrape-text"
                id="scrape-input"
                placeholder="Paste URL Here"
                value={url} onChange={e => setUrl(e.target.value)}
              />
              <input className="scrape-submit"
                type="submit"
                value="Submit"
                disabled={url.length ? false : true} />
            </form>
          </div>
        </div>
      </div>
      <div className="card-container">
        {filteredRecipes ? filteredRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.unique_id}
            docID={recipe.unique_id}
            title={recipe.title}
            imgSrc={recipe.img_src}
            author={recipe.author}
            rating={recipe.rating}
            description={recipe.description}
            timestamp={recipe.timestamp}
            hasMade={recipe.has_made}
            tags={recipe.tags}
            tagsList={tagsList}
            notes={recipe.notes}
            url={recipe.url}
          />
        )) : <p>Fetching Saved Recipes</p>}
      </div>
    </div>
  );
}

export default App;
