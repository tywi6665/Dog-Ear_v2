import axios from "axios";

export async function getAll(stateFunction1, stateFunction2) {
  axios
    .get("api/recipes")
    .then((res) => {
      stateFunction1(res.data);
      stateFunction2(res.data);
    })
    .catch((err) => console.log(err));
}

export async function deleteRecipe(unique_id, callback) {
  axios.delete(`api/recipes/${unique_id}`).then((res) => callback());
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

export async function removeNotes(unique_id, notes, callback) {
  axios
    .put(`api/recipes/${unique_id}/`, { field: "notes_remove", notes: notes })
    .then((res) => callback());
}
