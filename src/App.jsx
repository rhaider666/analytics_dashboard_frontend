
import React, { useEffect, useState } from "react";
import {
  Layout,
  Select,
  Spin,
  message,
  Button,
  Modal,
  Form,
  Input,
  Menu,
} from "antd";
import {
  getUsers,
  selectUser,
  addUser,
} from "./lib/api";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router";
import Posts from "./pages/PostsList";
import AddPost from "./pages/AddPost";
import Analytics from "./pages/Analytics";

const { Header, Content, Sider } = Layout;
const { Option } = Select;

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const res = await getUsers();
      setUsers(res.record);

      let single=res.record ? res.record[0]:null
     
      const res2 = await selectUser({id:single?._id});
     
      setSelectedUser(res2.record.user);
      localStorage.setItem("token", res2.record.token);
      localStorage.setItem("user", JSON.stringify(res2.record.user));
      message.success(`Logged in as ${res2.record.user.username}`);
      
    } catch (err) {
      message.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  async function handleSelect(userId) {
    try {
      const res = await selectUser({id:userId});
      setSelectedUser(res.record.user);
      localStorage.setItem("token", res.record.token);
      localStorage.setItem("user", JSON.stringify(res.record.user));
      message.success(`Logged in as ${res.record.user.username}`);
    } catch (err) {
      message.error("Failed to select user");
    }
  }

  async function handleAddUser(values) {
    console.log(values)
    try {
      const newUser = await addUser(values);
      message.success("User added successfully");
      setModalOpen(false);
      form.resetFields();
      await loadUsers();
    } catch (err) {
      message.error("Failed to add user");
    }
  }

  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        
        <Header
          style={{
            background: "#fff",
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
           <p className="bg-white shadow-sm px-6 text-lg font-semibold">
            Blog Analytics Dashboard
          </p>
          <div className=" flex flex-row flex-wrap gap-2">
          {loading ? (
            <Spin />
          ) : (
            <Select
              placeholder="Select User"
              style={{ width: 200 }}
              onChange={handleSelect}
              value={selectedUser?._id}
            >
              {users.map((user) => (
                <Option key={user._id} value={user._id}>
                  {user.username}
                </Option>
              ))}
            </Select>
          )}

          <Button type="primary" onClick={() => setModalOpen(true)}>
            + Add User
          </Button>
           </div>
        </Header>

        <Layout>
          
          <Sider width={200} style={{ background: "#fff" }}>
            <Menu mode="inline" defaultSelectedKeys={["posts"]}>
              <Menu.Item key="posts">
                <Link to="/">Posts</Link>
              </Menu.Item>
              <Menu.Item key="add-post">
                <Link to="/add-post">Add Post</Link>
              </Menu.Item>
              <Menu.Item key="analytics">
                <Link to="/analytics">Analytics</Link>
              </Menu.Item>
            </Menu>
          </Sider>

        
          <Layout style={{ padding: "20px" }}>
            <Content>
              <Routes>
                <Route path="/" element={<Posts />} />
                <Route path="/add-post" element={<AddPost />} />
                <Route path="/analytics" element={<Analytics />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>

        
        <Modal
          title="Add New User"
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleAddUser}>
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: "Please enter username" }]}
            >
              <Input placeholder="Enter username" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Add User
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Layout>
    </Router>
  );
}

export default App;
