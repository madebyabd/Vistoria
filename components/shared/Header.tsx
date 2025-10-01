import React from "react";

const Header = ({ title, subtitle }: { title: string; subtitle?: string }) => {
  return (
    <>
      <h2 className="h2-bold text-foreground drop-shadow-[0_0_25px_rgba(34,211,238,0.35)]">
        {title}
      </h2>
      {subtitle && (
        <p className="p-16-regular mt-4 max-w-3xl text-muted-foreground/90">
          {subtitle}
        </p>
      )}
    </>
  );
};

export default Header;
