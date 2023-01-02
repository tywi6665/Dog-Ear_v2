import React, { useState, useEffect } from "react";
import RecipeCatalog from "./Components/RecipeCatalog";
import { Layout, Button, Form, Input, Typography } from "antd";

function App() {
  const [credentials, setCredentials] = useState({});
  const [loginForm] = Form.useForm();
  const { Content } = Layout;
  const { Title } = Typography;

  const onFinish = (values) => {
    if (
      values.username === "js.woodward@gmail.com" &&
      values.password === "read2day"
    ) {
      setCredentials(values);
    } else {
      onFinishFailed();
      loginForm.resetFields();
    }
  };

  const onFinishFailed = (errorInfo) => {
    setCredentials({});
  };

  return (
    <>
      {Object.keys(credentials).length ? (
        <RecipeCatalog />
      ) : (
        <Layout id="layout" style={{ minHeight: "100%" }}>
          <Content
            style={{
              display: "flex",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Form
              name="basic"
              form={loginForm}
              style={{
                background: "#fff",
                padding: "15px",
                border: "1px solid rgba(5, 5, 5, 0.06)",
                borderRadius: "8px",
              }}
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={(values) => onFinish(values)}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <div id="log-in-title">
                <Title
                  style={{
                    margin: "5px",
                  }}
                >
                  Dog-Ear
                </Title>
                <div className="dog-image">
                  <img src="./static/graphics/dog.png" alt="Woof woof" />
                </div>
              </div>
              <Form.Item
                label="Username"
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Please input your username!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
              >
                <Button type="primary" htmlType="submit" className="btn-active">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Content>
        </Layout>
      )}
    </>
  );
}

export default App;
