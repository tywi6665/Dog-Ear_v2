import React, { useState, useEffect } from "react";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, CardActions } from "@mui/material";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import SendIcon from "@mui/icons-material/Send";
import SaveIcon from "@mui/icons-material/Save";
import Link from "@mui/material/Link";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import Slide from "@mui/material/Slide";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Divider from "@mui/material/Divider";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Popover from "@mui/material/Popover";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const filter = createFilterOptions();

const RecipeCard = ({
  recipeInfo,
  quickTagOptions,
  deleteRecipe,
  updateRecipe,
}) => {
  const [recipe, setRecipe] = useState(recipeInfo);
  const [popoverType, setPopoverType] = useState("");
  const [tagsToAdd, setTagsToAdd] = useState("");
  const [notesToAdd, setNotesToAdd] = useState("");
  const [newRating, setNewRating] = useState(recipe.rating);
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState("1");
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteAnchorEl, setDeleteAnchorEl] = useState(null);

  useEffect(() => {
    setRecipe(recipeInfo);
    setNewRating(recipeInfo.rating);
  }, [recipeInfo]);

  const add = (e, field) => {
    e.preventDefault();

    switch (field) {
      case "tags":
        if (tagsToAdd.length) {
          let newTags = tagsToAdd.join(",").toLowerCase();
          updateRecipe("tags_add", recipe.unique_id, newTags, setRecipe);
        }
        handleClosePopover();
        setTagsToAdd("");
        break;
      case "notes":
        if (notesToAdd.length) {
          let newNotes = notesToAdd.trim();
          updateRecipe("notes_add", recipe.unique_id, newNotes, setRecipe);
          handleClosePopover();
          setNotesToAdd("");
        }
        break;
      default:
        break;
    }
  };

  const remove = (e, field) => {
    e.preventDefault();
    let itemToRemove = e.target.closest("div").firstChild.textContent;

    switch (field) {
      case "tags":
        updateRecipe(
          "tags_remove",
          recipe.unique_id,
          itemToRemove.trim(),
          setRecipe
        );
        break;
      case "notes":
        updateRecipe(
          "notes_remove",
          recipe.unique_id,
          itemToRemove.trim(),
          setRecipe
        );
        break;
      default:
        break;
    }
  };

  const ratingChanged = (e, rating) => {
    if (rating !== null) {
      setNewRating(rating);
      updateRecipe("rating", recipe.unique_id, rating, setRecipe);
    }
  };

  const handleHasMade = () => {
    updateRecipe("has_made", recipe.unique_id, recipe.has_made, setRecipe);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleTabChange = (e, newValue) => {
    if (newValue === "1" || newValue === "2") {
      setTabValue(newValue);
    } else {
      window.open(newValue, "_blank");
    }
  };
  const handleClickPopover = (e, type) => {
    setPopoverType(type);
    setAnchorEl(e.currentTarget);
  };
  const handleClickDeletePopover = (e) => {
    setDeleteAnchorEl(e.currentTarget);
  };
  const handleClosePopover = () => {
    setAnchorEl(null);
    setPopoverType("");
  };
  const handleCloseDeletePopover = () => {
    setDeleteAnchorEl(null);
  };
  const popoverOpen = Boolean(anchorEl);
  const deletePopoverOpen = Boolean(deleteAnchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <Card sx={{ width: 345, position: "relative" }}>
        <Button
          variant="contained"
          color="error"
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "fit-content!important",
            minWidth: 0,
            p: "6px",
            zIndex: 10,
            bgcolor: "rgba(169,169,169, 0.5)",
          }}
          onClick={(e) => handleClickDeletePopover(e)}
        >
          {" "}
          <DeleteRoundedIcon
            sx={{
              color: "rgba(255,255,255, 0.7)",
            }}
          />
        </Button>
        <Popover
          id={id}
          open={deletePopoverOpen}
          anchorEl={deleteAnchorEl}
          onClose={handleCloseDeletePopover}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        >
          <Box
            component="div"
            sx={{
              "& .MuiTextField-root": {
                display: "flex",
                justifyContent: "flex-end",
              },
            }}
            onSubmit={(e) => add(e, "notes")}
            noValidate
            autoComplete="off"
          >
            <div style={{ width: 300, padding: 10, textAlign: "center" }}>
              <Typography gutterBottom variant="body1" component="p" mb={1}>
                <strong>Are you sure you want to delete this recipe???</strong>
              </Typography>
              <Button
                variant="contained"
                color="error"
                endIcon={<DeleteRoundedIcon />}
                onClick={() => [
                  deleteRecipe(recipe.unique_id, "recipes"),
                  handleCloseDeletePopover,
                ]}
              >
                {" Delete Recipe "}
              </Button>
            </div>
          </Box>{" "}
        </Popover>
        <CardActionArea onClick={handleOpen}>
          <CardMedia
            component="img"
            height="140"
            image={
              recipe.img_src
                ? recipe.img_src
                : "./static/graphics/default_image.jpg"
            }
          />
          <CardContent>
            <Typography
              gutterBottom
              variant="body1"
              component="p"
              mb={0}
              sx={{
                height: "50px",
                lineClamp: 2,
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              <strong>{recipe.title}</strong>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Saved On: {moment(recipe.timestamp).format("MMMM Do YYYY")}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Rating
              name="simple-controlled"
              value={newRating}
              onChange={ratingChanged}
            />
            <Stack direction="row" spacing={1}>
              <Chip
                label="Cooked"
                variant={recipe.has_made ? null : "outlined"}
                onClick={handleHasMade}
                color="error"
              />
            </Stack>
          </Box>
        </CardActions>
        <CardActions sx={{ padding: "8px 0 0 0" }}>
          <Box
            sx={{
              width: "100%",
            }}
          >
            <Link
              href={recipe.url}
              underline="none"
              color="inherit"
              target="_blank"
            >
              <Button
                variant="contained"
                color="error"
                endIcon={<SendIcon />}
                sx={{
                  width: "100%",
                }}
              >
                {"Go to Recipe"}
              </Button>
            </Link>
          </Box>
        </CardActions>
      </Card>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "scroll",
          paddingBottom: 20,
          paddingTop: 80,
        }}
      >
        <Slide direction="up" in={open} mountOnEnter unmountOnExit>
          <div className="blog-slider">
            <div className="blog-slider__wrp swiper-wrapper">
              <div className="blog-slider__item swiper-slide">
                <div className="blog-slider__img">
                  <img
                    src={
                      recipe.img_src
                        ? recipe.img_src
                        : "./static/graphics/default_image.jpg"
                    }
                  />
                </div>
                <div className="blog-slider__content">
                  <Grid container>
                    <Grid item xs={12}>
                      <TabContext value={tabValue} sx={{ color: "error" }}>
                        <TabList
                          value={tabValue}
                          onChange={handleTabChange}
                          indicatorColor="primary"
                          aria-label="secondary tabs example"
                        >
                          <Tab value="1" label="Info" />
                          <Tab value="2" label="Tags/Notes" />
                          <Tab value={recipe.url} label="Website" />
                        </TabList>
                        <TabPanel value="1">
                          <Typography variant="body1" component="p" mb={1}>
                            <strong>{recipe.title}</strong>
                          </Typography>
                          <Typography variant="body1" component="p" mb={1}>
                            <strong>Author:</strong>{" "}
                            <em>
                              {recipe.author.length
                                ? recipe.author
                                : "No Assigned Author"}
                            </em>
                          </Typography>
                          <Typography variant="body1" component="p">
                            {recipe.description
                              ? recipe.description
                              : "There is no description for this "}
                          </Typography>
                        </TabPanel>
                        <TabPanel value="2">
                          <Typography
                            variant="body1"
                            component="p"
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <strong>
                              <em>Tagged As:</em>
                            </strong>
                            <Fab
                              aria-describedby={id}
                              size="small"
                              color="error"
                              aria-label="add"
                              style={{
                                width: "30px",
                                height: "30px",
                                minHeight: "30px",
                              }}
                              onClick={(e) => handleClickPopover(e, "tags")}
                            >
                              <AddIcon />
                            </Fab>
                          </Typography>
                          <Divider
                            variant="left"
                            style={{ marginTop: "5px", marginBottom: "10px" }}
                          />
                          <Stack
                            direction="row"
                            spacing={1}
                            style={{ display: "flex", flexWrap: "wrap" }}
                          >
                            {recipe.tags.length > 0 ? (
                              recipe.tags.map((tag, i) => (
                                <Chip
                                  key={uuidv4()}
                                  label={tag}
                                  variant="outlined"
                                  color="error"
                                  onDelete={(e) => remove(e, "tags")}
                                  style={{ margin: "8px 0 0 8px" }}
                                />
                              ))
                            ) : (
                              <Typography variant="body2" component="p">
                                <em>This recipe has not been tagged yet</em>
                              </Typography>
                            )}
                          </Stack>
                          <Typography
                            variant="body1"
                            component="p"
                            mt={2}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <strong>
                              <em>Notes: </em>
                            </strong>
                            <Fab
                              aria-describedby={id}
                              size="small"
                              color="error"
                              aria-label="add"
                              style={{
                                width: "30px",
                                height: "30px",
                                minHeight: "30px",
                              }}
                              onClick={(e) => handleClickPopover(e, "notes")}
                            >
                              <AddIcon />
                            </Fab>
                          </Typography>
                          <Divider
                            variant="left"
                            style={{ marginTop: "5px", marginBottom: "10px" }}
                          />
                          <Stack direction="column" spacing={1}>
                            {recipe.notes.length > 0 ? (
                              recipe.notes.map((note, i) => (
                                <Chip
                                  key={uuidv4()}
                                  label={note}
                                  variant="outlined"
                                  color="error"
                                  onDelete={(e) => remove(e, "notes")}
                                  style={{
                                    color: "#000",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    height: "fit-content",
                                    padding: "4px 0",
                                    maxWidth: "100%",
                                  }}
                                />
                              ))
                            ) : (
                              <Typography variant="body2" component="p">
                                <em>This recipe has no notes yet</em>
                              </Typography>
                            )}
                          </Stack>
                          <Popover
                            id={id}
                            open={popoverOpen}
                            anchorEl={anchorEl}
                            onClose={handleClosePopover}
                            anchorOrigin={{
                              vertical: "top",
                              horizontal: "left",
                            }}
                            transformOrigin={{
                              vertical: "center",
                              horizontal: "right",
                            }}
                          >
                            {popoverType === "notes" ? (
                              <Box
                                component="form"
                                sx={{
                                  "& .MuiTextField-root": {
                                    display: "flex",
                                    justifyContent: "flex-end",
                                  },
                                }}
                                onSubmit={(e) => add(e, "notes")}
                                noValidate
                                autoComplete="off"
                              >
                                <div style={{ width: 400, padding: 8 }}>
                                  <TextField
                                    id="outlined-basic"
                                    label="Notes"
                                    placeholder="Add new notes here..."
                                    variant="outlined"
                                    multiline
                                    rows={4}
                                    onChange={(e) =>
                                      setNotesToAdd(e.target.value.trim())
                                    }
                                  />
                                  <Button
                                    type="submit"
                                    variant="contained"
                                    color="error"
                                    endIcon={<SaveIcon />}
                                    sx={{
                                      margin: "0 8px 8px 0px",
                                      width: "100%",
                                    }}
                                  >
                                    {"Save"}
                                  </Button>
                                </div>
                              </Box>
                            ) : (
                              <Box
                                component="form"
                                sx={{
                                  "& .MuiTextField-root": {
                                    display: "flex",
                                    justifyContent: "flex-end",
                                  },
                                }}
                                onSubmit={(e) => add(e, "tags")}
                                noValidate
                                autoComplete="off"
                              >
                                <div style={{ width: 300, padding: 8 }}>
                                  <Autocomplete
                                    sx={{ margin: 0 }}
                                    options={quickTagOptions.sort(
                                      (a, b) =>
                                        -b.firstLetter.localeCompare(
                                          a.firstLetter
                                        )
                                    )}
                                    onChange={(e, value) => {
                                      let tags = [];
                                      value.forEach((val) =>
                                        tags.push(val.tag.trim())
                                      );
                                      setTagsToAdd(tags);
                                    }}
                                    multiple={true}
                                    freeSolo
                                    disableCloseOnSelect
                                    filterOptions={(options, params) => {
                                      const filtered = filter(options, params);

                                      const { inputValue } = params;
                                      // Suggest the creation of a new value
                                      const isExisting = options.some(
                                        (option) => inputValue === option.tag
                                      );
                                      if (inputValue !== "" && !isExisting) {
                                        filtered.push({
                                          inputValue,
                                          tag: inputValue,
                                        });
                                      }
                                      return filtered;
                                    }}
                                    selectOnFocus
                                    clearOnBlur
                                    handleHomeEndKeys
                                    groupBy={(option) => option.firstLetter}
                                    getOptionLabel={(option) => {
                                      if (typeof option === "string") {
                                        return option;
                                      }
                                      if (option.inputValue) {
                                        return option.inputValue;
                                      }
                                      return option.tag;
                                    }}
                                    renderOption={(
                                      props,
                                      option,
                                      { selected }
                                    ) => (
                                      <li {...props}>
                                        <Checkbox
                                          icon={icon}
                                          checkedIcon={checkedIcon}
                                          style={{ marginRight: 8 }}
                                          checked={selected}
                                        />
                                        {option.tag}
                                      </li>
                                    )}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label="Tags"
                                        placeholder="Add tags here"
                                      />
                                    )}
                                  />
                                  <Button
                                    type="submit"
                                    variant="contained"
                                    color="error"
                                    endIcon={<SaveIcon />}
                                    sx={{
                                      margin: "0 8px 8px 0px",
                                      width: "100%",
                                    }}
                                  >
                                    {"Save"}
                                  </Button>
                                </div>
                              </Box>
                            )}
                          </Popover>
                        </TabPanel>
                      </TabContext>
                    </Grid>
                  </Grid>
                </div>
              </div>
            </div>
            <div className="blog-slider__pagination"></div>
          </div>
        </Slide>
      </Modal>
    </>
  );
};
export default RecipeCard;
