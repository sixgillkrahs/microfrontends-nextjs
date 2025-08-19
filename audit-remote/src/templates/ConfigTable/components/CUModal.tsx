import { createConnector, updateConnector } from "@/service/configTable/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Collapse,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Switch,
  Tooltip,
} from "loxtek-ui";
import { memo, useEffect } from "react";
import { InfoCircleOutlined, PlusOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

const CUModal = ({ open, onCancel, header }: ConfigTable.PropsDialog) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: { type: "ADD" | "UPDATE"; data: any; id?: string }) =>
      payload.type === "ADD"
        ? createConnector(payload.data)
        : updateConnector(payload.id!, payload.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["debezium-connectors"] });
      handleClose();
    },
  });

  const handleClose = () => {
    onCancel?.();
    form.resetFields();
  };

  useEffect(() => {
    if (header?.data) {
      form.setFieldsValue(header.data);
    }
  }, [header?.data]);

  const onFinish = (values: any) => {
    const finalValues = { ...values };
    header.type === "ADD"
      ? mutation.mutate({ type: "ADD", data: finalValues })
      : mutation.mutate({
          type: "UPDATE",
          id: header.data?.id as string,
          data: finalValues,
        });
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      onOk={() => form.submit()}
      okText={header?.type === "ADD" ? "Thêm mới" : "Cập nhật"}
      cancelText={header?.type === "ADD" ? "Đóng" : "Hủy"}
      title={header?.type === "ADD" ? "Thêm mới kết nối" : "Cập nhật kết nối"}
      width={720}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Tên kết nối"
          name="connectorName"
          rules={[{ required: true, message: "Vui lòng nhập tên kết nối" }]}
        >
          <Input placeholder="Ví dụ: mariadb_connector_01" />
        </Form.Item>
        <Form.Item
          label="Loại cơ sở dữ liệu"
          name="databaseType"
          rules={[{ required: true, message: "Chọn loại CSDL" }]}
        >
          <Select
            placeholder="Chọn loại CSDL"
            options={[
              { label: "MySQL", value: "mysql" },
              { label: "Postgres", value: "postgres" },
              { label: "MariaDB", value: "mariadb" },
            ]}
          />
        </Form.Item>
        <Collapse defaultActiveKey={["info", "db", "kafka"]} ghost>
          <Panel header="Cấu hình Database" key="db">
            <Form.Item
              label="Connector Class"
              name={["baseConfig", "connector.class"]}
            >
              <Select
                options={[
                  {
                    label: "MySQL",
                    value: "io.debezium.connector.mysql.MySqlConnector",
                  },
                  {
                    label: "Postgres",
                    value: "io.debezium.connector.postgresql.PostgresConnector",
                  },
                ]}
              />
            </Form.Item>
            <Form.Item
              label="Hostname"
              name={["baseConfig", "database.hostname"]}
            >
              <Input placeholder="promotion-mariadb" />
            </Form.Item>
            <Form.Item label="Port" name={["baseConfig", "database.port"]}>
              <InputNumber style={{ width: "100%" }} placeholder="3306" />
            </Form.Item>
            <Form.Item label="User" name={["baseConfig", "database.user"]}>
              <Input placeholder="root" />
            </Form.Item>
            <Form.Item
              label="Password"
              name={["baseConfig", "database.password"]}
            >
              <Input placeholder="••••••" />
            </Form.Item>
          </Panel>

          <Panel header="Schema & Kafka" key="kafka">
            <Form.Item
              label={
                <span>
                  Include Schema Changes{" "}
                  <Tooltip title="Bật để theo dõi thay đổi schema">
                    <InfoCircleOutlined />
                  </Tooltip>
                </span>
              }
              name={["baseConfig", "include.schema.changes"]}
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              label="Kafka Topic"
              name={["baseConfig", "schema.history.internal.kafka.topic"]}
            >
              <Input placeholder="schema-changes.mariadb" />
            </Form.Item>
            <Form.Item
              label="Kafka Bootstrap Servers"
              name={[
                "baseConfig",
                "schema.history.internal.kafka.bootstrap.servers",
              ]}
            >
              <Input placeholder="kafka-1:9092" />
            </Form.Item>
          </Panel>
        </Collapse>
      </Form>
    </Modal>
  );
};

export default memo(CUModal);
