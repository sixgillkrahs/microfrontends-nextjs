import { BreadcrumbItem } from "@/types";
import React, { useEffect } from "react";

export const ConfigTable = ({
  onBreadcrumbChange,
}: {
  onBreadcrumbChange: (items: BreadcrumbItem[]) => void;
}) => {
  useEffect(() => {
    onBreadcrumbChange([
      { title: "Home", href: "/" },
      { title: "Audit" },
      { title: "Config Table" },
    ]);
  }, [onBreadcrumbChange]);

  return <div>ConfigTable</div>;
};
