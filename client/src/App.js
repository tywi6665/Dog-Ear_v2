import React, { useState, useEffect } from "react";
import RecipeCard from "./Components/RecipeCard";
import RecipeEntry from "./Components/RecipeEntry";
import "./App.scss";
import * as api from "./utils/api";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [url, setUrl] = useState("");
  const [crawlingStatus, setCrawlingStatus] = useState(null);
  const [allRecipes, setAllRecipes] = useState(null);
  const [taskID, setTaskID] = useState(null);
  const [uniqueID, setUniqueID] = useState(null);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [sortBy, setSortBy] = useState("-timestamp");
  const [query, setQuery] = useState("");
  const [isOverlay, setIsOverlay] = useState(false);
  const [crawledRecipe, setCrawledRecipe] = useState({});
  const [hadError, setHadError] = useState(false);

  let statusInterval = 1;

  useEffect(() => {
    apiStateReferences();
  }, [sortBy]);

  async function handleCreate(recipe) {
    api.createRecipe(recipe, apiStateReferences);
  }

  async function handleDelete(unique_id, route) {
    api.deleteRecipe(unique_id, route, apiStateReferences);
  }

  async function handleUpdate(field, unique_id, value, setState) {
    switch (field) {
      case "has_made":
        api.updateHasMade(unique_id, value, setState);
        break;
      case "rating":
        api.updateRating(unique_id, value, setState);
        break;
      case "notes_add":
        api.addNotes(unique_id, value, setState);
        break;
      case "notes_remove":
        api.removeNotes(unique_id, value, setState);
        break;
      case "tags_add":
        api.addTags(unique_id, value, setState);
        break;
      case "tags_remove":
        api.removeTags(unique_id, value, setState);
        break;
      default:
        break;
    }
    // setSortBy("-timestamp");
    // setQuery("");
  }

  async function apiStateReferences() {
    api.getAll(setAllRecipes, setFilteredRecipes, sortBy);
  }

  async function startCrawl() {
    if (!url) {
      return false;
    }
    const response = await fetch("crawl/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ method: "POST", url: url }),
    })
      .then((response) => response.json())
      .then((data) => {
        setTaskID(data.task_id);
        setUniqueID(data.unique_id);
        setCrawlingStatus(data.status);
        statusInterval = setInterval(
          () => checkCrawlStatus(data.task_id, data.unique_id),
          2000
        );
      })
      .catch((error) => console.error("Error:", error));
  }

  async function checkCrawlStatus(task_id, unique_id) {
    const data = JSON.stringify({
      method: "GET",
      task_id: task_id,
      unique_id: unique_id,
    });
    // Making a request to server to ask status of crawling job
    const response = await fetch(
      "crawl/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      },
      data
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.data) {
          clearInterval(statusInterval);
          setCrawlingStatus("finished");
          setCrawledRecipe(data.data);
        } else if (data.error) {
          console.log(data.error);
          clearInterval(statusInterval);
          setCrawlingStatus("finished");
          setHadError(true);
          let newID = uuidv4();
          setCrawledRecipe({
            unique_id: newID,
            url: url,
            title: "",
            author: "",
            description: "",
            has_made: false,
            img_src: "",
            notes: [],
            rating: 0,
            tags: [],
            timestamp: Date.now(),
          });
        } else if (data.status) {
          setCrawlingStatus(data.status);
        }
      });
  }

  useEffect(() => {
    if (allRecipes) {
      let arr = [];
      allRecipes.forEach((recipe) => {
        let tags = recipe.tags;
        tags.forEach((tag) => {
          let cleanedTag = tag.toLowerCase().trim();
          if (!arr.includes(cleanedTag)) {
            arr.push(cleanedTag);
          }
        });
      });
      setTagsList(arr.sort());
    }
  }, [allRecipes]);

  useEffect(() => {
    if (allRecipes) {
      const searchAllRegex = query && new RegExp(`${query}`, "gi");
      const result = allRecipes.filter(
        (recipe) =>
          !searchAllRegex ||
          searchAllRegex.test(recipe.title) +
            searchAllRegex.test(recipe.author) +
            searchAllRegex.test(recipe.tags)
      );
      setFilteredRecipes(result);
    }
  }, [query]);

  const connect = (e) => {
    e.preventDefault();
    startCrawl();
    setIsOverlay(true);
  };

  const disconnect = () => {
    if (hadError == true) {
      setHadError(false);
    } else {
      handleDelete(uniqueID, "crawledrecipe");
    }
    setCrawledRecipe({});
    setIsOverlay(false);
  };

  return (
    <div id="client_page">
      <div
        className="overlay"
        style={
          isOverlay && url.length ? { display: "block" } : { display: "none" }
        }
      >
        {url && isOverlay ? (
          <div className="entry_popup fadeIn">
            {Object.keys(crawledRecipe).length ? (
              <>
                <header className="popup-header">
                  <div className="back">
                    <button onClick={() => [disconnect(), setUrl("")]}></button>
                  </div>
                  {hadError ? (
                    <h3>
                      <em>
                        The Recipe could not be scraped. Please input the recipe
                        information manually:
                      </em>
                    </h3>
                  ) : (
                    <h3>
                      <em>Example Recipe Entry:</em>
                    </h3>
                  )}
                </header>
                <RecipeEntry
                  recipe={crawledRecipe}
                  key={crawledRecipe.unique_id}
                  unique_id={crawledRecipe.unique_id}
                  url={url}
                  setRecipe={setCrawledRecipe}
                  setIsOverlay={setIsOverlay}
                  handleCreate={handleCreate}
                  handleDelete={handleDelete}
                  setUrl={setUrl}
                  hadError={hadError}
                />
              </>
            ) : (
              <>
                <div className="dog-loader">
                  <div className="dog-head">
                    <img src="./static/graphics/dog-head.png" />
                  </div>
                  <div className="dog-body"></div>
                </div>
                <p className="dog-loader-p">
                  <em>Scraping data...</em>
                </p>
              </>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
      <header className="page-header">
        <div className="titles">
          <h1>Dog-Ear</h1>
          <h2>Recipe Repository</h2>
        </div>
        <div className="dog-image">
          <img src="./static/graphics/dog.png" alt="Woof woof" />
        </div>
      </header>
      <div className="interaction-wrapper">
        {/* <div className="search-sort"> */}
        <div className="bigger-box">
          <div className="box">
            <p>Sort Recipes by:</p>
            <div className="dropdown" id="dropdown">
              <select
                id="select"
                value={sortBy}
                onChange={(e) => [
                  setSortBy(e.currentTarget.value),
                  setQuery(""),
                ]}
              >
                <option value="-timestamp">Newest</option>
                <option value="timestamp">Oldest</option>
                <option value="-rating">Highest Rated</option>
                <option value="title">Title A-Z</option>
                <option value="-title">Title Z-A</option>
                <option value="-has_made">Has Been Cooked</option>
                <option value="has_made">Has NOT Been Cooked</option>
              </select>
            </div>
          </div>
          <div className="box">
            <p>Search Recipes by Keyword:</p>
            <div className="search-wrapper">
              <div className="search">
                <input
                  type="search"
                  placeholder="Search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <span className="cancel" onClick={() => setQuery("")}>
                  x
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="box">
          <div className="scrape-wrapper">
            <div className="scrape">
              <form onSubmit={(e) => connect(e)}>
                <label htmlFor="#scrape-input">Create New Recipe Entry:</label>
                <input
                  type="text"
                  className="scrape-text"
                  id="scrape-input"
                  placeholder="Paste URL Here"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <input
                  className="scrape-submit"
                  type="submit"
                  value="Submit"
                  disabled={url.length ? false : true}
                />
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="card-container">
        {filteredRecipes.length ? (
          filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.unique_id}
              recipeProp={recipe}
              tagsList={tagsList}
              deleteRecipe={handleDelete}
              updateRecipe={handleUpdate}
            />
          ))
        ) : (
          <p>Fetching Saved Recipes</p>
        )}
      </div>
    </div>
  );
}

export default App;
