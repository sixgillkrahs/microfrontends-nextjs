import { BreadcrumbItem, useBreadcrumb } from "@/contexts/BreadcrumbContext";
import MainLayout from "@/layouts/MainLayout";
import dynamic from "next/dynamic";
import React, { ReactElement } from "react";

const DebeziumDetailPage = dynamic<{
  onBreadcrumbChange: (items: BreadcrumbItem[]) => void;
}>(
  () =>
    import("audit/template/DebeziumDetail").then((m) => {
      console.log(m);
      return m.DebeziumDetail;
    }),
  {
    ssr: false,
  }
);

const Page = () => {
  const { setItems } = useBreadcrumb();
  return <DebeziumDetailPage onBreadcrumbChange={setItems} />;
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Page;
