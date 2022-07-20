import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import InputBase from "@mui/material/InputBase";
import Typography from "@mui/material/Typography";
import { Result, Documents } from "../../types";
import { decode } from "html-entities";
import LinearProgress from "@mui/material/LinearProgress";
import mongoSearchIcon from "./query_search.png";
import { Link } from "@mui/material";
import SearchHistory, {addResultToSearchHistory} from "../History";

const style = {
  width: 550,
  backgroundColor: "background.paper",
  borderRadius: "10px",
  boxShadow: 5,
  height: 600,
  p: 2,
};

interface SearchModalProps {
  query: string;
  handleQueryChange: Function;
  searchResults: Array<Result>;
  loading: boolean;
  noResults: boolean;
}

const truncateText = (
  text: string,
  startingChar: number = 0,
  maxCharLength: number = 80,
  truncateOnRight = true,
  truncatedPartPlaceholder = "..."
) => {
  let placeholder = "";
  if (text.length > maxCharLength) {
    placeholder = truncatedPartPlaceholder;
    return truncateOnRight
      ? `${text.substring(
          startingChar,
          startingChar + maxCharLength
        )}${placeholder}`
      : `${placeholder}${text.substring(
          text.length - maxCharLength + startingChar,
          text.length
        )}`;
  }

  if (startingChar > 0) {
    return text.substring(startingChar, startingChar + maxCharLength);
  }

  return text;
};

interface HighLightedTextProps {
  inFocus: boolean;
  textDocs: Array<Documents>;
  // other props
  [x: string]: any;
}

const HighlightedText = ({
  inFocus,
  textDocs,
  ...rest
}: HighLightedTextProps) => {
  let textBeforeHighlight = [];
  let textAfterHighlight = [];
  let highlightPos = -1;
  let highlightText = "";
  let beforeHighlight = true;
  for (let i = 0; i < textDocs.length; i++) {
    const textDoc = textDocs[i];
    if (textDoc.type === "hit") {
      beforeHighlight = false;
      highlightText = textDoc.value;
      highlightPos = i;
      continue;
    }

    if (highlightPos < 0) {
      textBeforeHighlight.push(textDocs[i].value);
    } else {
      textAfterHighlight.push(textDocs[i].value);
    }
  }

  let textBefore =
    textBeforeHighlight.length > 0 ? textBeforeHighlight.join("") : "";
  let textAfter =
    textAfterHighlight.length > 0 ? textAfterHighlight.join("") : "";

  return (
    <p {...rest}>
      {truncateText(decode(textBefore), 0, 30, false)}
      {highlightText && (
        <em
          style={{
            textDecoration: inFocus ? "underline" : "",
            color: inFocus ? "inherit" : "#92D293",
            fontStyle: "normal",
          }}
        >
          {decode(highlightText)}
        </em>
      )}
      {truncateText(decode(textAfter), 0, 30)}
    </p>
  );
};

export default function SearchModal({
  query,
  handleQueryChange,
  searchResults,
  loading,
  noResults,
}: SearchModalProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(0);

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<SearchIcon />}
        onClick={() => setOpen(true)}
        style={{
          textTransform: "none",
          borderRadius: "10px",
        }}
        color="success"
        size="large"
      >
        Search...
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "center",
          paddingTop: "10%",
        }}
        BackdropProps={{
          style: {
            opacity: 0.5,
          },
        }}
      >
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "center",
            backgroundColor: "#F6F6F6",
          }}
          sx={style}
        >
          <InputBase
            placeholder="Search..."
            startAdornment={
              <IconButton disabled={true}>
                <SearchIcon fontSize={"large"} color={"success"} />
              </IconButton>
            }
            style={{
              width: "100%",
              borderBottom: "0.5px solid gray",
              padding: "15px",
              fontSize: "18px",
              backgroundColor: "white",
            }}
            onChange={(e) => handleQueryChange(e)}
            value={query}
          />

          <List
            component="nav"
            style={{
              width: "100%",
              height: "100%",
              overflowX: "hidden",
              overflowY: "scroll",
            }}
          >
            {loading && (
              <>
                <LinearProgress color={"success"} />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    height: "100%",
                    opacity: "1",
                    animation: "fade 1.5s linear",
                  }}
                >
                  <Typography variant={"h1"}>
                    <MongoSearchIcon />
                  </Typography>
                </div>
              </>
            )}
            {noResults && (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <Typography variant={"h1"}>
                    <MongoSearchIcon />
                  </Typography>
                </div>
              </>
            )}
            {!loading && searchResults && searchResults.length > 0 && (
              <div
                style={{
                  width: "100%",
                  padding: "5px",
                }}
              >
                <p
                  style={{
                    color: "#92D293",
                    padding: 0,
                    margin: 0,
                  }}
                >
                  Results
                </p>
              </div>
            )}
            {!loading &&
              searchResults.map((searchResult, idx) => {
                return (
                  <ListItemButton
                    onClick={() => {
                      window.open(searchResult._id);
                      addResultToSearchHistory(searchResult);
                    }}
                    style={{
                      width: "100%",
                      borderRadius: "10px",
                      backgroundColor: selected === idx ? "#92D293" : "white",
                      marginTop: "5px",
                      marginBottom: "5px",
                    }}
                    onMouseOver={() => setSelected(idx)}
                  >
                    {
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-around",
                          gap: "5px",
                        }}
                      >
                        {!searchResult.highlights ||
                          (searchResult.highlights &&
                            searchResult.highlights.length === 0 && (
                              <>
                                <p
                                  style={{
                                    color: selected === idx ? "white" : "black",
                                    margin: 0,
                                    fontSize: ".9em",
                                  }}
                                >
                                  {truncateText(decode(searchResult.title))}
                                </p>

                                <span
                                  style={{
                                    color: selected === idx ? "white" : "gray",
                                    fontSize: ".75em",
                                  }}
                                >
                                  {truncateText(searchResult._id, 12)}
                                </span>
                              </>
                            ))}
                        {searchResult.highlights &&
                          searchResult.highlights.length > 0 && // for multiple highlights we only grab one for now -- may add extra feature later
                          searchResult.highlights
                            .slice(0, 1)
                            .map((highlight) => {
                              return (
                                <>
                                  <HighlightedText
                                    inFocus={selected === idx}
                                    textDocs={highlight.texts}
                                    style={{
                                      color:
                                        selected === idx ? "white" : "black",
                                      margin: 0,
                                      fontSize: ".9em",
                                    }}
                                  />

                                  <span
                                    style={{
                                      color:
                                        selected === idx ? "white" : "gray",
                                      fontSize: ".75em",
                                    }}
                                  >
                                    {truncateText(decode(searchResult.title))}
                                  </span>
                                </>
                              );
                            })}
                      </div>
                    }
                  </ListItemButton>
                );
              })}
              {
                query == "" &&
                <SearchHistory/>
              }
          </List>
          <Typography variant="subtitle1">
            Powered by{" "}
            <Link
              href="https://www.mongodb.com/atlas/database"
              style={{ color: "#2E7D32", textDecorationColor: "#2E7D32" }}
            >
              MongoDB Atlas
            </Link>
          </Typography>
        </Box>
      </Modal>
    </>
  );
}

const MongoSearchIcon = () => (
  <img alt="Search icon" src={mongoSearchIcon} style={{ width: 120 }} />
);
