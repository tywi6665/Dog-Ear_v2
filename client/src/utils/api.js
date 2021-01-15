import axios from "axios";

export async function getAll(stateFunction1, stateFunction2, filter) {
  let url = "";
  if (filter == "-timestamp" || filter == "timestamp") {
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

export async function createRecipe(recipe, callback) {
  axios
    .post("api/recipes/", {
      data: recipe,
    })
    .then((res) => callback());
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
    .then((res) => callback());
}

export async function updateRating(unique_id, rating, callback) {
  axios
    .put(`api/recipes/${unique_id}/`, { field: "rating", rating: rating })
    .then((res) => callback());
}

export async function addNotes(unique_id, notes, callback) {
  axios
    .put(`api/recipes/${unique_id}/`, { field: "notes_add", notes: notes })
    .then((res) => callback());
}

export async function removeNotes(unique_id, note, callback) {
  axios
    .put(`api/recipes/${unique_id}/`, { field: "notes_remove", note: note })
    .then((res) => callback());
}

export async function addTags(unique_id, tags, callback) {
  axios
    .put(`api/recipes/${unique_id}/`, { field: "tags_add", tags: tags })
    .then((res) => callback());
}

export async function removeTags(unique_id, tag, callback) {
  axios
    .put(`api/recipes/${unique_id}/`, { field: "tags_remove", tag: tag })
    .then((res) => callback());
}
