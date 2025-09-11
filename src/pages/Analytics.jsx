
import React, { useEffect, useState } from "react";
import { Table, Card, List, Typography, Spin } from "antd";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

import {
  getTopAuthors,
  getMostCommentedPosts,
  getPostsPerDay,
} from "../lib/api";

const { Title } = Typography;

export default function Analytics() {
  const [authors, setAuthors] = useState([]);
  const [topPosts, setTopPosts] = useState([]);
  const [postsPerDay, setPostsPerDay] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    setLoading(true);
    try {
      const [a, t, p] = await Promise.all([
        getTopAuthors(),
        getMostCommentedPosts(),
        getPostsPerDay(),
      ]);
      setAuthors(a.record);
      setTopPosts(t.record);
      setPostsPerDay(p.record);
    } catch (err) {
      console.error("Analytics load failed:", err.message);
    } finally {
      setLoading(false);
    }
  }

  const barData = {
    labels: postsPerDay.map((x) => x._id || x.day),
    datasets: [
      {
        label: "Posts",
        data: postsPerDay.map((x) => x.count),
        backgroundColor: "rgba(24, 144, 255, 0.6)", // Ant Design blue
        borderRadius: 6,
      },
    ],
  };

  return (
    <Spin spinning={loading}>
      <div className="space-y-6">
        {/* Top Authors */}
        <Card>
          <Title level={4}>Top Authors</Title>
          <Table
            rowKey="author"
            columns={[
              { title: "Author", dataIndex: "author" },
              { title: "Posts", dataIndex: "postCount" },
            ]}
            dataSource={authors}
            pagination={false}
          />
        </Card>

        {/* Most Commented Posts */}
        <Card>
          <Title level={4}>Most Commented Posts</Title>
          <List
            bordered
            dataSource={topPosts}
            renderItem={(item) => (
              <List.Item>
                <span className="font-medium">{item.title}</span> —{" "}
                {item.author} ({item.commentCount} comments)
              </List.Item>
            )}
          />
        </Card>

        {/* Posts Per Day */}
        <Card>
          <Title level={4}>Posts Per Day (Last 7 days)</Title>
          <div className="max-w-xl">
            <Bar data={barData} />
          </div>
        </Card>
      </div>
    </Spin>
  );
}
