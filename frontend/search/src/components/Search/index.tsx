import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from "@mui/material/IconButton";
import List from '@mui/material/List';
import Skeleton from "@mui/material/Skeleton";
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from "@mui/material/ListItemText";
import InputBase from '@mui/material/InputBase';
import Typography from '@mui/material/Typography';
import {Result} from '../../types';
import {decode} from 'html-entities';
import { SEARCH_HISTORY_KEY, SEARCH_HISTORY_MAX_SIZE } from '../../constants';

const style = {
  width: 600,
  bgcolor: 'background.paper',
  borderRadius: "10px",
  boxShadow: 5,
  height: 600
};

interface SearchModalProps {
  query: string,
  handleQueryChange: Function,
  searchResults: Array<Result>,
  loading: boolean,
  noResults: boolean,
}

export default function SearchModal({query, handleQueryChange, searchResults, loading, noResults}: SearchModalProps) {

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(0);

  // Hard-coded to expect starting https://www. ...
  // Also should be moved to parent so this component can be oblivious and just grab .link
  const truncateLink = (text: string) => {
    const maxCharLength = 80;
    let suffix = '';
    if (text.length > maxCharLength) {
      suffix = '...';
    }

    return `${text.substring(12,maxCharLength)}${suffix}`;
  }

  function addResultToSearchHistory(res: Result) {
    res.doc_text = "";
    res.highlights = [];
    const history = getSearchHistory();
    const new_history = history.filter((curr: Result) => curr._id !=  res._id)
    new_history.unshift(res);
    if (new_history.length > SEARCH_HISTORY_MAX_SIZE) {
      new_history.pop();
    }
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(new_history));
  }

  function getSearchHistory() {
    const history = JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) || "[]");
    return history;
  }

  return (
      <>
        <Button
          variant="outlined"
          startIcon={<SearchIcon />}
          onClick={() => setOpen(true)}
          style={{
            textTransform: 'none',
            borderRadius: "10px"
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
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'start',
              alignItems: 'center',
              paddingTop: '10%',
            }}
            BackdropProps={{
              style:{
                opacity: 0.5
              }
            }}
        >
          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'start',
              alignItems: 'center',
            }}
            sx={style}
          >
            <InputBase
                placeholder="Search..."
                startAdornment={
                  <IconButton disabled={true} >
                    <SearchIcon fontSize={"large"} color={"success"}/>
                  </IconButton>
                }
                style={{
                  width: "100%",
                  borderBottom: "0.5px solid gray",
                  padding: "15px",
                  fontSize: "18px"
                }}
                onChange={(e) => handleQueryChange(e)}
                value={query}
            />

            <List
                component="nav"
                style={{
                  width: "95%",
                  height: "100%",
                  overflow: "auto"
                }}
            >
              {
                loading &&
                    [...Array(10)].map((e) => <Skeleton
                        sx={{
                          width: '100%',
                          minHeight: "100px"
                        }}
                    />)
              }
              {
                noResults &&
                    <>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          flexDirection: 'column',
                          height: '100%'
                        }}
                      >
                        <Typography variant={"h1"}>
                          🥭
                        </Typography>
                      </div>
                    </>
              }
              {
                !loading &&
                searchResults.map((searchResult, idx) =>{
                  return (
                      <ListItemButton
                          onClick={() => {
                            window.open(searchResult._id);
                            addResultToSearchHistory(searchResult);
                          }}
                          style={{
                            width: "100%",
                            borderRadius: "10px",
                            backgroundColor: selected === idx ? "#92D293" : ""
                          }}
                          onMouseOver={() => setSelected(idx)}
                      >
                        {
                          // !searchResult.highlights &&
                              <div
                                  style={{
                                    display: 'flex',
                                    flexDirection: "column"
                                }}
                              >
                                <ListItemText>
                                  {decode(searchResult.title)}
                                </ListItemText>

                                {
                                  searchResult._id &&
                                  <span
                                    style={{
                                      color: "gray",
                                      fontSize: 12
                                    }}
                                  >
                                    {truncateLink(searchResult._id)}
                                  </span>
                                }
                              </div>
                        }

                        {/*{*/}
                        {/*  searchResult.highlights &&*/}
                        {/*  searchResult.highlights.map((highlight) => {*/}

                        {/*    return (*/}
                        {/*        <ListItemText>*/}
                        {/*          <>*/}
                        {/*            {*/}
                        {/*              highlight.texts.map((text) => {*/}

                        {/*                if (text.type === "hit") {*/}
                        {/*                  return (*/}
                        {/*                      <b>*/}
                        {/*                        {text.value}*/}
                        {/*                      </b>*/}
                        {/*                  )*/}
                        {/*                }*/}

                        {/*                return (*/}
                        {/*                    <>*/}
                        {/*                      {text.value}*/}
                        {/*                    </>*/}
                        {/*                )*/}
                        {/*              })*/}
                        {/*            }*/}
                        {/*          </>*/}
                        {/*        </ListItemText>*/}

                        {/*        )})*/}
                        {/*}*/}

                      </ListItemButton>
                  )
                })
              }
              {
                query == "" &&
                getSearchHistory().map((historyResult: Result, idx: number) => {
                  return (
                      <ListItemButton
                          onClick={() => {
                            window.open(historyResult._id);
                          }}
                          style={{
                            width: "100%",
                            borderRadius: "10px",
                            backgroundColor: selected === idx ? "#92D293" : ""
                          }}
                          onMouseOver={() => setSelected(idx)}
                      >
                        {
                              <div
                                  style={{
                                    display: 'flex',
                                    flexDirection: "column"
                                }}
                              >
                                <ListItemText>
                                  {decode(historyResult.title)}
                                </ListItemText>

                                {
                                  historyResult._id &&
                                  <span
                                    style={{
                                      color: "gray",
                                      fontSize: 12
                                    }}
                                  >
                                    {truncateLink(historyResult._id)}
                                  </span>
                                }
                              </div>
                        }
                      </ListItemButton>
                  )
                })
                
              }
            </List>

          </Box>
        </Modal>
      </>
  )

}