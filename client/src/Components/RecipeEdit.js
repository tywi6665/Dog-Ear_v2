import React, { useEffect, useState } from "react";
import {
  Space,
  Button,
  Checkbox,
  Form,
  Input,
  TreeSelect,
  Rate,
  Tooltip,
  // Upload,
} from "antd";
// import { UploadOutlined } from "@ant-design/icons";
// import { v4 as uuidv4 } from "uuid";

const titleCase = (str) => {
  if (str) {
    return str
      .toLowerCase()
      .split(" ")
      .map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  } else {
    return "";
  }
};

const titleCaseArr = (arr) => {
  return arr.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
};

const RecipeEdit = ({
  recipe,
  updateFocusedRecipe,
  quickTagOptions,
  setIsEditing,
  updateRecipe,
  // handleImageUpload,
  // handleImageDelete,
  isUploading,
  // setIsUploading,
  // imageName,
  // setImageName,
}) => {
  const [url, setUrl] = useState(recipe.url);
  const [title, setTitle] = useState(titleCase(recipe.title));
  const [imgSrc, setImgSrc] = useState(recipe.img_src);
  // const [oldImgSrc, setOldImgSrc] = useState("");
  const [description, setDescription] = useState(recipe.description);
  const [author, setAuthor] = useState(recipe.author);
  const [allTags, setAllTags] = useState(titleCaseArr(recipe.tags));
  const [allNotes, setAllNotes] = useState(recipe.notes);
  const [hasMade, setHasMade] = useState(recipe.has_made);
  const [rating, setRating] = useState(recipe.rating);
  const [ingredients, setIngredients] = useState(recipe.ingredients);
  const [steps, setSteps] = useState(recipe.steps);

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      url: url,
      imgSrc: imgSrc,
      title: title,
      author: author,
      description: description,
      tags: allTags,
      notes: allNotes,
      hasMade: hasMade,
      rating: rating,
      ingredients: ingredients,
      steps: steps,
    });
  }, []);

  // useEffect(() => {
  //   if (Object.keys(imageName).length) {
  //     setImgSrc(imageName.image);
  //     form.setFieldsValue({
  //       imgSrc: imgSrc,
  //     });
  //   }
  // }, [imageName]);

  const { TextArea } = Input;

  const editEntry = () => {
    // if (oldImgSrc.length) {
    //   deleteImage(oldImgSrc.split("/").slice(-1)[0].split(".")[0]);
    // }

    let notes = [...allNotes];

    if (notes.length > 0) {
      notes = notes.map((note) => {
        return note.trim();
      });
    } else {
      notes = [];
    }

    const updatedRecipe = {
      url: url,
      title: title,
      author: author,
      img_src: imgSrc,
      description: description,
      has_made: hasMade,
      rating: rating,
      notes: notes,
      tags: allTags,
      ingredients: ingredients,
      steps: steps,
    };

    updateRecipe(
      "edit_entry",
      recipe.unique_id,
      updatedRecipe,
      updateFocusedRecipe
    );

    // setIsUploading("");
    // setOldImgSrc("");
    // setImageName("");
    setIsEditing(false);
  };

  // const deleteImage = (img) => {
  //   handleImageDelete(img);
  //   setImgSrc("");
  //   setIsUploading(false);
  // };

  // const uploadProps = {
  //   name: "file",
  //   accept: "image/*",
  //   customRequest(image) {
  //     let form_data = new FormData();
  //     form_data.append("image", image.file, image.file.name);
  //     form_data.append("unique_id", uuidv4());
  //     handleImageUpload(form_data);
  //     setIsUploading(true);
  //   },
  //   onRemove() {
  //     deleteImage(imageName.unique_id);
  //   },
  // };

  return (
    <Space
      id="recipe-edit"
      direction="vertical"
      size="small"
      style={{ display: "flex", width: "100%" }}
    >
      <Button
        className="btn-active"
        type="primary"
        block
        style={{ marginBottom: "10px" }}
        danger
        onClick={() => setIsEditing(false)}
      >
        Cancel
      </Button>
      {imgSrc ? (
        <img src={imgSrc} style={{ maxWidth: "225px", maxHeight: "225px" }} />
      ) : (
        <img src={"./static/graphics/default_image.jpg"} />
      )}
      <Form
        name="form"
        form={form}
        style={{
          width: "100%",
        }}
        labelCol={{ flex: "100px" }}
        labelAlign="left"
        labelWrap
        wrapperCol={{ flex: 1 }}
        colon={false}
        autoComplete="off"
      >
        <Form.Item
          label="Recipe URL"
          name="url"
          rules={[
            { required: true, message: "Please input the recipe's url!" },
          ]}
        >
          <Input value={url} onChange={(e) => setUrl(e.target.value)} />
        </Form.Item>

        <Form.Item
          // disabled={isUploading}
          label="Recipe Image"
          style={{ marginBottom: "15px" }}
        >
          <Input
            value={imgSrc}
            onChange={(e) => setImgSrc(e.target.value)}
            placeholder='Right click on image, and click "copy image address". Paste address here.'
          />
          {/* {imgSrc.substring(0, 13) === "media/images/" && !isUploading ? (
            <Button
              className="btn-active"
              htmlType="button"
              type="primary"
              style={{ marginTop: "5px" }}
              danger
              onClick={() => [setOldImgSrc(imgSrc), setImgSrc("")]}
            >
              Choose Other Image
            </Button>
          ) : (
            <>
              <p>or</p>
              <Upload {...uploadProps}>
                <Button htmlType="button" icon={<UploadOutlined />}>
                  Click to Upload
                </Button>
              </Upload>
              {oldImgSrc.length ? (
                <Button
                  className="btn-active"
                  type="primary"
                  htmlType="button"
                  style={{ marginTop: "5px" }}
                  danger
                  onClick={() => [setImgSrc(oldImgSrc), setOldImgSrc("")]}
                >
                  Revert to Original Image
                </Button>
              ) : null}
            </>
          )} */}
        </Form.Item>

        <div style={{ display: "flex", alignItems: "baseline" }}>
          <Form.Item name="hasMade" wrapperCol={{ span: 24 }}>
            <Checkbox
              style={{ marginRight: "15px" }}
              checked={hasMade}
              onClick={() => setHasMade(!hasMade)}
            >
              Has Made?
            </Checkbox>
          </Form.Item>

          <Form.Item name="rating" wrapperCol={{ span: 24 }}>
            <Rate value={rating} onChange={(rating) => setRating(rating)} />
          </Form.Item>
        </div>

        <Form.Item
          label="Recipe Title"
          name="title"
          rules={[
            { required: true, message: "Please input the recipe's title!" },
          ]}
        >
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </Form.Item>

        <Form.Item label="Recipe Author" name="author">
          <Input value={author} onChange={(e) => setAuthor(e.target.value)} />
        </Form.Item>

        <Form.Item label="Recipe Description" name="description">
          <TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            autoSize={{ minRows: 1, maxRows: 4 }}
            allowClear
          />
        </Form.Item>

        <Form.Item label="Recipe Tags" name="tags" wrapperCol={{ span: 12 }}>
          <TreeSelect
            treeData={quickTagOptions.sort(
              (a, b) => -b.title.localeCompare(a.title)
            )}
            onChange={(tags) => {
              setAllTags(tags);
            }}
            treeCheckable
            placeholder="Please select"
          />
        </Form.Item>

        <Form.Item label="Recipe Notes" name="notes">
          <Tooltip
            trigger={["focus"]}
            title="Delimit separate notes with ; "
            placement="top"
          >
            <TextArea
              value={allNotes.join(";")}
              onChange={(e) => setAllNotes(e.target.value.split(";"))}
              autoSize
            />
          </Tooltip>
        </Form.Item>

        <Form.Item label="Recipe Ingredients" name="ingredients">
          <Tooltip
            trigger={["focus"]}
            title="Each ingredient needs to be on a new line"
            placement="top"
          >
            <TextArea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </Tooltip>
        </Form.Item>

        <Form.Item label="Recipe Steps" name="steps">
          <Tooltip
            trigger={["focus"]}
            // title="Each paragraph needs to have an empty line separating them"
            placement="top"
          >
            <TextArea
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </Tooltip>
        </Form.Item>

        <Form.Item wrapperCol={{ span: 24 }}>
          <Button
            type="primary"
            htmlType="submit"
            className={title.length && url.length ? "btn-active" : "btn"}
            disabled={title.length && url.length ? false : true}
            onClick={editEntry}
            danger
            block
          >
            Update Recipe
          </Button>
        </Form.Item>
      </Form>
    </Space>
  );
};

export default RecipeEdit;
