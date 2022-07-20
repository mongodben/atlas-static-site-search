import React, { useState } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from '@mui/icons-material/Close';
import ListItemButton from "@mui/material/ListItemButton";
import ListItem from "@mui/material/ListItem";
import { Result } from "../../types";
import { decode } from "html-entities";
import { SEARCH_HISTORY_KEY, SEARCH_HISTORY_MAX_SIZE } from '../../constants';

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


export function addResultToSearchHistory(res: Result) {
    res.doc_text = "";
    res.highlights = [];
    const history = getSearchHistory();
    const new_history = history.filter((curr: Result) => curr._id !==  res._id);
    new_history.unshift(res);
    if (new_history.length > SEARCH_HISTORY_MAX_SIZE) {
      new_history.pop();
    }
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(new_history));
  }
  
function removeResultFromSearchHistory(res: Result) {
    const history = getSearchHistory();
    const new_history = history.filter((curr: Result) => curr._id !==  res._id);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(new_history));
}
  
function getSearchHistory() {
    const history = JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) || "[]");
    return history;
}

export default function SearchHistory() {
    const [selected, setSelected] = useState(0);
    const [searchHistory, setSearchHistory] = useState(getSearchHistory());

    return(searchHistory.length > 0 ? <>
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
            Search History
        </p>
        </div>
        {searchHistory.map((historyResult: Result, idx: number) => {
        return (
            <ListItem
            secondaryAction={
            <IconButton edge="end" onClick={() => {
                removeResultFromSearchHistory(historyResult);
                setSearchHistory(getSearchHistory());
            }}>
                <CloseIcon />
            </IconButton>}
            style={{
                width: "100%",
                borderRadius: "10px",
                backgroundColor: selected === idx ? "#92D293" : "white",
                marginTop: "5px",
                marginBottom: "5px",
            }}
            disablePadding
            >
            <ListItemButton
                
                onClick={() => {
                window.open(historyResult._id);
                addResultToSearchHistory(historyResult);
                setSearchHistory(getSearchHistory());
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
            {!historyResult.highlights ||
                (historyResult.highlights &&
                historyResult.highlights.length === 0 && (
                    <>
                    <p
                        style={{
                        color: selected === idx ? "white" : "black",
                        margin: 0,
                        fontSize: ".9em",
                        }}
                    >
                        {truncateText(decode(historyResult.title))}
                    </p>

                    <span
                        style={{
                        color: selected === idx ? "white" : "gray",
                        fontSize: ".75em",
                        }}
                    >
                        {truncateText(historyResult._id, 12)}
                    </span>
                    </>
                ))}
            </div>
        }
            </ListItemButton>
            </ListItem>
        )
        })}
        <Button
        variant="outlined"
        onClick={() => {
            localStorage.removeItem(SEARCH_HISTORY_KEY);
            setSearchHistory(getSearchHistory());
        }}
        style={{
            textTransform: "none",
            borderRadius: "10px",
            marginTop: "10px"
            
        }}
        color="success"
        size="large"
        >
        Clear History
        </Button>
    
    </> : <></>);
}