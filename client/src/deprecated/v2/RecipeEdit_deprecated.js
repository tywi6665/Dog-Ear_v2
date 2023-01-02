import React, { useState } from "react";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Button } from "@mui/material";
import Icon from "@mdi/react";
import { mdiDog } from "@mdi/js";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const filter = createFilterOptions();

const titleCase = (str) => {
  return str
    .toLowerCase()
    .split(" ")
    .map(function (word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

const RecipeEdit = ({
  recipe,
  setRecipe,
  quickTagOptions,
  setIsEditing,
  updateRecipe,
}) => {
  const [title, setTitle] = useState(titleCase(recipe.title));
  const [imgSrc, setImgSrc] = useState(recipe.img_src);
  const [description, setDescription] = useState(recipe.description);
  const [author, setAuthor] = useState(recipe.author);
  const [allTags, setAllTags] = useState(recipe.tags);
  const [allNotes, setAllNotes] = useState(recipe.notes);
  const [hasMade, setHasMade] = useState(recipe.has_made);
  const [rating, setRating] = useState(recipe.rating);

  const handleNotes = (note, index) => {
    const updatedNotes = [...allNotes];
    updatedNotes[index] = note;
    setAllNotes(updatedNotes);
  };

  const editEntry = () => {
    let notes = [...allNotes];

    if (notes.length > 0) {
      notes = notes.map((note) => {
        return note.trim();
      });
    } else {
      notes = [];
    }

    const updatedRecipe = {
      title: title,
      author: author,
      img_src: imgSrc,
      description: description,
      has_made: hasMade,
      rating: rating,
      notes: notes,
      tags: allTags,
    };

    updateRecipe("edit_entry", recipe.unique_id, updatedRecipe, setRecipe);
    setIsEditing(false);
  };

  return (
    <Box component="div">
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": {
            display: "flex",
            justifyContent: "center",
          },
        }}
        autoComplete="off"
      >
        <div style={{ textAlign: "center" }}>
          {imgSrc ? (
            <img
              src={imgSrc}
              style={{ maxWidth: "225px", maxHeight: "225px" }}
            />
          ) : (
            <img
              src={"./static/graphics/default_image.jpg"}
              style={{ maxWidth: "225px", maxHeight: "225px" }}
            />
          )}
        </div>
        <div>
          <TextField
            label="Recipe Image"
            placeholder='Right click on image, and click "copy image address". Paste address here.'
            variant="filled"
            value={imgSrc}
            onChange={(e) => setImgSrc(e.target.value)}
            sx={{ m: 2 }}
          />
        </div>
        <div style={{ marginLeft: "4px" }}>
          <FormControlLabel
            value="Has Made?"
            control={
              <Checkbox
                value={hasMade}
                checked={hasMade}
                onClick={() => setHasMade(!hasMade)}
              />
            }
            label="Has Made?"
            labelPlacement="start"
          />
        </div>
        <div>
          <Rating
            name="rating"
            value={rating}
            onChange={(e, rating) => {
              setRating(rating);
            }}
            sx={{ ml: 2 }}
          />
        </div>
        <div>
          <TextField
            label="Recipe Title"
            variant="filled"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ m: 2 }}
          />
        </div>
        <div>
          <TextField
            label="Recipe Author"
            variant="filled"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            sx={{ m: 2 }}
          />
        </div>
        <div>
          <TextField
            label="Recipe Description"
            variant="filled"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ m: 2 }}
            multiline
            maxRows={4}
          />
        </div>
        <div>
          <Autocomplete
            value={allTags}
            sx={{ m: 2 }}
            options={quickTagOptions.sort(
              (a, b) => -b.firstLetter.localeCompare(a.firstLetter)
            )}
            onChange={(e, value) => {
              let tags = [];
              value.forEach((val) => {
                if (typeof val === "string") {
                  tags.push(val.trim());
                } else {
                  tags.push(val.tag.trim());
                }
              });
              setAllTags(tags);
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
            renderOption={(props, option, { selected }) => (
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
              <TextField {...params} label="Edit Tags" variant="filled" />
            )}
          />
        </div>
        <div>
          {allNotes.length > 1 ? (
            allNotes.map((note, index) => (
              <TextField
                label="Edit Note"
                variant="filled"
                value={note}
                onChange={(e) => handleNotes(e.target.value, index)}
                sx={{ m: 2 }}
                multiline
                maxRows={4}
              />
            ))
          ) : (
            <TextField
              label="Add Note"
              variant="filled"
              value={allNotes}
              onChange={(e) => setAllNotes([e.target.value])}
              sx={{ m: 2 }}
              multiline
              maxRows={4}
            />
          )}
        </div>
        <Button
          type="button"
          variant="contained"
          color="error"
          disabled={title.length && recipe.url.length ? false : true}
          onClick={editEntry}
          endIcon={
            <Icon
              path={mdiDog}
              title="Dog"
              size={1}
              horizontal
              vertical
              rotate={180}
              color={title.length ? "white" : "darkgray"}
            />
          }
          sx={{
            margin: "0 8px 8px 0px",
            width: "100%",
          }}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default RecipeEdit;
