import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="flex w-full items-center justify-center "
      style={{ minHeight: "100vh" }}
    >
      {children}
    </div>
  );
};

export default AuthLayout;
