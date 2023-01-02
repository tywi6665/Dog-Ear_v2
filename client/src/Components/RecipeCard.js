import React, { useState, useEffect } from "react";
import { Card, Badge } from "antd";

const { Meta } = Card;

const RecipeCard = ({
  recipeInfo,
  updateRecipe,
  setFocusedRecipe,
  showDrawer,
}) => {
  const [recipe, setRecipe] = useState(recipeInfo);
  const [tagsToAdd, setTagsToAdd] = useState("");
  const [notesToAdd, setNotesToAdd] = useState("");

  useEffect(() => {
    setRecipe(recipeInfo);
  }, [recipeInfo]);

  return (
    <>
      {recipe.has_made ? (
        <Badge.Ribbon text="Cooked" color="#d32f2f">
          <Card
            style={{ maxWidth: "300px", width: "100%" }}
            hoverable
            onClick={() => {
              setFocusedRecipe(recipe);
              showDrawer();
            }}
            size="small"
            cover={
              <img
                src={
                  recipe.img_src
                    ? recipe.img_src
                    : "./static/graphics/default_image.jpg"
                }
              />
            }
          >
            <Meta description={recipe.title} />
          </Card>
        </Badge.Ribbon>
      ) : (
        <Card
          style={{ maxWidth: "300px", width: "100%" }}
          hoverable
          onClick={() => {
            setFocusedRecipe(recipe);
            showDrawer();
          }}
          size="small"
          cover={
            <img
              src={
                recipe.img_src
                  ? recipe.img_src
                  : "./static/graphics/default_image.jpg"
              }
            />
          }
        >
          <Meta description={recipe.title} />
        </Card>
      )}
    </>
  );
};
export default RecipeCard;
