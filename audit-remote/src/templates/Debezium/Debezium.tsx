import { BreadcrumbItem } from "@/types";
import React, { useEffect } from "react";
// import { useQuery } from "@tanstack/react-query";

export const Debezium = ({
  onBreadcrumbChange,
}: {
  onBreadcrumbChange: (items: BreadcrumbItem[]) => void;
}) => {
  useEffect(() => {
    onBreadcrumbChange([
      { title: "Home", href: "/" },
      { title: "Audit" },
      { title: "Debezium" },
    ]);
  }, [onBreadcrumbChange]);

  return <div>h1</div>;
};
