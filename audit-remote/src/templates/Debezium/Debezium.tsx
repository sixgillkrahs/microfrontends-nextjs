import { BreadcrumbItem } from "@/types";
import React, { useEffect } from "react";
import { Table } from "loxtek-ui";
import { useQuery } from "@tanstack/react-query";

export const Debezium = ({
  onBreadcrumbChange,
}: {
  onBreadcrumbChange: (items: BreadcrumbItem[]) => void;
}) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["debezium-connectors"],
    queryFn: async () => {
      const res = await fetch(
        "https://promix.lam-hang.com/audit/api/debezium-connectors/search",
        {
          method: "GET",
          headers: {
            accept: "*/*",
          },
        }
      );
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    },
  });
  useEffect(() => {
    onBreadcrumbChange([
      { title: "Home", href: "/" },
      { title: "Audit" },
      { title: "Debezium" },
    ]);
  }, [onBreadcrumbChange]);

  return <div>{data}</div>;
};
