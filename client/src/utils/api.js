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

export async function deleteRecipe(unique_id, stateFunction1, stateFunction2) {
  axios
    .delete(`api/recipes/${unique_id}`)
    .then((res) => getAll(stateFunction1, stateFunction2));
}

export async function updateHasMade(
  unique_id,
  boolean,
  stateFunction1,
  stateFunction2
) {
  //   console.log(unique_id, boolean);
  axios
    .put(`api/recipes/${unique_id}/`, { has_made: !boolean })
    .then((res) => getAll(stateFunction1, stateFunction2));
}
