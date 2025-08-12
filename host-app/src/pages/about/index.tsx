import MainLayout from "@/layouts/MainLayout";
import React, { ReactElement } from "react";

const About = () => {
  return <div>About page</div>;
};

About.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default About;
