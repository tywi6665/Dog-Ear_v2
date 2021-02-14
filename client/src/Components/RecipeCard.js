import React, { useEffect, useState } from "react";
import moment from "moment";
import ShowMoreText from "react-show-more-text";
import Popup from "reactjs-popup";
import StarRatings from "react-star-ratings";
import { v4 as uuidv4 } from "uuid";

const Card = ({ recipeProp, tagsList, deleteRecipe, updateRecipe }) => {
  const [recipe, setRecipe] = useState(recipeProp);
  const [tagsToAdd, setTagsToAdd] = useState("");
  const [quickTag, setQuickTag] = useState("");
  const [notesToAdd, setNotesToAdd] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);
  const [newRating, setNewRating] = useState(recipe.rating);
  const [currentTab, setCurrentTab] = useState(1);
  const closeModal = () => [setOpen(false), setCurrentTab(1)];

  useEffect(() => {
    setRecipe(recipeProp);
    setNewRating(recipeProp.rating);
  }, [recipeProp]);

  const add = (e, field) => {
    e.preventDefault();
    setIsEditing(false);
    setQuickTag("");

    switch (field) {
      case "tags":
        let newTags = tagsToAdd.trim();
        if (newTags.length) {
          updateRecipe("tags_add", recipe.unique_id, newTags, setRecipe);
        }
        setTagsToAdd("");
        break;
      case "notes":
        let newNotes = notesToAdd.trim();
        if (newNotes.length) {
          updateRecipe("notes_add", recipe.unique_id, notesToAdd, setRecipe);
          setNotesToAdd("");
        }
        break;
      default:
        break;
    }
  };

  const remove = (e, field) => {
    e.preventDefault();
    let itemToRemove = e.target.closest("li").textContent.slice(0, -1);

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

  const ratingChanged = (rating) => {
    setNewRating(rating);
    updateRecipe("rating", recipe.unique_id, rating, setRecipe);
  };

  const renderTab1 = () => {
    return (
      <>
        <div className="title">
          <h2>{recipe.title}</h2>
        </div>
        <div className="title">
          <p>
            Author:{" "}
            <strong>
              <em>
                {recipe.author.length ? recipe.author : "No Assigned Author"}
              </em>
            </strong>
          </p>
        </div>
        <div className="rating-hasMade">
          <div className="rating">
            <StarRatings
              rating={newRating}
              starRatedColor="#f04a26"
              starEmptyColor="#808080"
              changeRating={ratingChanged}
              numberOfStars={5}
              starDimension="25px"
              starSpacing="3px"
              name="rating"
            />
            <button onClick={() => ratingChanged(0)}>Reset</button>
          </div>
          <div className="has-made">
            <input
              type="checkbox"
              className="check"
              name="check"
              value={recipe.has_made}
              onChange={() => console.log("click")}
              checked={recipe.has_made}
            />
            <label
              htmlFor="check"
              onClick={() =>
                updateRecipe("has_made", recipe.unique_id, recipe.has_made)
              }
            >
              Cooked
            </label>
          </div>
        </div>
        <div
          className={
            recipe.description ? "description" : "description description-em"
          }
        >
          <ShowMoreText
            lines={5}
            more="Show more"
            less="Show less"
            anchorClass="description-anchor"
            expanded={false}
            width={0}
          >
            {recipe.description
              ? recipe.description
              : "There is no description for this "}
          </ShowMoreText>
        </div>
      </>
    );
  };

  const join = (value) => {
    setQuickTag(value);
    if (tagsToAdd.length === 0) {
      setTagsToAdd(value);
    } else {
      let combinedTags = tagsToAdd + "," + value;
      setTagsToAdd(combinedTags);
    }
  };

  const renderTab2 = () => {
    return (
      <div className="tags-wrapper">
        <div className="tags-header">
          <p>
            <strong>Tagged As:</strong>
          </p>
          {isEditing ? (
            <form onSubmit={(e) => add(e, "tags")}>
              <div className="inner-form">
                <textarea
                  name="tags"
                  placeholder="Enter ',' delimited tags"
                  rows="2"
                  value={tagsToAdd}
                  onChange={(e) => setTagsToAdd(e.target.value)}
                />
                <div className="dropdown">
                  <div>
                    <select
                      value={quickTag}
                      onChange={(e) => join(e.currentTarget.value)}
                    >
                      <option value="" disabled={true}>
                        Quick Add Tags
                      </option>
                      {tagsList.map((tag, i) => (
                        <option value={tag} key={uuidv4()}>
                          {tag}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <button type="submit">
                {tagsToAdd.length > 0 ? "Submit" : "Close"}
              </button>
            </form>
          ) : (
            <p className="add" onClick={() => setIsEditing(true)}>
              +
            </p>
          )}
        </div>
        {recipe.tags.length > 0 ? (
          <ul className="tags">
            {recipe.tags.map((tag, i) => (
              <li key={uuidv4()}>
                {tag}
                <div className="delete-tag" onClick={(e) => remove(e, "tags")}>
                  <span>x</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>
            <em>This recipe has not been tagged yet</em>
          </p>
        )}
        <div className="notes-wrapper">
          <div className="notes">
            {recipe.notes.length > 0 ? (
              <ol>
                {recipe.notes.map((note) => (
                  <li key={uuidv4()}>
                    {note}
                    <div
                      className="delete-note"
                      onClick={(e) => remove(e, "notes")}
                    >
                      <span>x</span>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p>
                <em>There are no notes for this recipe yet.</em>
              </p>
            )}
          </div>
          <div className="add-notes">
            <form onSubmit={(e) => add(e, "notes")}>
              <textarea
                name="notes"
                placeholder="Add additional notes here."
                rows="3"
                value={notesToAdd}
                onChange={(e) => setNotesToAdd(e.target.value)}
              />
              <button type="submit">Add Note</button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="card">
      <div className="card-top">
        <img
          src={
            recipe.img_src
              ? recipe.img_src
              : "./static/graphics/default_image.jpg"
          }
          onClick={() => setOpen((o) => !o)}
        />
        <Popup trigger={<span className="delete"></span>} modal>
          {(close) => (
            <div className="delete-modal">
              <button className="close" onClick={close}>
                X
              </button>
              <div className="header">
                Are You Sure that You Want to Delete this Recipe???
              </div>
              <button
                className="delete"
                onClick={() => deleteRecipe(recipe.unique_id, "recipes")}
              >
                Delete this Recipe Entry
              </button>
            </div>
          )}
        </Popup>
      </div>
      <div className="card-bottom">
        <div className="title-wrapper">
          <h4 onClick={() => setOpen((o) => !o)}>{recipe.title}</h4>
          <div className="rating-hasMade">
            <div className="rating">
              <StarRatings
                rating={newRating}
                starRatedColor="#f04a26"
                starEmptyColor="#808080"
                changeRating={ratingChanged}
                numberOfStars={5}
                starDimension="22px"
                starSpacing="2px"
                name="rating"
              />
            </div>
            <div className="has-made">
              <input
                type="checkbox"
                className="check"
                name="check"
                value={recipe.has_made}
                onChange={() => console.log("click")}
                checked={recipe.has_made}
              />
              <label
                htmlFor="check"
                onClick={() =>
                  updateRecipe(
                    "has_made",
                    recipe.unique_id,
                    recipe.has_made,
                    setRecipe
                  )
                }
              >
                Cooked
              </label>
            </div>
          </div>
        </div>
        <div className="link-wrapper">
          <div className="link">
            <a href={recipe.url} target="_blank">
              Recipe Link
            </a>
          </div>
          <span className="timestamp">
            Saved On: {moment(recipe.timestamp).format("MMMM Do YYYY")}
          </span>
        </div>
      </div>

      <Popup open={open} closeOnDocumentClick onClose={closeModal}>
        <div className="modal recipe-modal">
          <div className="recipe-modal-central">
            <div className="recipe-modal-inner">
              <button className="close" onClick={closeModal}>
                X
              </button>
              <div className="modal-img">
                <div className="modal-img-back">
                  <img
                    src={
                      recipe.img_src
                        ? recipe.img_src
                        : "./static/graphics/default_image.jpg"
                    }
                  />
                </div>
              </div>
              <div className="modal-info">
                <div className="modal-info-inner">
                  <div className="modal-info-inner-tabs">
                    <ul>
                      <li
                        className={currentTab === 1 ? "active" : ""}
                        onClick={() => setCurrentTab(1)}
                      >
                        <h4>INFO</h4>
                      </li>
                      <li
                        className={currentTab === 2 ? "active" : ""}
                        onClick={() => setCurrentTab(2)}
                      >
                        <h4>TAGS/NOTES</h4>
                      </li>
                      <li>
                        <h4>
                          <a href={recipe.url} target="_blank">
                            WEBSITE
                          </a>
                        </h4>
                      </li>
                    </ul>
                  </div>
                  <div className="modal-info-text">
                    {currentTab === 1 ? [renderTab1()] : [renderTab2()]}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Popup>
    </div>
  );
};

export default Card;
