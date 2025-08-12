import withAuthLayout from "@/utils/withAuthLayout";
import dynamic from "next/dynamic";

const RegisterPage = dynamic(
  () =>
    import("remote/template/Register").then((m) => {
      console.log(m);
      return m.Register;
    }),
  {
    ssr: false,
  }
);

const Register = () => {
  return <RegisterPage />;
};

export default withAuthLayout(Register);
