import AuthLayout from "@/layouts/AuthLayout";
import { ReactElement, ComponentType } from "react";

export default function withAuthLayout<T extends object>(
  Page: ComponentType<T>
) {
  const PageWithLayout = (props: T) => <Page {...props} />;

  (PageWithLayout as any).getLayout = function getLayout(page: ReactElement) {
    return <AuthLayout>{page}</AuthLayout>;
  };

  return PageWithLayout;
}
