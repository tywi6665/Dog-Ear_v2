import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import Icon from "@mdi/react";
import { mdiDog } from "@mdi/js";

const drawerWidth = 225;

const Nav = ({
  sortBy,
  setSortBy,
  query,
  setQuery,
  searchOptions,
  recipeEntryType,
  setRecipeEntryType,
  connect,
  url,
  setUrl,
  allRecipes,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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
                <InputLabel id="side-bar">Sort By</InputLabel>
                <Select
                  labelId="side-bar"
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
                setMobileOpen(false),
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
                    setMobileOpen(false),
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
    <>
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
      >
        <Drawer
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
    </>
  );
};

export default Nav;
