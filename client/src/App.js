import React, { useState, useEffect } from "react";
import RecipeCard from "./Components/RecipeCard";
import RecipeEntry from "./Components/RecipeEntry";
import Nav from "./Components/Nav";
import "./App.css";
import * as api from "./utils/api";
import { v4 as uuidv4 } from "uuid";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Fab from "@mui/material/Fab";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Zoom from "@mui/material/Zoom";

function App(props) {
  const [url, setUrl] = useState("");
  const [crawlingStatus, setCrawlingStatus] = useState(null);
  const [allRecipes, setAllRecipes] = useState(null);
  const [taskID, setTaskID] = useState(null);
  const [uniqueID, setUniqueID] = useState(null);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchOptions, setSearchOptions] = useState({});
  const [sortBy, setSortBy] = useState("-timestamp");
  const [query, setQuery] = useState("");
  const [openOverlay, setOpenOverlay] = useState(false);
  const [crawledRecipe, setCrawledRecipe] = useState({});
  const [hadError, setHadError] = useState(false);
  const [recipeEntryType, setRecipeEntryType] = useState("");

  function ScrollTop(props) {
    const { children } = props;
    const trigger = useScrollTrigger();

    const handleScroll = (event) => {
      const anchor = (event.target.ownerDocument || document).querySelector(
        "#back-to-top-anchor"
      );

      if (anchor) {
        anchor.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    };

    return (
      <Zoom in={trigger}>
        <Box
          onClick={handleScroll}
          role="presentation"
          id="scroll-btn"
          sx={{ position: "fixed", bottom: 16, right: 16 }}
        >
          {children}
        </Box>
      </Zoom>
    );
  }

  let statusInterval = 1;

  useEffect(() => {
    apiStateReferences();
  }, [sortBy]);

  async function handleCreate(recipe) {
    api.createRecipe(recipe, apiStateReferences);
    // document.getElementById("scroll-btn").click();
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
      case "edit_entry":
        api.editEntry(unique_id, value, setState);
        break;
      default:
        break;
    }
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
    if (allRecipes !== null) {
      let arr = {
        tags: [],
        allOptions: [],
      };
      allRecipes.forEach((recipe) => {
        let tags = recipe.tags;
        let cleanedTitle = recipe.title.trim();
        tags.forEach((tag) => {
          if (tag.length) {
            let cleanedTag = tag.toLowerCase().trim();
            if (!arr.tags.includes(cleanedTag)) {
              arr.tags.push(cleanedTag);
            }
            if (!arr.allOptions.includes(cleanedTag)) {
              arr.allOptions.push(cleanedTag);
            }
          }
        });
        if (!arr.allOptions.includes(cleanedTitle)) {
          arr.allOptions.push(cleanedTitle);
        }
      });
      let options = arr.tags.map((option) => {
        if (option.length) {
          const firstLetter = option[0].toUpperCase();
          option = option.split(" ").map(function (word) {
            return word.replace(word[0], word[0].toUpperCase());
          });
          return {
            firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
            tag: option[0],
          };
        }
      });
      arr.tags = options;
      arr.allOptions.sort();
      setSearchOptions(arr);
    }
  }, [allRecipes]);

  useEffect(() => {
    if (allRecipes !== null) {
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

  const connect = (e, type) => {
    e.preventDefault();
    if (type === "crawl") {
      startCrawl();
    } else {
      setCrawledRecipe({
        unique_id: uuidv4(),
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
    }
    setOpenOverlay(true);
  };

  const disconnect = (type) => {
    if (hadError == true) {
      setHadError(false);
    } else if (type === "crawl") {
      handleDelete(uniqueID, "crawledrecipe");
    }
    setCrawledRecipe({});
    setRecipeEntryType("");
    setOpenOverlay(false);
  };

  return (
    <div id="client_page">
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Nav
          sortBy={sortBy}
          setSortBy={setSortBy}
          query={query}
          setQuery={setQuery}
          searchOptions={searchOptions}
          recipeEntryType={recipeEntryType}
          setRecipeEntryType={setRecipeEntryType}
          connect={connect}
          url={url}
          setUrl={setUrl}
          allRecipes={allRecipes}
        />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar id="back-to-top-anchor" />
          <Grid
            container
            justifyContent="space-around"
            alignItems="center"
            spacing={2}
          >
            {filteredRecipes.length ? (
              filteredRecipes.map((recipe) => (
                <Grid item xs="auto" key={uuidv4()}>
                  <RecipeCard
                    recipeInfo={recipe}
                    quickTagOptions={searchOptions.tags}
                    deleteRecipe={handleDelete}
                    updateRecipe={handleUpdate}
                    key={uuidv4()}
                  />
                </Grid>
              ))
            ) : (
              <Grid item xs="auto">
                <CircularProgress color="error" />
              </Grid>
            )}
          </Grid>
        </Box>
        <ScrollTop {...props}>
          <Fab color="error" size="small" aria-label="scroll back to top">
            <KeyboardArrowUpIcon />
          </Fab>
        </ScrollTop>
      </Box>
      <Modal
        open={openOverlay}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            setOpenOverlay(false);
          }
        }}
        closeAfterTransition
        disableEscapeKeyDown
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "scroll",
        }}
      >
        {(url || recipeEntryType === "blank") && openOverlay ? (
          <Box
            sx={{
              width: "50%",
              background: "white",
              borderRadius: "4px",
              border: "1px solid #f04a26",
              boxShadow: 24,
              p: 4,
              zIndex: 10,
              position: "relative",
            }}
            id="recipeEntry-modal"
          >
            {Object.keys(crawledRecipe).length ? (
              <Box component="div">
                <div>
                  <Button
                    variant="contained"
                    color="error"
                    sx={{ position: "absolute", top: 10, right: 10 }}
                    onClick={() => [disconnect(recipeEntryType), setUrl("")]}
                  >
                    <DeleteRoundedIcon />
                  </Button>
                </div>
                {hadError ? (
                  <Typography variant="body1" component="p" mb={1}>
                    <em>
                      {" "}
                      The Recipe could not be scraped. Please input the recipe
                      information manually:
                    </em>
                  </Typography>
                ) : (
                  <Typography variant="body1" component="p" mb={1}>
                    <em>Example Recipe Entry:</em>
                  </Typography>
                )}
                <RecipeEntry
                  recipe={crawledRecipe}
                  key={crawledRecipe.unique_id}
                  unique_id={crawledRecipe.unique_id}
                  url={url}
                  setRecipe={setCrawledRecipe}
                  setOpenOverlay={setOpenOverlay}
                  handleCreate={handleCreate}
                  handleDelete={handleDelete}
                  setUrl={setUrl}
                  hadError={hadError}
                  quickTagOptions={searchOptions.tags}
                  type={recipeEntryType}
                  setType={setRecipeEntryType}
                />
              </Box>
            ) : (
              <>
                <div className="dog-loader">
                  <div className="dog-head">
                    <img src="./static/graphics/dog-head.png" />
                  </div>
                  <div className="dog-body"></div>
                </div>
                <p className="dog-loader-p">
                  <em>Fetching deliciousness...</em>
                </p>
              </>
            )}
          </Box>
        ) : null}
      </Modal>
    </div>
  );
}

export default App;
