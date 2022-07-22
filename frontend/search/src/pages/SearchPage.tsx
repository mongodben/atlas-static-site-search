import React from "react";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Search from "atlas-static-site-search-box";
import QueryIcon from "./query-icon.png";
import BottomNavigation from "@mui/material/BottomNavigation";

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
      <Typography variant="h3">
        <img src={QueryIcon} alt="search query icon" style={{ height: 50 }} />
      </Typography>
      <Typography variant="h3" variantMapping={{ h3: "h1" }}>
        Atlas Static Site Search
      </Typography>
      <Typography variant="subtitle2">
        Demo using Atlas Static Site Search to query the{" "}
        <Link href="https://mongodb.com/docs/realm">Realm documentation</Link>
      </Typography>
      <Search id={id} />
    </div>
  );
}
