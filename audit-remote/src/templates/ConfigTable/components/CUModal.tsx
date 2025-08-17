import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, message, Modal } from "custom-ui-antd";
import React from "react";

const fieldName = [
  {
    name: "connectorName",
    label: "Tên kết nối",
  },
  {
    name: "databaseType",
    label: "Loại cơ sở dữ liệu",
  },
  {
    name: "baseConfig",
    label: "Cấu hình",
  },
];

async function createConnector(data: any) {
  return fetch("https://promix.lam-hang.com/audit/api/debezium-connectors", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((res) => res.json());
}

const CUModal = ({ open, onCancel }: ConfigTable.PropsDialog) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createConnector,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["debezium-connectors"] });
      onCancel?.();
      form.resetFields();
    },
    onError: () => {
      onCancel?.();
      form.resetFields();
    },
  });

  const onFinish = (values: any) => {
    const { baseConfig, ...rest } = values;

    const configObj = baseConfig.reduce((acc: any, item: any) => {
      acc[item.field] = item.value;
      return acc;
    }, {});

    const finalValues = {
      ...rest,
      baseConfig: configObj,
    };
    mutation.mutate(finalValues);
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={"Thêm mới"}
      cancelText={"Hủy"}
    >
      <h1>he</h1>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <Form.Item label={fieldName[0].label} name={fieldName[0].name}>
            <Input />
          </Form.Item>
          <Form.Item label={fieldName[1].label} name={fieldName[1].name}>
            <Input />
          </Form.Item>
        </div>
        <Form.Item label={fieldName[2].label}>
          <Form.List name={fieldName[2].name}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div
                    key={key}
                    style={{ display: "flex", gap: "8px", marginBottom: 8 }}
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "field"]}
                      rules={[{ required: true, message: "Nhập tên trường" }]}
                      style={{ flex: 1 }}
                    >
                      <Input placeholder="Tên trường" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "value"]}
                      rules={[{ required: true, message: "Nhập giá trị" }]}
                      style={{ flex: 1 }}
                    >
                      <Input placeholder="Giá trị" />
                    </Form.Item>
                    <Button danger onClick={() => remove(name)}>
                      Xóa
                    </Button>
                  </div>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block>
                    + Thêm cấu hình
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CUModal;
