import React, { useState, useEffect } from "react";
import {
  Space,
  Button,
  Checkbox,
  Form,
  Input,
  TreeSelect,
  Rate,
  Tooltip,
  Switch,
  // message,
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

const RecipeEntry = ({
  recipe,
  unique_id,
  url,
  setRecipe,
  closeModal,
  setUrl,
  handleCreate,
  // handleImageUpload,
  // handleImageDelete,
  handleDelete,
  quickTagOptions,
  type,
  setType,
  setIsSubmitted,
  // isUploading,
  // setIsUploading,
  // imageName,
  // setImageName,
}) => {
  const [recipeUrl, setRecipeUrl] = useState(url);
  const [title, setTitle] = useState(titleCase(recipe.title));
  const [imgSrc, setImgSrc] = useState(recipe.img_src);
  const [description, setDescription] = useState(recipe.description);
  const [author, setAuthor] = useState(recipe.author);
  const [tags, setTags] = useState(titleCaseArr(recipe.tags));
  const [allNotes, setAllNotes] = useState(recipe.notes);
  const [ingredients, setIngredients] = useState(recipe.ingredients);
  const [steps, setSteps] = useState(recipe.steps);
  const [hasMade, setHasMade] = useState(false);
  const [rating, setRating] = useState(0);
  const [urlNotNeeded, setUrlNotNeeded] = useState(false);

  const [form] = Form.useForm();
  const { TextArea } = Input;

  useEffect(() => {
    if (type === "crawl") {
      form.setFieldsValue({
        url: recipeUrl,
        imgSrc: imgSrc,
        title: title,
        author: author,
        description: description,
        tags: tags,
        notes: allNotes,
        has_made: hasMade,
        rating: rating,
        ingredients: ingredients,
        steps: steps,
      });
    }
  }, []);

  // useEffect(() => {
  //   if (Object.keys(imageName).length) {
  //     setImgSrc(imageName.image);
  //     form.setFieldsValue({
  //       imgSrc: imgSrc,
  //     });
  //   }
  // }, [imageName]);

  const createEntry = () => {
    let notes = [...allNotes];

    if (notes.length > 0) {
      notes = notes.map((note) => {
        return note.trim();
      });
    } else {
      notes = [];
    }

    handleCreate({
      unique_id: unique_id,
      title: title,
      url: recipeUrl,
      author: author,
      img_src: imgSrc,
      description: description,
      has_made: hasMade,
      notes: notes,
      rating: rating,
      tags: tags,
      ingredients: ingredients,
      steps: steps,
    });
    setRecipe({});
    closeModal();
    if (type === "crawl") {
      handleDelete(recipe.unique_id, "crawledrecipe");
    }
    setUrl("");
    setIsSubmitted(false);
    setType("");
    // setIsUploading("");
    // setImageName({});
  };

  // const uploadProps = {
  //   name: "file",
  //   accept: "image/*",
  //   customRequest(image) {
  //     let form_data = new FormData();
  //     form_data.append("image", image.file, image.file.name);
  //     form_data.append("unique_id", uuidv4());
  //     console.log(form_data, image.file, image.file.name);
  //     handleImageUpload(form_data);
  //     setIsUploading(true);
  //   },
  //   onRemove() {
  //     const image_id = imageName.unique_id;
  //     handleImageDelete(image_id);
  //     setImgSrc("");
  //     setIsUploading(false);
  //   },
  // };

  return (
    <Space
      id="recipe-entry"
      direction="vertical"
      size="small"
      style={{ display: "flex", width: "100%" }}
    >
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
          <div>
            <Input
              value={recipeUrl}
              onChange={(e) => setRecipeUrl(e.target.value)}
              disabled={type === "blank" ? (urlNotNeeded ? true : false) : true}
            />
            {type === "blank" ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "10px",
                }}
              >
                <label htmlFor="switch" style={{ marginRight: "5px" }}>
                  Is recipe from a book?
                </label>
                <Switch
                  name="switch"
                  onChange={() => [
                    setUrlNotNeeded(!urlNotNeeded),
                    setRecipeUrl("#"),
                  ]}
                />
              </div>
            ) : null}
          </div>
        </Form.Item>

        <Form.Item label="Recipe Image">
          <Input
            // disabled={isUploading}
            value={imgSrc}
            onChange={(e) => setImgSrc(e.target.value)}
            placeholder='Right click on image, and click "copy image address". Paste address here.'
          />
          {/* {type === "blank" ? (
            <>
              <p>or</p>
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </>
          ) : null} */}
        </Form.Item>

        <Form.Item valuePropName="has_made" wrapperCol={{ span: 24 }}>
          <Checkbox
            style={{ marginRight: "15px" }}
            checked={hasMade}
            onClick={() => setHasMade(!hasMade)}
          >
            Has Made?
          </Checkbox>
          <Rate value={rating} onChange={(rating) => setRating(rating)} />
        </Form.Item>

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
          />
        </Form.Item>

        <Form.Item label="Recipe Tags" name="tags">
          <TreeSelect
            treeData={quickTagOptions.sort(
              (a, b) => -b.title.localeCompare(a.title)
            )}
            onChange={(tags) => {
              setTags(tags);
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
              autoSize={{ minRows: 3 }}
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
              autoSize={{ minRows: 3 }}
            />
          </Tooltip>
        </Form.Item>

        <Form.Item wrapperCol={{ span: 24 }}>
          <Button
            type="primary"
            htmlType="submit"
            className={title.length && recipeUrl.length ? "btn-active" : "btn"}
            disabled={title.length ? false : true}
            onClick={createEntry}
            danger
            block
          >
            Create Entry
          </Button>
        </Form.Item>
      </Form>
    </Space>
  );
};

export default RecipeEntry;
