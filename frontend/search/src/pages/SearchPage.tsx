import React from "react";
import Typography from "@mui/material/Typography";
import Search from "atlas-static-site-search-box";

interface SearchProps {
  id: string;
}

export default function SearchPage({ id }: SearchProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        alignItems: "center",
        height: "400px",
      }}
    >
      <Typography variant="h3">🥭</Typography>
      <Search id={id} />
    </div>
  );
}
