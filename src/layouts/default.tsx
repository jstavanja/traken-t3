import { FC, PropsWithChildren } from "react";
import { DefaultHeader } from "../components/headers/default";

const DefaultLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <DefaultHeader />
      {children}
    </>
  );
};

export default DefaultLayout;
