import withAuthLayout from "@/utils/withAuthLayout";
import dynamic from "next/dynamic";

const LoginPage = dynamic(
  () => import("remote/template/Login").then((m) => m.Login),
  {
    ssr: false,
  }
);

const Login = () => {
  return <LoginPage />;
};

export default withAuthLayout(Login);
