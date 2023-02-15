import React, { useState, useEffect } from "react";
import RecipeCard from "./RecipeCard";
import RecipeEntry from "./RecipeEntry";
import RecipeEdit from "./RecipeEdit";
import { DogIcon } from "./DogIcon";
import moment from "moment";
import "antd/dist/reset.css";
import "../App.css";
import * as api from "../utils/api";
import { v4 as uuidv4 } from "uuid";
import {
  Layout,
  Typography,
  Col,
  Row,
  Drawer,
  Divider,
  Button,
  Rate,
  Tabs,
  Timeline,
  Input,
  Tag,
  Select,
  AutoComplete,
  FloatButton,
  Modal,
  Space,
  Spin,
  Form,
  Popconfirm,
  Radio,
} from "antd";
import {
  PlusOutlined,
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

function RecipeCatalog() {
  const [url, setUrl] = useState("");
  const [crawlingStatus, setCrawlingStatus] = useState(null);
  const [allRecipes, setAllRecipes] = useState(null);
  const [taskID, setTaskID] = useState(null);
  const [uniqueID, setUniqueID] = useState(null);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [focusedRecipe, setFocusedRecipe] = useState(null);
  const [searchOptions, setSearchOptions] = useState({});
  const [sortBy, setSortBy] = useState("-timestamp");
  const [query, setQuery] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [crawledRecipe, setCrawledRecipe] = useState({});
  const [hadError, setHadError] = useState(false);

  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [entryType, setEntryType] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [imageName, setImageName] = useState({});

  const [inputVisible, setInputVisible] = useState(false);

  const { Header, Content } = Layout;
  const { Title, Link } = Typography;
  const [tagForm] = Form.useForm();
  const [noteForm] = Form.useForm();

  let statusInterval = 1;

  useEffect(() => {
    apiStateReferences();
  }, [sortBy]);

  async function apiStateReferences() {
    api.getAll(setAllRecipes, setFilteredRecipes, sortBy);
  }

  async function handleCreate(recipe) {
    api.createRecipe(recipe, apiStateReferences);
  }

  async function handleImageUpload(image) {
    api.uploadImage(image, setImageName);
  }

  async function handleImageDelete(image) {
    if (isUploading) {
      api.deleteImage(image);
    }
    setImageName({});
    setIsUploading(false);
  }

  async function handleDelete(unique_id, route) {
    api.deleteRecipe(unique_id, route, apiStateReferences);
  }

  async function startCrawl() {
    if (!url) {
      return false;
    }
    const response = await fetch("crawl/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ method: "POST", url: url }),
    })
      .then((response) => response.json())
      .then((data) => {
        setTaskID(data.task_id);
        setUniqueID(data.unique_id);
        setCrawlingStatus(data.status);
        statusInterval = setInterval(
          () => checkCrawlStatus(data.task_id, data.unique_id),
          2000
        );
      })
      .catch((error) => console.error("Error:", error));
  }

  async function checkCrawlStatus(task_id, unique_id) {
    const data = JSON.stringify({
      method: "GET",
      task_id: task_id,
      unique_id: unique_id,
    });
    // Making a request to server to ask status of crawling job
    const response = await fetch(
      "crawl/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      },
      data
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.data) {
          clearInterval(statusInterval);
          setCrawlingStatus("finished");
          setCrawledRecipe(data.data);
        } else if (data.error) {
          console.log(data.error);
          clearInterval(statusInterval);
          setCrawlingStatus("finished");
          setHadError(true);
          let newID = uuidv4();
          setCrawledRecipe({
            unique_id: newID,
            url: url,
            title: "",
            author: "",
            description: "",
            has_made: false,
            img_src: "",
            notes: [],
            rating: 0,
            tags: [],
            ingredients: "",
            steps: "",
            timestamp: Date.now(),
          });
        } else if (data.status) {
          setCrawlingStatus(data.status);
        }
      });
  }

  useEffect(() => {
    if (allRecipes !== null) {
      let arr = {
        tags: [],
        allOptions: [],
      };
      allRecipes.forEach((recipe) => {
        let tags = recipe.tags;
        let cleanedTitle = recipe.title.trim();
        tags.forEach((tag) => {
          if (tag.length) {
            let cleanedTag = tag.toLowerCase().trim();
            if (!arr.tags.includes(cleanedTag)) {
              arr.tags.push(cleanedTag);
            }
            if (!arr.allOptions.includes(cleanedTag)) {
              arr.allOptions.push(cleanedTag);
            }
          }
        });
        if (!arr.allOptions.includes(cleanedTitle)) {
          arr.allOptions.push(cleanedTitle);
        }
      });
      let options = arr.tags.map((option) => {
        if (option.length) {
          // const firstLetter = option[0].toUpperCase();
          option = option.split(" ").map(function (word) {
            return word.replace(word[0], word[0].toUpperCase());
          });
          return {
            title: option[0],
            key: option[0],
            value: option[0],
          };
        }
      });
      arr.tags = options;
      arr.allOptions.sort();
      setSearchOptions(arr);
    }
  }, [allRecipes]);

  useEffect(() => {
    if (allRecipes !== null) {
      const searchAllRegex = query && new RegExp(`${query}`, "gi");
      const result = allRecipes.filter(
        (recipe) =>
          !searchAllRegex ||
          searchAllRegex.test(recipe.title) +
            searchAllRegex.test(recipe.author) +
            searchAllRegex.test(recipe.tags)
      );
      setFilteredRecipes(result);
    }
  }, [query, allRecipes]);

  const connect = (type) => {
    if (type === "crawl") {
      startCrawl();
    } else {
      setCrawledRecipe({
        unique_id: uuidv4(),
        url: url,
        title: "",
        author: "",
        description: "",
        has_made: false,
        img_src: "",
        notes: [],
        rating: 0,
        tags: [],
        ingredients: "",
        steps: "",
        timestamp: Date.now(),
      });
    }
  };

  const disconnect = (type) => {
    if (hadError == true) {
      setHadError(false);
    } else if (type === "crawl") {
      handleDelete(uniqueID, "crawledrecipe");
    }
    setCrawledRecipe({});
    setEntryType("");
    setIsSubmitted(false);
  };

  async function handleUpdate(field, unique_id, value, setState) {
    if (value !== null) {
      switch (field) {
        case "has_made":
          api.updateHasMade(unique_id, value, setState);
          break;
        case "rating":
          api.updateRating(unique_id, value, setState);
          break;
        case "notes_add":
          api.addNotes(unique_id, value, setState);
          break;
        case "notes_remove":
          api.removeNotes(unique_id, value, setState);
          break;
        case "tags_add":
          api.addTags(unique_id, value, setState);
          break;
        case "tags_remove":
          api.removeTags(unique_id, value, setState);
          break;
        case "edit_entry":
          api.editEntry(unique_id, value, setState);
          break;
        default:
          break;
      }
    }
  }

  const updateFocusedRecipe = (updatedRecipe) => {
    setFocusedRecipe(updatedRecipe);
    let stateCopy = [...allRecipes];
    let index = stateCopy.findIndex(
      (obj) => obj.unique_id === updatedRecipe.unique_id
    );
    stateCopy[index] = updatedRecipe;
    setAllRecipes(stateCopy);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputConfirm = (newTag) => {
    if (
      newTag.toLowerCase() &&
      focusedRecipe.tags.indexOf(newTag.toLowerCase()) === -1
    ) {
      handleUpdate(
        "tags_add",
        focusedRecipe.unique_id,
        newTag.toLowerCase(),
        updateFocusedRecipe
      );
      setInputVisible(false);
    }
  };

  // Modal Functions
  const showModal = (type) => {
    document.body.style.overflow = "hidden";
    setEntryType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    document.body.style.overflow = "unset";
    setIsModalOpen(false);
    setEntryType("");
  };

  // Drawer Functions
  const showDrawer = () => {
    document.body.style.overflow = "hidden";
    changeTab(1);
    setOpen(true);
  };

  const onClose = () => {
    document.body.style.overflow = "unset";
    if (isUploading) {
      handleImageDelete(imageName.unique_id);
    }
    setOpen(false);
    setIsEditing(false);
  };

  // Tab Functions
  const changeTab = (key) => {
    console.log(key);
  };

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

  return (
    <>
      <Layout id="layout" style={{ minHeight: "100%" }}>
        <Header
          id="header"
          style={{
            backgroundColor: "#fff",
            padding: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <Title
              style={{
                margin: "5px",
              }}
            >
              Dog-Ear
            </Title>
          </div>
          <div className="dog-image">
            <img src="./static/graphics/dog.png" alt="Woof woof" />
          </div>
        </Header>
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            backgroundColor: "#fff",
            padding: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #d32f2f",
          }}
        >
          <div style={{ width: "50%" }}>
            <Select
              labelInValue
              bordered={false}
              defaultValue={{ value: "Newest", label: "Newest" }}
              style={{ maxWidth: "100%" }}
              onChange={(value) => [setSortBy(value.value), setQuery("")]}
              options={[
                {
                  value: "-timestamp",
                  label: "Newest",
                },
                {
                  value: "timestamp",
                  label: "Oldest",
                },
                {
                  value: "-rating",
                  label: "Highest Rated",
                },
                {
                  value: "title",
                  label: "Title A-Z",
                },
                {
                  value: "-title",
                  label: "Title Z-A",
                },
                {
                  value: "-has_made",
                  label: "Has Been Cooked",
                },
                {
                  value: "has_made",
                  label: "Has NOT Been Cooked",
                },
              ]}
            />
          </div>
          <div style={{ width: "50%", textAlign: "right" }}>
            <AutoComplete
              style={{ maxWidth: "100%", width: "200px", textAlign: "left" }}
              onSelect={(value) => setQuery(value)}
              onSearch={(value) => setQuery(value)}
              allowClear
              value={query}
              placeholder="Search Recipes"
              options={
                searchOptions.allOptions
                  ? searchOptions.allOptions.map((option) => {
                      return {
                        value: option,
                        label: option,
                      };
                    })
                  : ""
              }
            />
          </div>
        </Header>
        <Content
          style={{
            margin: "15px",
          }}
        >
          <Row
            justify="space-around"
            xs="auto"
            gutter={[16, 16]}
            key={uuidv4()}
          >
            {filteredRecipes.length ? (
              filteredRecipes.map((recipe, i) => (
                <Col
                  flex
                  xs={{ span: 12, offset: 0 }}
                  md={{ span: 8, offset: 0 }}
                  lg={{ span: 6, offset: 0 }}
                  xl={{ span: 4, offset: 0 }}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                  key={uuidv4()}
                >
                  <RecipeCard
                    recipeInfo={recipe}
                    recipeNumber={i}
                    quickTagOptions={searchOptions.tags}
                    updateRecipe={handleUpdate}
                    setFocusedRecipe={setFocusedRecipe}
                    showDrawer={showDrawer}
                    key={uuidv4()}
                  />
                </Col>
              ))
            ) : (
              <Space
                direction="vertical"
                style={{ width: "100%", marginTop: "50px" }}
              >
                <Spin tip="Loading" size="large">
                  <div className="content" />
                </Spin>
              </Space>
            )}
          </Row>
          <Row>
            {allRecipes ? (
              <p style={{ margin: "25px auto" }}>
                <em>You have saved {allRecipes.length} recipes to date!</em>
              </p>
            ) : null}
          </Row>
          <FloatButton.Group
            icon={<PlusCircleOutlined />}
            style={{ bottom: "85px" }}
            type="primary"
            trigger="click"
          >
            <FloatButton
              icon={<DogIcon />}
              onClick={() => showModal("crawl")}
              tooltip={<div>Scrape a Recipe</div>}
            />
            <FloatButton
              onClick={(e) => [
                setIsSubmitted(true),
                showModal("blank"),
                connect("blank"),
              ]}
              tooltip={<div>Blank Template</div>}
            />
          </FloatButton.Group>
          <FloatButton.BackTop
            style={{ bottom: "25px" }}
            tooltip={<div>Back to Top</div>}
          />
        </Content>
      </Layout>
      {focusedRecipe !== null ? (
        <Drawer
          title={focusedRecipe.title}
          placement="right"
          closable={true}
          onClose={onClose}
          open={open}
          getContainer="#layout"
        >
          {isEditing ? (
            <RecipeEdit
              recipe={focusedRecipe}
              quickTagOptions={searchOptions.tags}
              updateRecipe={handleUpdate}
              updateFocusedRecipe={updateFocusedRecipe}
              setIsEditing={setIsEditing}
              isUploading={isUploading}
              setIsUploading={setIsUploading}
              imageName={imageName}
              setImageName={setImageName}
              handleImageUpload={handleImageUpload}
              handleImageDelete={handleImageDelete}
            />
          ) : (
            <>
              <div className="drawer-div">
                <div className="drawer-div-actions">
                  <Radio.Group style={{ width: "100%", textAlign: "center" }}>
                    <Popconfirm
                      key="delete"
                      icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                      title="Are you sure??"
                      okText="Delete"
                      okType="danger"
                      placement="bottom"
                      onConfirm={() => (
                        handleDelete(focusedRecipe.unique_id, "recipes"),
                        handleImageDelete(
                          focusedRecipe.img_src
                            .split("/")
                            .slice(-1)[0]
                            .split(".")[0]
                        ),
                        onClose()
                      )}
                    >
                      <Radio.Button style={{ width: "50%" }} className="btn">
                        <DeleteOutlined />
                      </Radio.Button>
                    </Popconfirm>
                    <Radio.Button
                      style={{ width: "50%" }}
                      onClick={() => setIsEditing(true)}
                    >
                      <EditOutlined key="edit" />
                    </Radio.Button>
                  </Radio.Group>
                </div>
                <img
                  src={
                    focusedRecipe.img_src
                      ? focusedRecipe.img_src
                      : "./static/graphics/default_image.jpg"
                  }
                />
              </div>
              <div className="drawer-div">
                <Link href={focusedRecipe.url} target="_blank">
                  <Button
                    className="btn-active"
                    type="primary"
                    block
                    style={{ marginTop: "10px" }}
                    danger
                  >
                    Visit Recipe Webpage
                  </Button>
                </Link>
              </div>
              <Divider />
              <Tabs
                defaultActiveKey="1"
                onChange={changeTab}
                items={[
                  {
                    label: `Info`,
                    key: "1",
                    children: (
                      <div className="drawer-div">
                        <p style={{ color: "rgba(0, 0, 0, 0.6)" }}>
                          <strong>Saved On: </strong>
                          {moment(focusedRecipe.timestamp).format(
                            "MMMM Do YYYY"
                          )}
                        </p>
                        <p>
                          <strong>Author: </strong>
                          <em>
                            {focusedRecipe.author
                              ? focusedRecipe.author
                              : "No Assigned Author"}
                          </em>
                        </p>
                        <div>
                          <Button
                            type={
                              focusedRecipe.has_made ? "primary" : "default"
                            }
                            className={
                              focusedRecipe.has_made ? "btn-active" : "btn"
                            }
                            onClick={(e) =>
                              handleUpdate(
                                "has_made",
                                focusedRecipe.unique_id,
                                focusedRecipe.has_made,
                                updateFocusedRecipe
                              )
                            }
                            danger
                            shape="round"
                          >
                            Cooked
                          </Button>
                          <Rate
                            value={focusedRecipe.rating}
                            onChange={(rating) =>
                              handleUpdate(
                                "rating",
                                focusedRecipe.unique_id,
                                rating,
                                updateFocusedRecipe
                              )
                            }
                          />
                        </div>
                        <p>
                          {focusedRecipe.description ? (
                            focusedRecipe.description
                          ) : (
                            <em>There is no description for this</em>
                          )}
                        </p>
                      </div>
                    ),
                  },
                  {
                    label: `Tags/Notes`,
                    key: "2",
                    children: (
                      <>
                        <Divider orientation="left">
                          <strong>
                            <em>Tagged As:</em>
                          </strong>
                        </Divider>
                        {focusedRecipe.tags.length > 0 ? (
                          focusedRecipe.tags.map((tag, index) => {
                            return (
                              <>
                                <Tag
                                  color="#d32f2f"
                                  key={uuidv4()}
                                  className="edit-tag tag-input"
                                >
                                  {titleCase(tag)}
                                </Tag>
                              </>
                            );
                          })
                        ) : (
                          <p>
                            <em>This recipe has not been tagged yet</em>
                          </p>
                        )}
                        {inputVisible && (
                          <Form
                            name="new-tag-form"
                            form={tagForm}
                            id="new-tag-form"
                            onFinish={(value) => (
                              value.newTag
                                ? handleInputConfirm(value.newTag.trim())
                                : null,
                              tagForm.resetFields()
                            )}
                          >
                            <Form.Item name="newTag">
                              <Input
                                type="text"
                                size="small"
                                className="tag-input"
                                placeholder="Add a new tag"
                              />
                            </Form.Item>
                            <Form.Item>
                              <Button
                                className="btn-active"
                                htmlType="submit"
                                type="primary"
                              >
                                Add
                              </Button>
                            </Form.Item>
                          </Form>
                        )}
                        {!inputVisible && (
                          <div id="new-tag-div">
                            <Tag
                              className="site-tag-plus"
                              style={{ border: "1px dashed #d32f2f" }}
                              onClick={showInput}
                            >
                              <PlusOutlined /> New Tag
                            </Tag>
                          </div>
                        )}
                        <Divider orientation="left">
                          <strong>
                            <em>Notes:</em>
                          </strong>
                        </Divider>
                        <Form
                          name="new-notes-form"
                          form={noteForm}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "20px",
                          }}
                          autoComplete="off"
                          onFinish={(value) => (
                            handleUpdate(
                              "notes_add",
                              focusedRecipe.unique_id,
                              value.newNote.trim(),
                              updateFocusedRecipe
                            ),
                            noteForm.resetFields()
                          )}
                        >
                          <Form.Item name="newNote" style={{ width: "100%" }}>
                            <Input.TextArea
                              id="new-note-textarea"
                              placeholder="Add a new note"
                              allowClear
                              autoSize
                            />
                          </Form.Item>
                          <Form.Item>
                            <Button
                              id="new-note-button"
                              className="btn-active"
                              htmlType="submit"
                              type="primary"
                              style={{ height: "100%" }}
                            >
                              Add
                            </Button>
                          </Form.Item>
                        </Form>
                        <Timeline>
                          {focusedRecipe.notes.length > 0 ? (
                            focusedRecipe.notes.map((note) => {
                              return (
                                <Timeline.Item color="#d32f2f" key={uuidv4()}>
                                  {note}
                                </Timeline.Item>
                              );
                            })
                          ) : (
                            <Timeline.Item color="#d32f2f">
                              <em>This recipe has no notes yet</em>
                            </Timeline.Item>
                          )}
                        </Timeline>
                      </>
                    ),
                  },
                  {
                    label: `Recipe`,
                    key: "3",
                    children: (
                      <>
                        <Divider orientation="left">
                          <strong>
                            <em>Ingredients:</em>
                          </strong>
                        </Divider>
                        <Timeline>
                          {focusedRecipe.ingredients.length > 0 ? (
                            focusedRecipe.ingredients
                              .split("\n")
                              .map((ingredient) => {
                                return (
                                  <Timeline.Item color="#d32f2f" key={uuidv4()}>
                                    {ingredient}
                                  </Timeline.Item>
                                );
                              })
                          ) : (
                            <Timeline.Item color="#d32f2f">
                              <em>
                                This recipe has no ingredients assigned to it
                              </em>
                            </Timeline.Item>
                          )}
                        </Timeline>
                        <Divider orientation="left">
                          <strong>
                            <em>Steps:</em>
                          </strong>
                        </Divider>
                        <Timeline>
                          {focusedRecipe.steps.length > 0 ? (
                            focusedRecipe.steps.split("\n").map((step) => {
                              return (
                                <Timeline.Item color="#d32f2f" key={uuidv4()}>
                                  {step}
                                </Timeline.Item>
                              );
                            })
                          ) : (
                            <Timeline.Item color="#d32f2f">
                              <em>This recipe has no steps assigned to it</em>
                            </Timeline.Item>
                          )}
                        </Timeline>
                      </>
                    ),
                  },
                ]}
              />
            </>
          )}
        </Drawer>
      ) : null}
      <Modal
        title={
          entryType === "crawl"
            ? Object.keys(crawledRecipe).length
              ? "Scraped Recipe Information"
              : "Retrieving Recipe"
            : "Blank Recipe Template"
        }
        closable={
          entryType === "blank" ||
          Object.keys(crawledRecipe).length ||
          !isSubmitted
            ? true
            : false
        }
        footer={null}
        style={{ top: 20 }}
        open={isModalOpen}
        onCancel={() => [
          closeModal(),
          disconnect(entryType),
          handleImageDelete(imageName.unique_id),
          setUrl(""),
        ]}
      >
        {(url || entryType === "blank") && isSubmitted ? (
          <div>
            {Object.keys(crawledRecipe).length ? (
              <div>
                {hadError ? (
                  <p>
                    <em>
                      The Recipe could not be scraped. Please input the recipe
                      information manually:
                    </em>
                  </p>
                ) : (
                  <></>
                )}
                <RecipeEntry
                  recipe={crawledRecipe}
                  key={crawledRecipe.unique_id}
                  unique_id={crawledRecipe.unique_id}
                  url={url}
                  setRecipe={setCrawledRecipe}
                  setIsSubmitted={setIsSubmitted}
                  handleCreate={handleCreate}
                  handleImageUpload={handleImageUpload}
                  handleImageDelete={handleImageDelete}
                  handleDelete={handleDelete}
                  setUrl={setUrl}
                  quickTagOptions={searchOptions.tags}
                  type={entryType}
                  setType={setEntryType}
                  closeModal={closeModal}
                  isUploading={isUploading}
                  setIsUploading={setIsUploading}
                  imageName={imageName}
                  setImageName={setImageName}
                />
              </div>
            ) : (
              <>
                <div className="dog-loader">
                  <div className="dog-head">
                    <img src="./static/graphics/dog-head.png" />
                  </div>
                  <div className="dog-body"></div>
                </div>
                <p className="dog-loader-p">
                  <em>Fetching deliciousness...</em>
                </p>
              </>
            )}
          </div>
        ) : (
          <div>
            <Form
              name="urlForm"
              style={{
                width: "100%",
              }}
              labelCol={{ flex: "100px" }}
              labelAlign="left"
              labelWrap
              wrapperCol={{ flex: 1 }}
              colon={false}
              autoComplete="off"
              onFinish={(e) => [
                e.preventDefault,
                setEntryType("crawl"),
                setIsSubmitted(true),
                connect("crawl"),
              ]}
            >
              <Form.Item name="url" label="URL" rules={[{ required: true }]}>
                <Input
                  placeholder="Paste Recipe URL Here"
                  allowClear
                  value={setEntryType !== "blank" ? url : null}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </Form.Item>
              <Form.Item name="scrapeSubmit">
                <Button
                  type="primary"
                  htmlType="submit"
                  className={url.length ? "btn-active" : "btn"}
                  disabled={url.length ? false : true}
                  danger
                  block
                >
                  Get Recipe
                </Button>
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </>
  );
}

export default RecipeCatalog;
