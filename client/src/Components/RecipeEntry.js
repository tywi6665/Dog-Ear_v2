import React, { useState } from "react";
import Box from "@mui/material/Box";
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

const RecipeEntry = ({
  recipe,
  unique_id,
  url,
  setRecipe,
  setOpenOverlay,
  setUrl,
  handleCreate,
  handleDelete,
  quickTagOptions,
  type,
  setType,
}) => {
  const [title, setTitle] = useState(titleCase(recipe.title));
  const [imgSrc, setImgSrc] = useState(recipe.img_src);
  const [description, setDescription] = useState(recipe.description);
  const [author, setAuthor] = useState(recipe.author);
  const [tags, setTags] = useState(recipe.tags);
  const [allNotes, setAllNotes] = useState("");
  const [hasMade, setHasMade] = useState(false);

  const createEntry = () => {
    let notes;

    if (allNotes.length > 0) {
      notes = [allNotes.trim()];
    } else {
      notes = [];
    }

    handleCreate({
      unique_id: unique_id,
      title: title,
      url: url,
      author: author,
      img_src: imgSrc,
      description: description,
      has_made: hasMade,
      notes: notes,
      rating: 0,
      tags: tags,
    });
    setRecipe({});
    setOpenOverlay(false);
    if (type === "crawl") {
      handleDelete(recipe.unique_id, "crawledrecipe");
    }
    setUrl("");
    setType("");
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
        {type === "blank" ? (
          <div>
            <TextField
              id="standard-helperText"
              label="Recipe URL"
              variant="filled"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              sx={{ m: 2 }}
            />
          </div>
        ) : null}
        <div style={{ textAlign: "center" }}>
          {imgSrc ? (
            <img
              src={imgSrc}
              style={{ maxWidth: "225px", maxHeight: "225px" }}
            />
          ) : (
            <TextField
              id="standard-helperText"
              label="Recipe Image"
              placeholder='Right click on image, and click "copy image address". Paste address here.'
              variant="filled"
              value={imgSrc}
              onChange={(e) => setImgSrc(e.target.value)}
              sx={{ m: 2 }}
            />
          )}
        </div>
        <div>
          <FormControlLabel
            value="Has Made?"
            control={
              <Checkbox value={hasMade} onClick={() => setHasMade(!hasMade)} />
            }
            label="Has Made?"
            labelPlacement="start"
          />
        </div>
        <div>
          <TextField
            id="standard-helperText"
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
            id="standard-helperText"
            label="Recipe Author"
            variant="filled"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            sx={{ m: 2 }}
          />
        </div>
        <div>
          <TextField
            id="standard-helperText"
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
            sx={{ m: 2 }}
            options={quickTagOptions.sort(
              (a, b) => -b.firstLetter.localeCompare(a.firstLetter)
            )}
            onChange={(e, value) => {
              let tags = [];
              value.forEach((val) => tags.push(val.tag.trim()));
              setTags(tags);
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
              <TextField {...params} label="Add Tags" variant="filled" />
            )}
          />
        </div>
        <div>
          <TextField
            id="standard-helperText"
            label="Add Notes"
            variant="filled"
            value={allNotes}
            onChange={(e) => setAllNotes(e.target.value)}
            sx={{ m: 2 }}
            multiline
            maxRows={4}
          />
        </div>
        <Button
          type="submit"
          variant="contained"
          color="error"
          disabled={title.length && url.length ? false : true}
          onClick={createEntry}
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
          {"Create Entry"}
        </Button>
      </Box>
    </Box>
  );
};

export default RecipeEntry;
