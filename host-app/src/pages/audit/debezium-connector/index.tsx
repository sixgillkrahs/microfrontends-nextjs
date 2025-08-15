import { BreadcrumbItem, useBreadcrumb } from "@/contexts/BreadcrumbContext";
import MainLayout from "@/layouts/MainLayout";
import dynamic from "next/dynamic";
import { ReactElement } from "react";

const DebeziumPage = dynamic<{
  onBreadcrumbChange: (items: BreadcrumbItem[]) => void;
}>(() => import("audit/template/Debezium").then((m) => m.Debezium), {
  ssr: false,
});

const Audit = () => {
  const { setItems } = useBreadcrumb();
  return <DebeziumPage onBreadcrumbChange={setItems} />;
};

Audit.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Audit;
