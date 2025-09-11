
import React from "react";
import { Formik, Form, Field } from "formik";
import { Input, Button, Typography, Card } from "antd";
import * as Yup from "yup";
import { createPost } from "../lib/api";
import { useNavigate } from "react-router";

const { Title } = Typography;
const { TextArea } = Input;

const PostSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  content: Yup.string().min(10, "Too short!").required("Content is required"),
});

export default function AddPost() {
  const nav = useNavigate();

  return (
    <Card>
      <Title level={3}>Add New Blog Post</Title>
      <Formik
        initialValues={{ title: "", content: "" }}
        validationSchema={PostSchema}
        onSubmit={async (values, { resetForm }) => {
          try {
            await createPost(values);
            resetForm();
          } catch (err) {
            alert("Error: " + err.message);
          }
        }}
      >
        {({ errors, touched, handleChange }) => (
          <Form className="space-y-4">
            <div>
              <Field
                as={Input}
                name="title"
                placeholder="Post Title"
                onChange={handleChange}
              />
              {errors.title && touched.title && (
                <div className="text-red-500">{errors.title}</div>
              )}
            </div>
            <div>
              <Field
                as={TextArea}
                name="content"
                placeholder="Content"
                rows={5}
                onChange={handleChange}
              />
              {errors.content && touched.content && (
                <div className="text-red-500">{errors.content}</div>
              )}
            </div>
            <Button type="primary" htmlType="submit" block>
              Create Post
            </Button>
          </Form>
        )}
      </Formik>
    </Card>
  );
}
