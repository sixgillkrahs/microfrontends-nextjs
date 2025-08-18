import { useModal } from "@/hooks";
import { deleteConnector, getConnector } from "@/service/configTable/api";
import { BreadcrumbItem } from "@/types";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  message,
  Popconfirm,
  Space,
  Table,
  TableColumnsType,
  Tag,
} from "custom-ui-antd";
import { useCallback, useEffect, useState } from "react";
import CUModal from "./components/CUModal";

export const ConfigTable = ({
  onBreadcrumbChange,
}: {
  onBreadcrumbChange: (items: BreadcrumbItem[]) => void;
}) => {
  const [openCreate, openCreateDialog, closeCreateDialog] = useModal();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState<ConfigTable.Pagination>({
    pageIndex: 0,
    pageSize: 5,
    total: 0,
  });
  const { data, error, isLoading } = useQuery({
    queryKey: [
      "debezium-connectors",
      pagination.pageIndex,
      pagination.pageSize,
    ],
    queryFn: () => getConnector(pagination.pageSize, pagination.pageIndex),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
    staleTime: Infinity,
  });
  const [header, setHeader] = useState<ConfigTable.Header>();
  const deleteMutation = useMutation({
    mutationFn: deleteConnector,
    onSuccess: () => {
      messageApi.open({
        type: "success",
        content: "Xóa thành công",
      });
      queryClient.invalidateQueries({ queryKey: ["debezium-connectors"] });
    },
    onError: (error: any) => {
      messageApi.open({
        type: "error",
        content: "Có lỗi xảy ra khi xóa",
      });
    },
  });
  console.log(data?.data?.content);

  const listStatus = [
    {
      label: "Khởi tạo",
      value: "CREATED",
      color: "default",
    },
    {
      label: "Đang kết nối",
      value: "RUNNING",
      color: "success",
    },
    {
      label: "Đã xóa",
      value: "DELETED",
      color: "error",
    },
  ];

  useEffect(() => {
    onBreadcrumbChange([
      { title: "Home", href: "/" },
      { title: "Audit" },
      { title: "Config Table" },
    ]);
  }, [onBreadcrumbChange]);

  const columns: TableColumnsType = [
    {
      title: "STT",
      key: "index",
      dataIndex: "index",
      width: 60,
      render(value, record, index) {
        console.log(index);
        return (
          <div>{index + 1 + pagination.pageIndex * pagination.pageSize}</div>
        );
      },
    },
    {
      title: "Tên kết nối",
      key: "connectorName",
      dataIndex: "connectorName",
      width: 320,
    },
    {
      title: "Loại cơ sở dữ liệu",
      key: "databaseType",
      dataIndex: "databaseType",
      width: 220,
    },
    {
      title: "Cấu hình",
      key: "baseConfig",
      dataIndex: "baseConfig",
      render: (value: Record<string, string>) => {
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {Object.entries(value || {}).map(([key, val]) => (
              <div
                key={key}
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <strong>{key}:</strong>
                <span>{val}</span>
              </div>
            ))}
          </div>
        );
      },
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      width: 220,
      render: (value: string) => {
        const status = listStatus.find((x) => x.value === value);
        if (!status) return <Tag color="default">Khởi tạo</Tag>;
        return <Tag color={status.color}>{status.label}</Tag>;
      },
    },
    {
      title: "Thời gian tạo",
      key: "createdAt",
      dataIndex: "createdAt",
      width: 220,
      render: (value: string) => {
        const date = new Date(value);
        const formatted = date.toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        return formatted;
      },
    },
    {
      title: "Hành động",
      key: "action",
      width: 120,
      render: (value: any) => {
        return (
          <Space>
            <EditOutlined
              key={"DeleteButton"}
              title={"Sửa"}
              style={{ padding: 10 }}
              onClick={() => handleUpdate(value)}
            />
            <Popconfirm
              title={"Bạn có muốn xóa kết nối này không?"}
              onConfirm={() => handleDelete(value.id)}
              okText={"Đồng ý"}
              cancelText={"Hủy"}
              placement="left"
            >
              <DeleteOutlined
                key={"DeleteButton"}
                title={"Xóa"}
                style={{ padding: 10 }}
              />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const handleCreate = () => {
    setHeader({
      data: null,
      type: "ADD",
    });
    openCreateDialog();
  };

  const handleClose = useCallback(() => {
    closeCreateDialog();
  }, [closeCreateDialog]);

  const handleUpdate = (data: ConfigTable.BaseConfigObj) => {
    console.log(data);
    setHeader({
      data: data,
      type: "EDIT",
    });
    openCreateDialog();
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <div>
      {contextHolder}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "16px",
        }}
      >
        <Button type="primary" onClick={handleCreate}>
          Thêm kết nối
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data?.data?.content || []}
        rowKey={"id"}
        loading={isLoading}
        pagination={{
          align: "center",
          current: pagination.pageIndex + 1,
          total: data?.data?.total || 0,
          pageSize: pagination.pageSize,
          showSizeChanger: true,
          pageSizeOptions: [5, 10, 20],
          onChange(page, pageSize) {
            setPagination({
              pageIndex: page - 1,
              pageSize,
              total: data?.data?.total || 0,
            });
          },
        }}
      />
      <CUModal onCancel={handleClose} open={openCreate} header={header!} />
    </div>
  );
};
