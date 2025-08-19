import { getConnector, getConnectorDetail } from "@/service/configTable/api";
import { BreadcrumbItem } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

export const DebeziumDetail = ({
  onBreadcrumbChange,
}: {
  onBreadcrumbChange: (items: BreadcrumbItem[]) => void;
}) => {
  const router = useRouter();
  const { id } = router.query;
  const { data, error, isLoading } = useQuery({
    queryKey: ["debezium-connectors-detail", id],
    queryFn: () => getConnectorDetail(id as string),
    enabled: !!id,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (data) {
      onBreadcrumbChange([
        { title: "Home", href: "/" },
        { title: "Audit" },
        { title: "Config Table", href: "/audit/debezium-connector" },
        {
          title: data.data.connectorName,
          href: `/audit/debezium-connector/detail-connecter/${id}`,
        },
      ]);
    }
  }, [data, id, onBreadcrumbChange]);
  return <div>DebeziumDetail</div>;
};
