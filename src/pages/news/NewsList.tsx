import {Breadcrumb, theme, Typography, Table, Button, message} from "antd";

import {useCallback, useEffect, useState} from "react";

import {EditOutlined, PlusOutlined} from "@ant-design/icons";
import type {TablePaginationConfig} from "antd";
import {useNavigate} from "react-router-dom";

import {NewsListItem, Pagination} from "../../api/api.types";
import {GetNews} from "../../api/news";

interface TableParams {
  pagination?: TablePaginationConfig;
}

export default function NewsList() {
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState<NewsListItem[]>([]);
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
        const response = await GetNews({page, take});

        setNews(response.data.data);
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
        messageApi.error("無法取得Event列表");
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
    {
      title: "封面圖",
      dataIndex: "cover",
      key: "cover",
      render: (cover: {url: string}) =>
        cover ? (
          <img src={cover.url} alt="封面圖" style={{width: 50, height: 50}} />
        ) : (
          "N/A"
        ),
    },
    {title: "標題", dataIndex: "title", key: "title"},
    {title: "類型", dataIndex: "type", key: "type"},
    {
      title: "",
      key: "action",
      render: (_: unknown, record: NewsListItem) => (
        <Button
          onClick={() => navigate(`/news/${record.id}`)}
          icon={<EditOutlined />}
        >
          編輯
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
          items={[{title: "新聞"}, {title: "列表"}]}
        />
        <div className="flex w-full justify-between items-center mb-3">
          <Typography.Title level={2}>News 列表</Typography.Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate(`/events/create`)}
          >
            建立 News
          </Button>
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
            dataSource={news}
            pagination={tableParams.pagination}
            onChange={handleTableChange}
            rowKey={(record) => record.id ?? "default-key"}
          />
        </div>
      </div>
    </>
  );
}