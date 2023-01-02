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
} from "antd";

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
}) => {
  const [url, setUrl] = useState(recipe.url);
  const [title, setTitle] = useState(titleCase(recipe.title));
  const [imgSrc, setImgSrc] = useState(recipe.img_src);
  const [description, setDescription] = useState(recipe.description);
  const [author, setAuthor] = useState(recipe.author);
  const [allTags, setAllTags] = useState(titleCaseArr(recipe.tags));
  const [allNotes, setAllNotes] = useState(recipe.notes);
  const [hasMade, setHasMade] = useState(recipe.has_made);
  const [rating, setRating] = useState(recipe.rating);

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
    });
  }, []);

  const { TextArea } = Input;

  const editEntry = () => {
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
    };

    updateRecipe(
      "edit_entry",
      recipe.unique_id,
      updatedRecipe,
      updateFocusedRecipe
    );
    setIsEditing(false);
  };

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
          label="Recipe Image"
          name="imgSrc"
          style={{ marginBottom: "15px" }}
        >
          <Input
            value={imgSrc}
            onChange={(e) => setImgSrc(e.target.value)}
            placeholder='Right click on image, and click "copy image address". Paste address here.'
          />
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
