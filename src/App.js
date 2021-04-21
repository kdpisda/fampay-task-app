import React from "react";
import {
  Container,
  Typography,
  Link,
  Grid,
  TextField,
  Card,
  CardActionArea,
  CardContent,
  Switch,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import { useSnackbar } from "notistack";
import Skeleton from "@material-ui/lab/Skeleton";

import { getVideos } from "./apis";
import { get, generateNotificationFunctional } from "./utils";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  root: {
    maxWidth: 345,
  },
  media: {
    width: "100%",
  },
  searchBox: {
    padding: "2rem",
  },
  searchResultBox: {
    padding: "2rem",
  },
  copyright: {
    padding: "2rem",
  },
}));

function Copyright() {
  const classes = useStyles();
  return (
    <Typography
      variant="body2"
      color="textSecondary"
      align="center"
      className={classes.copyright}
    >
      {"Copyright © "}
      <Link color="inherit" href="/">
        Kuldeep Pisda
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function App() {
  const classes = useStyles();
  const [query, setQuery] = React.useState("");
  const [order, setOrder] = React.useState("DESC");
  const [loading, setLoading] = React.useState(false);
  const [videos, setVideos] = React.useState([]);
  const dummyLoader = new Array(12).fill(1);

  const { enqueueSnackbar } = useSnackbar();

  React.useEffect(async () => {
    await setLoading(true);
    const data = {
      order: order,
      query: query,
    };
    let res = await getVideos(data);
    generateNotificationFunctional(
      res,
      enqueueSnackbar,
      "Video List Updated!!!"
    );
    let status = get(["status"])(res);
    if (status !== null && status === 200) {
      const results = get(["data", "results"])(res);
      await setVideos(results);
    }
    await setLoading(false);
  }, [query, order]);

  return (
    <Container>
      <Grid container spacing={1} className={classes.searchBox}>
        <Grid item xs={12} md={6} container alignItems="flex-end">
          <Grid item>
            <SearchIcon />
          </Grid>
          <Grid item>
            <TextField
              fullWidth
              value={query}
              onChange={async (event) => {
                await setQuery(event.target.value);
              }}
              id="input-with-icon-grid"
              label="Type your query"
            />
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          container
          alignItems="center"
          justify="center"
          direction="row"
        >
          {order === "DESC" ? "Descending Order" : "Ascending Order"}
          <Switch
            checked={order === "DESC"}
            onChange={async () => {
              if (order === "DESC") {
                await setOrder("ASC");
              } else {
                await setOrder("DESC");
              }
            }}
            color="primary"
            name="order"
            inputProps={{ "aria-label": "primary checkbox" }}
          />
        </Grid>
      </Grid>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        spacing={2}
        className={classes.searchResultBox}
      >
        {loading
          ? dummyLoader.map((item, index) => {
              return (
                <Grid key={index} item xs={12} md={4} lg={3}>
                  <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                  >
                    <Skeleton variant="rect" width="100%" height={118} />
                    <Skeleton width="100%" />
                    <Skeleton width="100%" />
                  </Grid>
                </Grid>
              );
            })
          : videos.map((video, index) => {
              console.log(video["thumbnails"]["high"]["url"]);
              return (
                <Grid key={index} item xs={12} md={4} lg={3}>
                  <Card className={classes.root}>
                    <CardActionArea
                      onClick={() => {
                        window.open(
                          "https://www.youtube.com/watch?v=" +
                            video["youtube_video_id"],
                          "_blank"
                        );
                      }}
                    >
                      <img
                        className={classes.media}
                        src={video["thumbnails"]["high"]["url"]}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h6" component="h6">
                          {video["title"]}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="p"
                        >
                          {video["description"]}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              );
            })}
      </Grid>
      <Copyright />
    </Container>
  );
}
