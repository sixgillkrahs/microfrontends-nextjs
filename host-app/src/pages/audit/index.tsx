import { BreadcrumbItem, useBreadcrumb } from "@/contexts/BreadcrumbContext";
import MainLayout from "@/layouts/MainLayout";
import dynamic from "next/dynamic";
import React, { ReactElement, useEffect } from "react";

const ConfigTablePage = dynamic<{
  onBreadcrumbChange: (items: BreadcrumbItem[]) => void;
}>(() => import("audit/template/ConfigTable").then((m) => m.ConfigTable), {
  ssr: false,
});

const Audit = () => {
  const { setItems } = useBreadcrumb();

  return <ConfigTablePage onBreadcrumbChange={setItems} />;
};

Audit.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default Audit;
