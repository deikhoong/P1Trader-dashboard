import {Breadcrumb, theme, Typography, Table, Button, message} from "antd";

import {useCallback, useEffect, useState} from "react";

import {EditOutlined, PlusOutlined} from "@ant-design/icons";
import type {TablePaginationConfig} from "antd";
import {useNavigate} from "react-router-dom";

import {CourseListItem, Pagination} from "../../api/api.types";
import {GetCourses} from "../../api/courses";

interface TableParams {
  pagination?: TablePaginationConfig;
}

export default function CourseList() {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const {token} = theme.useToken();

  const fetchNews = useCallback(
    async (
      params: Pagination = {
        page: 1,
        take: 10,
      }
    ) => {
      try {
        setLoading(true);
        const {
          page = tableParams.pagination?.current ?? 1,
          take = tableParams.pagination?.pageSize ?? 10,
        } = params;
        const response = await GetCourses({page, take});

        setCourses(response.data.data);
        setTableParams((prev) => ({
          ...prev,
          pagination: {
            ...prev.pagination,
            current: response.data.meta.page,
            pageSize: response.data.meta.take,
            total: response.data.meta.itemCount,
          },
        }));
      } catch (error) {
        console.error(error);
        messageApi.error("Unable to retrieve News List");
      } finally {
        setLoading(false);
      }
    },
    [messageApi, tableParams.pagination]
  );

  useEffect(() => {
    fetchNews();
  }, []);

  const handleTableChange = (pagination: TableParams["pagination"]) => {
    fetchNews({
      page: pagination?.current ?? 1,
      take: pagination?.pageSize ?? 10,
    });
  };

  const columns = [
    {title: "Name", dataIndex: "name", key: "name"},
    {title: "Price", dataIndex: "price", key: "price"},
    {title: "Language", dataIndex: "language", key: "language"},
    {title: "Subtitles", dataIndex: "subtitles", key: "subtitles"},
    {
      title: "",
      key: "action",
      render: (_: unknown, record: CourseListItem) => (
        <Button
          onClick={() => navigate(`/courses/${record.id}`)}
          icon={<EditOutlined />}
        >
          edit
        </Button>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <div className="my-6 mx-4">
        <Breadcrumb
          className="my-4"
          items={[{title: "Courses"}, {title: "List"}]}
        />
        <div className="flex w-full justify-between items-center mb-3">
          <Typography.Title level={2}>Course List</Typography.Title>
        </div>
        <div
          style={{
            padding: 24,
            minHeight: 360,
            background: token.colorBgContainer,
            borderRadius: token.borderRadiusLG,
          }}
          className="flex gap-5 flex-wrap justify-around"
        >
          <Table
            className="w-full"
            columns={columns}
            loading={loading}
            dataSource={courses}
            pagination={tableParams.pagination}
            onChange={handleTableChange}
            rowKey={(record) => record.id ?? "default-key"}
          />
        </div>
      </div>
    </>
  );
}
