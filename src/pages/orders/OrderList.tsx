import {Breadcrumb, theme, Table, message, Badge} from "antd";

import {useCallback, useEffect, useState} from "react";

import type {BadgeProps, TablePaginationConfig} from "antd";

import {OrderListItem, OrderStatus, Pagination} from "../../api/api.types";

import {GetOrders} from "../../api/orders";

interface TableParams {
  pagination?: TablePaginationConfig;
}

export default function OrderList() {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const [messageApi, contextHolder] = message.useMessage();

  const {token} = theme.useToken();

  const fetchOrders = useCallback(
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
        const response = await GetOrders({page, take});

        setOrders(response.data.data);
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
        messageApi.error("Unable to retrieve Order List");
      } finally {
        setLoading(false);
      }
    },
    [messageApi, tableParams.pagination]
  );

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleTableChange = (pagination: TableParams["pagination"]) => {
    fetchOrders({
      page: pagination?.current ?? 1,
      take: pagination?.pageSize ?? 10,
    });
  };

  interface StatusBadgeProps {
    status: OrderStatus;
  }

  const StatusBadge: React.FC<StatusBadgeProps> = ({status}) => {
    let color: string;
    let text: string;

    switch (status) {
      case OrderStatus.paying:
        color = "processing";
        text = "Paying";
        break;
      case OrderStatus.paid:
        color = "success";
        text = "Paid";
        break;
      case OrderStatus.fail:
        color = "error";
        text = "Failed";
        break;
      default:
        color = "default";
        text = "Unknown";
    }

    return (
      <Badge
        status={color as any}
        text={text}
        style={{
          fontSize: "14px",
          fontWeight: 500,
        }}
      />
    );
  };

  const columns = [
    {title: "Order Id", dataIndex: "id", key: "id"},
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: OrderStatus) => <StatusBadge status={status} />,
    },
    {title: "Payment", dataIndex: "payment", key: "payment"},
    {title: "Course", dataIndex: "course", key: "course"},
    {title: "Paid At", dataIndex: "paidAt", key: "paidAt"},
  ];

  return (
    <>
      {contextHolder}
      <div className="my-6 mx-4">
        <Breadcrumb
          className="my-4"
          items={[{title: "Order"}, {title: "List"}]}
        />
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
            dataSource={orders}
            pagination={tableParams.pagination}
            onChange={handleTableChange}
            rowKey={(record) => record.id ?? "default-key"}
          />
        </div>
      </div>
    </>
  );
}
