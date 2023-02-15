import axios from "axios";

export async function getAll(stateFunction1, stateFunction2, filter) {
  let url = "";
  if (filter === "-timestamp" || filter === "timestamp") {
    url = `api/recipes/?ordering=${filter}`;
  } else {
    url = `api/recipes/?ordering=${filter},-timestamp`;
  }
  axios
    .get(url)
    .then((res) => {
      stateFunction1(res.data);
      stateFunction2(res.data);
    })
    .catch((err) => console.log(err));
}

async function getOne(unique_id, setState) {
  axios
    .get(`api/recipes/${unique_id}`)
    .then((res) => setState(res.data))
    .catch((err) => console.log(err));
}

export async function createRecipe(recipe, callback) {
  axios
    .post("api/recipes/", {
      data: recipe,
    })
    .then((res) => callback());
}

export async function uploadImage(image, callback) {
  axios
    .post("api/images/", image, {
      headers: {
        "content-type": "multipart/form-data",
      },
    })
    .then((res) => {
      console.log(res);
      let index = res.data.image.split("/").indexOf("media");
      console.log(index);
      res.data.image = res.data.image.split("/").slice(index).join("/");
      console.log(res.data);
      callback(res.data);
    });
}

export async function deleteImage(image_id) {
  axios.delete(`api/images/${image_id}`).then((res) => console.log("deleted"));
}

export async function deleteRecipe(unique_id, route, callback) {
  axios.delete(`api/${route}/${unique_id}`).then((res) => callback());
}

export async function updateHasMade(unique_id, prevState, callback) {
  axios
    .put(`api/recipes/${unique_id}/`, {
      field: "has_made",
      has_made: !prevState,
    })
    // .then((res) => callback());
    .then((res) => getOne(unique_id, callback));
}

export async function updateRating(unique_id, rating, callback) {
  axios
    .put(`api/recipes/${unique_id}/`, { field: "rating", rating: rating })
    // .then((res) => callback());
    .then((res) => getOne(unique_id, callback));
}

export async function addNotes(unique_id, notes, callback) {
  axios
    .put(`api/recipes/${unique_id}/`, { field: "notes_add", notes: notes })
    // .then((res) => callback());
    .then((res) => getOne(unique_id, callback));
}

export async function removeNotes(unique_id, note, callback) {
  axios
    .put(`api/recipes/${unique_id}/`, { field: "notes_remove", note: note })
    // .then((res) => callback());
    .then((res) => getOne(unique_id, callback));
}

export async function addTags(unique_id, tags, callback) {
  axios
    .put(`api/recipes/${unique_id}/`, { field: "tags_add", tags: tags })
    // .then((res) => callback());
    .then((res) => getOne(unique_id, callback));
}

export async function removeTags(unique_id, tag, callback) {
  axios
    .put(`api/recipes/${unique_id}/`, { field: "tags_remove", tag: tag })
    // .then((res) => callback());
    .then((res) => getOne(unique_id, callback));
}

export async function editEntry(unique_id, newInfo, callback) {
  axios
    .put(`api/recipes/${unique_id}/`, {
      field: "edit_entry",
      editedEntry: newInfo,
    })
    // .then((res) => callback());
    .then((res) => getOne(unique_id, callback));
}
