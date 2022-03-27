import React, { useState, useEffect } from "react";
import RecipeCard from "./Components/RecipeCard";
import RecipeEntry from "./Components/RecipeEntry";
import "./App.scss";
import * as api from "./utils/api";
import { v4 as uuidv4 } from "uuid";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Button } from "@mui/material";
import Icon from "@mdi/react";
import { mdiDog } from "@mdi/js";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

const drawerWidth = 225;

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
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;

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
      let arr = {
        tags: [],
        allOptions: [],
      };
      allRecipes.forEach((recipe) => {
        let tags = recipe.tags;
        let cleanedTitle = recipe.title.trim();
        tags.forEach((tag) => {
          let cleanedTag = tag.toLowerCase().trim();
          if (!arr.tags.includes(cleanedTag)) {
            arr.tags.push(cleanedTag);
          }
          if (!arr.allOptions.includes(cleanedTag)) {
            arr.allOptions.push(cleanedTag);
          }
        });
        if (!arr.allOptions.includes(cleanedTitle)) {
          arr.allOptions.push(cleanedTitle);
        }
      });
      let options = arr.tags.map((option) => {
        const firstLetter = option[0].toUpperCase();
        option = option.split(" ").map(function (word) {
          return word.replace(word[0], word[0].toUpperCase());
        });
        return {
          firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
          tag: option[0],
        };
      });
      arr.tags = options;
      arr.allOptions.sort();
      setSearchOptions(arr);
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

  const connect = (e, type) => {
    e.preventDefault();
    if (type === "crawl") {
      // startCrawl();
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

  const drawer = (
    <>
      <Box sx={{ overflow: "auto", mt: 10 }}>
        <div className="dog-image">
          <img src="./static/graphics/dog.png" alt="Woof woof" />
        </div>
        <List>
          <ListItem sx={{ justifyContent: "center" }}>
            <div>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-standard-label">
                  Sort By
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={sortBy}
                  onChange={(e) => [setSortBy(e.target.value), setQuery("")]}
                  label="Sort By"
                >
                  <MenuItem value="-timestamp">Newest</MenuItem>
                  <MenuItem value="timestamp">Oldest</MenuItem>
                  <MenuItem value="-rating">Highest Rated</MenuItem>
                  <MenuItem value="title">Title A-Z</MenuItem>
                  <MenuItem value="-title">Title Z-A</MenuItem>
                  <MenuItem value="-has_made">Has Been Cooked</MenuItem>
                  <MenuItem value="has_made">Has NOT Been Cooked</MenuItem>
                </Select>
              </FormControl>
            </div>
          </ListItem>
          <ListItem sx={{ justifyContent: "center" }}>
            <div>
              {searchOptions.allOptions ? (
                <Autocomplete
                  freeSolo
                  sx={{ m: 1, minWidth: 180 }}
                  disableClearable
                  options={searchOptions.allOptions.map((option) => option)}
                  value={query}
                  onChange={(e, value) => setQuery(value)}
                  inputValue={query}
                  onInputChange={(e, value) => {
                    setQuery(value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="Search input"
                      InputProps={{
                        ...params.InputProps,
                        type: "search",
                      }}
                    />
                  )}
                />
              ) : null}
            </div>
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem>
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": {
                  display: "flex",
                  justifyContent: "center",
                },
              }}
              onSubmit={(e) => [
                setRecipeEntryType("crawl"),
                connect(e, "crawl"),
              ]}
              noValidate
              autoComplete="off"
            >
              <div style={{ width: "100%" }}>
                <TextField
                  id="outlined-basic"
                  label="Fetch New Recipe:"
                  placeholder="Paste URL Here"
                  variant="outlined"
                  value={recipeEntryType !== "blank" ? url : null}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="error"
                  disabled={url.length ? false : true}
                  endIcon={
                    <Icon
                      path={mdiDog}
                      title="Dog"
                      size={1}
                      horizontal
                      vertical
                      rotate={180}
                      color={url.length ? "white" : "darkgray"}
                    />
                  }
                  sx={{
                    margin: "0 8px 8px 0px",
                    width: "100%",
                  }}
                >
                  {"Get Recipe!"}
                </Button>
              </div>
            </Box>
          </ListItem>
          <ListItem>
            <Box
              component="div"
              sx={{
                "& .MuiTextField-root": {
                  display: "flex",
                  justifyContent: "center",
                },
              }}
            >
              <div style={{ width: "100%" }}>
                <Button
                  type="submit"
                  variant="outlined"
                  color="error"
                  onClick={(e) => [
                    setRecipeEntryType("blank"),
                    connect(e, "blank"),
                  ]}
                  sx={{
                    margin: "0 8px 8px 0px",
                    width: "100%",
                  }}
                >
                  {"Blank Recipe Entry"}
                </Button>
              </div>
            </Box>
          </ListItem>
          <ListItem>
            <Typography
              variant="body1"
              component="p"
              sx={{ p: 1, textAlign: "center" }}
            >
              {allRecipes ? (
                <em>You have saved {allRecipes.length} recipes to date!</em>
              ) : null}
            </Typography>
          </ListItem>
        </List>
      </Box>
    </>
  );

  return (
    <div id="client_page">
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          color="error"
          sx={{
            width: { sm: "100%" },
            ml: { sm: `${drawerWidth}px` },
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h2"
              noWrap
              component="h2"
              sx={{ p: 1, fontFamily: "Brush Script MT" }}
            >
              Dog-Ear
            </Typography>
            <Typography
              variant="h4"
              component="h4"
              id="subtitle"
              sx={{ p: 1, fontFamily: "Brush Script MT" }}
            >
              Recipe Repository
            </Typography>
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
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
                  // recipe={{
                  //   title: "My awesome title",
                  //   author: "My awesome author",
                  //   description: "My awesome description",
                  //   img_src: "",
                  //   tags: "",
                  // }}
                  // unique_id={12345}
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
