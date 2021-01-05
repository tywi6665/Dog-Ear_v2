import React, { useState } from 'react';
import moment from "moment";
import ShowMoreText from 'react-show-more-text';
import Popup from 'reactjs-popup';
import StarRatings from 'react-star-ratings';
// import { addItems, deleteEntry, removeItems, updateItem, updateRating } from "../helpers/functions";

const Card = ({ docID, title, imgSrc, author, rating, description, timestamp, hasMade, notes, tags, tagsList, url }) => {

    const [tagsToAdd, setTagsToAdd] = useState("");
    // const [quickTag, setQuickTag] = useState("");
    const [notesToAdd, setNotesToAdd] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [open, setOpen] = useState(false);
    const [newRating, setNewRating] = useState(rating)
    const [currentTab, setCurrentTab] = useState(1)
    const closeModal = () => [setOpen(false), setCurrentTab(1)]

    // const add = (e, field) => {
    //     e.preventDefault();
    //     setIsEditing(false);
    //     setQuickTag("");

    //     switch (field) {
    //         case "tags":
    //             let newTags = tagsToAdd;
    //             if (newTags.length) {
    //                 if (newTags.length === 1) {
    //                     addItems(docID, "tags", newTags);
    //                 } else {
    //                     newTags = newTags.split(",")
    //                     newTags.forEach(tag => {
    //                         addItems(docID, "tags", tag);
    //                     });
    //                 }
    //                 setTagsToAdd("");
    //             }
    //             break;
    //         case "notes":
    //             let newNotes = notesToAdd
    //             if (newNotes.length) {
    //                 let newNotes = notesToAdd.split("\n\n");
    //                 newNotes.forEach(note => {
    //                     addItems(docID, "notes", note);
    //                 });
    //                 setNotesToAdd("");
    //             }
    //             break;
    //         default:
    //             break;
    //     }
    // }

    // const remove = (e, field) => {
    //     e.preventDefault();
    //     let itemToRemove = e.target.closest("li").textContent.slice(0, -1);

    //     switch (field) {
    //         case "tags":
    //             removeItems(docID, "tags", itemToRemove)
    //             break;
    //         case "notes":
    //             removeItems(docID, "notes", itemToRemove)
    //             break;
    //         default:
    //             break;
    //     }
    // }

    // const ratingChanged = (rating) => {
    //     setNewRating(rating)
    //     updateRating(docID, rating)
    // }

    const renderTab1 = () => {
        return (
            <>
                <div className="title">
                    <h2>{title}</h2>
                </div>
                <div className="title">
                    <p>Author: <strong><em>{author.length ? author : "No Assigned Author"}</em></strong></p>
                </div>
                <div className="rating-hasMade">
                    <div className="rating">
                        <StarRatings
                            rating={newRating}
                            starRatedColor="#f04a26"
                            starEmptyColor="#808080"
                            // changeRating={ratingChanged}
                            numberOfStars={5}
                            starDimension="25px"
                            starSpacing="3px"
                            name='rating'
                        />
                        <button 
                        // onClick={() => ratingChanged(0)}
                        >Reset</button>
                    </div>
                    <div className="has-made">
                        <input type="checkbox" className="check" name="check"
                            value={hasMade}
                            onChange={() => console.log("click")}
                            checked={hasMade}
                        />
                        <label
                            htmlFor="check"
                            // onClick={() => updateItem(docID, hasMade)}
                        >Cooked</label>
                    </div>
                </div>
                <div className={description ? "description" : "description description-em"}>
                    <ShowMoreText
                        lines={5}
                        more='Show more'
                        less='Show less'
                        anchorClass='description-anchor'
                        expanded={false}
                        width={0}
                    >
                        {description ? description : "There is no description for this recipe."}
                    </ShowMoreText>
                </div>
            </>
        )
    }

    const join = (value) => {
        setQuickTag(value)
        if (tagsToAdd.length === 0) {
            setTagsToAdd(value)
        } else {
            let combinedTags = tagsToAdd + "," + value
            setTagsToAdd(combinedTags)
        }
    }

    const renderTab2 = () => {
        return (
            <div className="tags-wrapper">
                <div className="tags-header">
                    <p><strong>Tagged As:</strong></p>
                    {isEditing ? (
                        <form
                            // onSubmit={e => add(e, "tags")}
                        >
                            <div className="inner-form">
                                <textarea
                                    name="tags"
                                    placeholder="Enter ',' delimited tags"
                                    rows="2"
                                    value={tagsToAdd}
                                    onChange={e => setTagsToAdd(e.target.value)}
                                />
                                {/* <div className="dropdown">
                                    <div> */}
                                {/* <select
                                    value={quickTag}
                                    onChange={e => join(e.currentTarget.value)}>
                                    <option value="" disabled={true}>Quick Add Tags</option>
                                    {tagsList.map((tag, i) => (
                                        <option
                                            value={tag}
                                            key={tag + i}
                                        >{tag}</option>
                                    ))}
                                </select> */}
                                {/* </div>
                                </div> */}
                            </div>
                            <button
                                type="submit"
                            >{tagsToAdd.length > 0 ? "Submit" : "Close"}</button>
                        </form>
                    ) : (
                            <p className="add" onClick={() => setIsEditing(true)}>+</p>
                        )}
                </div>
                {tags.length > 0 ?
                    (
                        <ul className="tags">
                            {tags.map((tag, i) => (
                                <li
                                    key={docID + i}
                                >{tag}
                                    <div className="delete-tag" 
                                    // onClick={(e) => remove(e, "tags")}
                                    >
                                        <span>x</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )
                    : (
                        <p><em>This recipe has not been tagged yet</em></p>
                    )
                }
                <div className="notes-wrapper">
                    <div className="notes">
                        {notes.length > 0 ? (
                            <ol>
                                {notes.map(note => (
                                    <li
                                        key={note}
                                    >{note}
                                        <div className="delete-note" 
                                        // onClick={(e) => remove(e, "notes")}
                                        >
                                            <span>x</span>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        ) : (
                                <p><em>There are no notes for this recipe yet.</em></p>
                            )}
                    </div>
                    <div className="add-notes">
                        <form
                            // onSubmit={e => add(e, "notes")}
                        >
                            <textarea
                                name="notes"
                                placeholder="Add additional notes here."
                                rows="3"
                                value={notesToAdd}
                                onChange={e => setNotesToAdd(e.target.value)}
                            />
                            <button type="submit">Add Note</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="card">
            <div className="card-top">
                <img
                    src={imgSrc ? imgSrc : "./graphics/default_image.jpg"}
                    onClick={() => setOpen(o => !o)}
                />
                <Popup trigger={<span className="delete"></span>} modal>
                    {close => (
                        <div className="delete-modal">
                            <button className="close" onClick={close}>X</button>
                            <div className="header">Are You Sure that You Want to Delete this Recipe???</div>
                            <button className="delete" 
                            // onClick={() => deleteEntry(docID)}
                            >Delete this Recipe Entry</button>
                        </div>
                    )}
                </Popup>
            </div>
            <div className="card-bottom">
                <div className="title-wrapper">
                    <h4 onClick={() => setOpen(o => !o)}>{title}</h4>
                    <div className="rating-hasMade">
                        <div className="rating">
                            <StarRatings
                                rating={newRating}
                                starRatedColor="#f04a26"
                                starEmptyColor="#808080"
                                // changeRating={ratingChanged}
                                numberOfStars={5}
                                starDimension="22px"
                                starSpacing="2px"
                                name='rating'
                            />
                        </div>
                        <div className="has-made">
                            <input type="checkbox" className="check" name="check"
                                value={hasMade}
                                onChange={() => console.log("click")}
                                checked={hasMade}
                            />
                            <label
                                htmlFor="check"
                                // onClick={() => updateItem(docID, hasMade)}
                            >Cooked</label>
                        </div>
                    </div>
                    {/* <p>Author: <strong><em>{author.length ? author : "No Assigned Author"}</em></strong></p> */}
                </div>
                <div className="link-wrapper">
                    <div className="link">
                        <a href={url} target="_blank">Recipe Link</a>
                    </div>
                    <span className="timestamp">Saved On: {moment(timestamp).format("MMMM Do YYYY")}</span>
                </div>
            </div>

            <Popup open={open} closeOnDocumentClick onClose={closeModal}>
                <div className="modal recipe-modal">
                    <div className="recipe-modal-central">
                        <div className="recipe-modal-inner">
                            <button className="close" onClick={closeModal}>X</button>
                            <div className="modal-img">
                                <div className="modal-img-back">
                                    <img
                                        src={imgSrc ? imgSrc : "./graphics/default_image.jpg"} />
                                </div>
                            </div>
                            <div className="modal-info">
                                <div className="modal-info-inner">
                                    <div className="modal-info-inner-tabs">
                                        <ul>
                                            <li className={currentTab === 1 ? "active" : ""}
                                                onClick={() => setCurrentTab(1)}>
                                                <h4>INFO</h4>
                                            </li>
                                            <li className={currentTab === 2 ? "active" : ""}
                                                onClick={() => setCurrentTab(2)}>
                                                <h4>TAGS/NOTES</h4>
                                            </li>
                                            <li>
                                                <h4><a href={url} target="_blank">GO TO RECIPE</a></h4>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="modal-info-text">
                                        {currentTab === 1 ? (
                                            [renderTab1()]
                                        ) : (
                                                [renderTab2()]
                                            )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Popup>
        </div>
    );
}

export default Card;