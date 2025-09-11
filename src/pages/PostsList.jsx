import React, { useEffect, useState } from "react";
import { getPosts, addComment } from "../lib/api";
import { Table, Input, Button, Space, Modal, Form, message } from "antd";

export default function PostsList() {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [form] = Form.useForm();

  const load = async (page = 1) => {
    setLoading(true);
    const query = { page, q, author };
    const res = await getPosts(query);
    setPosts(res.record);
    setTotal(res.pagination.total);
    setPagination({ ...pagination, current: page });
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [q, author, pagination.pageSize]);

  const handleAddComment = async () => {
    try {
      const values = await form.validateFields();
      console.log(values,selectedPost)
      await addComment({postId:selectedPost._id, text:values.text});
      message.success("Comment added successfully");
      setIsModalOpen(false);
      form.resetFields();
      load(pagination.current); // refresh posts
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to add comment");
    }
  };

  const columns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Author", dataIndex: "author", key: "author" },
    { title: "Comments", dataIndex: "commentCount", key: "commentCount" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => {
            setSelectedPost(record);
            setIsModalOpen(true);
          }}
        >
          Add Comment
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Space className="mb-4">
        <Input
          placeholder="Search posts"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Input
          placeholder="Filter by author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </Space>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={posts}
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total,
          onChange: (page) => load(page),
        }}
      />

      <Modal
        title={`Add Comment to "${selectedPost?.title}"`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleAddComment}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="text"
            label="Comment"
            rules={[{ required: true, message: "Please enter a comment" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
