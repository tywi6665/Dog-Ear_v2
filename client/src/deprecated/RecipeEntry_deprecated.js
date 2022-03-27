import React, { useState, useRef } from "react";
import Editable from "./Editable";
// import firebase from "../utils/firebase";

const Card = ({
  recipe,
  unique_id,
  url,
  setRecipe,
  setIsOverlay,
  setUrl,
  handleCreate,
  handleDelete,
}) => {
  const [title, setTitle] = useState(recipe.title);
  const [imgSrc, setImgSrc] = useState(recipe.img_src);
  const [description, setDescription] = useState(recipe.description);
  const [author, setAuthor] = useState(recipe.author);
  const [tags, setTags] = useState(recipe.tags);
  const [allNotes, setAllNotes] = useState("");
  const [hasMade, setHasMade] = useState(false);
  const inputRef = useRef();

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
    setIsOverlay(false);
    handleDelete(recipe.unique_id, "crawledrecipe");
    setUrl("");
  };

  const splitTags = (tags) => {
    let split = tags.trim().split(",");
    setTags(split);
  };

  return (
    <div className="card">
      <div className="card-top">
        {imgSrc ? (
          <img src={imgSrc} />
        ) : (
          <Editable
            text={imgSrc}
            placeholder='Right click on image, and click "copy image address". Paste address here.'
            childRef={inputRef}
            type="textarea"
          >
            <textarea
              ref={inputRef}
              name="image source"
              placeholder='Right click on image, and click "copy image address". Paste address here.'
              rows="5"
              value={imgSrc}
              onChange={(e) => setImgSrc(e.target.value)}
            />
          </Editable>
        )}
      </div>
      <div className="card-bottom">
        <div className="title-wrapper">
          <h3>Title:</h3>
          <div>
            <label htmlFor="has-made">Has Made:</label>
            <input
              type="checkbox"
              id="has-made"
              name="has-made"
              value={hasMade}
              onClick={() => setHasMade(!hasMade)}
            />
          </div>
        </div>
        <Editable
          text={title}
          placeholder="Click Here to Add Recipe Title"
          childRef={inputRef}
          type="textarea"
        >
          <textarea
            ref={inputRef}
            name="title"
            placeholder="Click Here to Add Recipe Title"
            rows="5"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Editable>
        <h3>Author:</h3>
        <Editable
          text={author}
          placeholder="Click Here to Add Recipe Author"
          childRef={inputRef}
          type="textarea"
        >
          <textarea
            ref={inputRef}
            name="author"
            placeholder="Click Here to Add Recipe Author"
            rows="5"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </Editable>
        <div className="description">
          <h3>Description:</h3>
          <Editable
            text={description}
            placeholder="Click Here to Add Recipe Description"
            childRef={inputRef}
            type="textarea"
          >
            <textarea
              ref={inputRef}
              name="description"
              placeholder="Click Here to Add Recipe Description"
              rows="5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Editable>
        </div>
        <div>
          <h3>Tagged As:</h3>
          <Editable
            text={tags.join(",")}
            placeholder="Click Here to Add Recipe Tags"
            childRef={inputRef}
            type="textarea"
          >
            <textarea
              ref={inputRef}
              name="tags"
              placeholder="Enter ',' separated tags here"
              rows="5"
              value={tags.join(",")}
              onChange={(e) => splitTags(e.target.value)}
            />
          </Editable>
        </div>
        <div>
          <h3>Additional Notes:</h3>
          <Editable
            text={allNotes}
            placeholder="Click Here to Add Additional Notes"
            childRef={inputRef}
            type="textarea"
          >
            <textarea
              ref={inputRef}
              name="notes"
              placeholder="Add additional notes here."
              rows="10"
              value={allNotes}
              onChange={(e) => setAllNotes(e.target.value)}
            />
          </Editable>
        </div>
        <div className="link">
          <button onClick={createEntry}>Create Entry</button>
        </div>
      </div>
    </div>
  );
};

export default Card;
