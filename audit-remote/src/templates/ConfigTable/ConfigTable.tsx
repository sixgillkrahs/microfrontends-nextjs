import { useModal } from "@/hooks";
import { deleteConnector, getConnector } from "@/service/configTable/api";
import { BreadcrumbItem } from "@/types";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  message,
  Popconfirm,
  Space,
  Table,
  TableColumnsType,
  TableProps,
  Tag,
  Input,
  GetProps,
  Select,
  CheckboxOptionType,
} from "loxtek-ui";
import { useCallback, useEffect, useState } from "react";
import CUModal from "./components/CUModal";
import { useRouter } from "next/router";

type SearchProps = GetProps<typeof Input.Search>;

export const ConfigTable = ({
  onBreadcrumbChange,
}: {
  onBreadcrumbChange: (items: BreadcrumbItem[]) => void;
}) => {
  const router = useRouter();
  const [openCreate, openCreateDialog, closeCreateDialog] = useModal();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState<ConfigTable.Pagination>({
    pageIndex: 0,
    pageSize: 10,
    total: 0,
    sort: "",
    search: "",
  });
  const { data, error, isLoading } = useQuery({
    queryKey: [
      "debezium-connectors",
      pagination.pageIndex,
      pagination.pageSize,
      pagination.sort,
      pagination.search,
    ],
    queryFn: () =>
      getConnector(
        pagination.pageSize,
        pagination.pageIndex,
        pagination.sort,
        pagination.search
      ),
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
      sorter: true,
      showSorterTooltip: false,
    },
    {
      title: "Loại cơ sở dữ liệu",
      key: "databaseType",
      dataIndex: "databaseType",
      showSorterTooltip: false,
      width: 220,
      sorter: true,
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      width: 220,
      sorter: true,
      showSorterTooltip: false,
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
      sorter: true,
      showSorterTooltip: false,
      onFilter: (value, record) => {
        return true;
      },
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
            <EyeOutlined
              key={"View"}
              title={"Xem chi tiết"}
              style={{ padding: 10 }}
              onClick={() =>
                router.push(`${router.asPath}/detail-connecter/${value.id}`)
              }
            />
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
    setHeader({
      data: data,
      type: "EDIT",
    });
    openCreateDialog();
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const onChange: TableProps<any>["onChange"] = (_, __, sorter, ___) => {
    const { field, order } = sorter as any;
    if (order) {
      setPagination((prev) => {
        return {
          ...prev,
          sort: `${field},${order === "ascend" ? "asc" : "desc"}`,
        };
      });
    } else {
      setPagination((prev) => {
        return {
          ...prev,
          sort: "",
        };
      });
    }
  };

  const onSearch: SearchProps["onSearch"] = (value, _e, info) => {
    setPagination((prev) => {
      return {
        ...prev,
        search: value,
      };
    });
  };

  const optionValue: CheckboxOptionType[] = [
    {
      value: "CREATED",
      label: "Khởi tạo",
    },
    {
      value: "CONNECTED",
      label: "Đã kết nối",
    },
  ];

  return (
    <div>
      {contextHolder}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "16px",
          gap: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 10,
          }}
        >
          <Input
            placeholder="Tìm kiếm kết nối"
            allowClear
            onClear={() => onSearch("")}
            style={{ width: 244 }}
            onPressEnter={(e) => onSearch((e.target as HTMLInputElement).value)}
          />
          <Select
            allowClear
            style={{
              minWidth: 180,
            }}
            placeholder="Chọn trạng thái"
            options={optionValue}
          />
        </div>
        <Button type="primary" onClick={handleCreate}>
          Thêm kết nối
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data?.data?.content || []}
        rowKey={"id"}
        loading={isLoading}
        onChange={onChange}
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
