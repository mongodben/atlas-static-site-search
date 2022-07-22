import React from "react";
import SearchPage from "./pages/SearchPage";
import { APP_ID } from "./constants";
import { BottomNavigation, Typography, Link } from "@mui/material";

function App() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
      }}
    >
      <SearchPage id={APP_ID} />
      <BottomNavigation
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          padding: "0 20px",
          flexDirection: "row",
        }}
      >
        <Typography variant="body1" align="center">
          For more information on Atlas Static Site Search and how to add it to
          your website, refer to{" "}
          <Link href="https://github.com/mongodben/atlas-static-site-search/issues">
            the project README on Github
          </Link>
          .
        </Typography>
      </BottomNavigation>
    </div>
  );
}

export default App;
