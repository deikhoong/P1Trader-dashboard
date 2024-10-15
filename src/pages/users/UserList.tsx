import {Breadcrumb, theme, Typography, Table, Button, message} from "antd";

import {useEffect, useState} from "react";

import {EditOutlined} from "@ant-design/icons";
import type {PaginationProps, TablePaginationConfig} from "antd";
import {useNavigate} from "react-router-dom";
import {GetUsers} from "../../api/users";
import {Pagination} from "../../api/api.types";

interface TableParams {
  pagination?: TablePaginationConfig;
}

export default function UserList() {
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState<[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
      showSizeChanger: false,
      position: ["topRight"],
      onChange(page, pageSize) {
        if (onPageChange) {
          onPageChange(page, pageSize);
        }
      },
    },
  });
  const navigate = useNavigate();
  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();

  const fetchUsers = async (pagination?: Pagination) => {
    try {
      setLoading(true);
      const current = pagination?.page ?? tableParams.pagination!.current ?? 1;
      const take = pagination?.take ?? tableParams.pagination!.pageSize ?? 10;

      const response = await GetUsers({page: current, take});

      setAllData(response.data.data);

      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          current: response.data.meta.page,
          pageSize: response.data.meta.take,
          total: response.data.meta.itemCount,
        },
      });
    } catch (error) {
      console.error(error);
      messageApi.error("無法取得使用者列表");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onPageChange: PaginationProps["onChange"] = (page, pageSize) => {
    fetchUsers({page, take: pageSize});
    setTableParams((prev) => ({
      pagination: {
        ...prev.pagination,
        current: page,
        pageSize: pageSize,
      },
    }));
  };

  const onEdit = async (id: string) => {
    navigate(`/admin/users/${id}`);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Nickname",
      dataIndex: "nickname",
      key: "nickname",
      render: (nickname: string | null) => nickname || "N/A",
    },
    {
      title: "Trading View Email",
      dataIndex: "tradingViewEmail",
      key: "tradingViewEmail",
    },
    {
      title: "Discord Id",
      dataIndex: "discordId",
      key: "discordId",
    },
    {
      title: "",
      dataIndex: "function",
      key: "function",
      width: "20%",
      render: (_: boolean, record: {id: string}) => (
        <Button
          onClick={() => onEdit(record.id)}
          size={"large"}
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
          items={[{title: "使用者"}, {title: "列表"}]}
        />
        <div className="flex w-full justify-between items-center mb-3">
          <Typography.Title level={2}>使用者列表</Typography.Title>
        </div>
        <div
          style={{
            padding: 24,
            minHeight: 360,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
          className="flex gap-5 flex-wrap justify-around"
        >
          <Table
            className="w-full"
            columns={columns}
            loading={loading}
            dataSource={allData}
            pagination={tableParams.pagination}
          />
        </div>
      </div>
    </>
  );
}
