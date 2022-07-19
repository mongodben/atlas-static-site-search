import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from "@mui/material/IconButton";
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Skeleton from "@mui/material/Skeleton";
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from "@mui/material/ListItemText";
import InputBase from '@mui/material/InputBase';
import Typography from '@mui/material/Typography';
import {Result} from '../../types';

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
                      <Typography variant={"h1"}>
                        🥭
                      </Typography>
                      <Typography variant={"h5"}>
                        Could only find this mango...
                      </Typography>
                    </>
              }
              {
                !loading &&
                searchResults.map((searchResult, idx) =>{
                  return (
                      <ListItemButton
                          onClick={() => {}}
                          style={{
                            width: "100%",
                            borderRadius: "10px",
                            backgroundColor: selected === idx ? "#92D293" : ""
                          }}
                          onMouseOver={() => setSelected(idx)}
                      >
                        {
                          !searchResult.highlights &&
                          <ListItemText>
                            {searchResult.title}
                          </ListItemText>
                        }
                        {
                          searchResult.highlights &&
                          searchResult.highlights.map((highlight) => {

                            return (
                                <ListItemText>
                                  <>
                                    {
                                      highlight.texts.map((text) => {

                                        if (text.type === "hit") {
                                          return (
                                              <b>
                                                {text.value}
                                              </b>
                                          )
                                        }

                                        return (
                                            <>
                                              {text.value}
                                            </>
                                        )
                                      })
                                    }
                                  </>
                                </ListItemText>

                                )})
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