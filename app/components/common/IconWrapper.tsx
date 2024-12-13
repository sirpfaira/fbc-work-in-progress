import React from "react";

const IconWrapper = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex items-center justify-center p-2 bg-muted rounded-full hover:text-primary">
      {children}
    </div>
  );
};

export default IconWrapper;
