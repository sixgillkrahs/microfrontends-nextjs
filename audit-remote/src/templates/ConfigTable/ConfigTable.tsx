import { BreadcrumbItem } from "@/types";
import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button, Table, TableColumnsType } from "custom-ui-antd";
import { useModal } from "@/hooks";
import CUModal from "./components/CUModal";

export const ConfigTable = ({
  onBreadcrumbChange,
}: {
  onBreadcrumbChange: (items: BreadcrumbItem[]) => void;
}) => {
  const [openCreate, openCreateDialog, closeCreateDialog] = useModal();
  const { data, error, isLoading } = useQuery({
    queryKey: ["debezium-connectors"],
    queryFn: async () => {
      const res = await fetch(
        "https://promix.lam-hang.com/audit/api/debezium-connectors/search",
        {
          method: "GET",
          headers: { accept: "*/*" },
        }
      );

      const json = await res.json();
      console.log(json);

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      return json;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
    staleTime: Infinity,
  });
  console.log(data?.data?.content);

  useEffect(() => {
    onBreadcrumbChange([
      { title: "Home", href: "/" },
      { title: "Audit" },
      { title: "Config Table" },
    ]);
  }, []);

  const columns: TableColumnsType = [
    {
      title: "Tên kết nối",
      key: "connectorName",
      dataIndex: "connectorName",
      width: 220,
    },
    {
      title: "Loại cơ sở dữ liệu",
      key: "databaseType",
      dataIndex: "databaseType",
      width: 120,
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
      width: 90,
    },
  ];

  const handleCreate = () => {
    openCreateDialog();
  };

  return (
    <div>
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
      />
      <CUModal onCancel={closeCreateDialog} open={openCreate} />
    </div>
  );
};
