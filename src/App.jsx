import Footer from './components/footer/footer';
import Movies from './components/movies/movies';
import React, { Component } from 'react';
import { Alert, Button, Snackbar, Stack } from '@mui/material';
import { styled } from '@mui/system';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { grey, orange } from "@mui/material/colors";
import './App.css';
import './styles/styles.scss';

const customTheme = createTheme({
  palette: {
    common: {
      toolTipBackground: '#00161f',
      toolTipColor: '#DDD',
    },
    contrastText: 'white',
    shadows: "0 5px 40px 0.5em rgba(88, 46, 170, 0.4)",
    undoUppercaseOnlyText: 'none',
  }
});

const CustomThemeComponent = styled('div')(({ theme }) => ({
  color: theme.palette.primary.contrastText,
}));

const ResetButton = styled(Button)(({ theme }) => ({
  backgroundColor: grey[800],
  color: theme.palette.contrastText,
  fontSize: '1.1em',
  marginBottom: '30px',
  textTransform: theme.palette.undoUppercaseOnlyText,
  '&:hover': {
    backgroundColor: orange[800],
  },
}));

const StartButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#0000cc88',
  fontSize: '1.1em',
  marginBottom: '30px',
  textTransform: theme.palette.undoUppercaseOnlyText,
}));

const stackSx = { width: '30%', margin: 'auto' }

const appDivStyles = {
  display: "flex",
  flexDirection: "column",
  justifyContent: 'space-around',
  margin: 'auto',
  textShadow: '-1px -1px 2px rgba(20,20,100,0.94), 1px 1px 2px rgba(20,20,100,0.94)',
  width: "100%"
}

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      componentMounted: false,
      correctAnswer: '',
      dataFetched: false,
      formError: false,
      formHelperText: '',
      gameStarted: false,
      selectedMovieImages: [],
      snackBarOpen: false,
      userSelection: '',
      winGameEnd: false
    }
  }

  omdbBaseUrl = "https://www.omdbapi.com/";
  pixabayBaseUrl = "https://pixabay.com/api/";

  omdbApiKey = `?apikey=${process.env.REACT_APP_OMDB_API_KEY}`;
  pixabayApiKey = `?key=${process.env.REACT_APP_PIXABAY_API_KEY}`;

  moviesArray = [
    { Title: 'Into the Unknown: Making Frozen 2', imdbID: 'tt10196382' },
    { Title: 'Moana', imdbID: 'tt3521164' },
    { Title: 'How to Train Your Dragon', imdbID: 'tt0892769' },
    { Title: 'Star Trek', imdbID: 'tt0796366' },
    { Title: 'Spirited Away', imdbID: 'tt0245429' },
    { Title: 'GoldenEye', imdbID: 'tt0113189' },
    { Title: 'Jurassic Park', imdbID: 'tt0107290' },
    { Title: 'Terminator 2: Judgment Day', imdbID: 'tt0103064' },
    { Title: 'Home Alone', imdbID: 'tt0099785' },
    { Title: 'Star Wars: Episode IV - A New Hope', imdbID: 'tt0076759' }
  ];

  componentDidMount() {
    // make sure component is mounted before starting PictoPlots game
    this.setState({ componentMounted: true });
  }

  fetchPixabayData = (plot) => {
    let filteredPlotWords = plot
      // filter out with regex words: a, an, the, on, to, am, i, for, of, etc.
      .replace(/\ba\b|\ban\b|\bthe\b|\bon\b|\bfor\b|\bto\b|\bi\b|\bam\b|\band\b|\bwith\b|\bof\b/gi, "")
      // store words as array
      .split(' ')
      // if falsy (like empty string, no search hits), filter out
      .filter((value) => value);

    // up to 10 images, i represents filteredPlotWords index values
    for (let i = 0; i < (filteredPlotWords.length < 10 ? filteredPlotWords.length : 10); i++) {
      fetch(`${this.pixabayBaseUrl}${this.pixabayApiKey}&q=${filteredPlotWords[i]}&image_type=${"illustration"}`)
        .then((response) => response.json())
        .then((data) => {
          // do not setState if no hits
          if (data.hits.length) {
            // when setting state, refer to previous state, add new value to that array
            this.setState(prevState => ({
              selectedMovieImages: [
                ...prevState.selectedMovieImages,
                {
                  // trying to increase search term usage variety with random integer selection
                  previewURL: data.hits[this.returnRandomIntRange(0, (data.hits.length - 1))].previewURL,
                  searchTerm: filteredPlotWords[i],
                  // trying to prevent two children with same key error
                  id: i, // searchTermId, ordinal place in filteredPlotWords
                }
              ]
            }));
          }
        })
        .catch((error) => console.log('error:', error));
    }

    this.setState({ dataFetched: true });
  }

  fetchSelectedMovieData = async () => {
    this.setState({ gameStarted: true });

    fetch(`${this.omdbBaseUrl}${this.omdbApiKey}&i=${this.moviesArray[this.returnRandomIntRange(0, (this.moviesArray.length - 1))].imdbID}`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({ correctAnswer: data.Title });
        return data.Plot;
      })
      .then((plot) => this.fetchPixabayData(plot))
      .catch((error) => console.log('error:', error));
  }

  handleAnswerSubmit = (e) => {
    if (e.target.value === this.state.correctAnswer) {
      console.log('Correct!');
      this.setState({
        formHelperText: 'Correct!',
        userSelection: e.target.value,
        winGameEnd: true,
      });
    } else {
      console.log('Incorrect. Please try again.');
      this.setState({
        formError: true,
        formHelperText: 'Incorrect. Please try again.',
        userSelection: e.target.value,
      });
    }
  }

  handleSnackbarClick = () => {
    this.setState({ snackBarOpen: true });

    setTimeout(() => {
      this.setState({ snackBarOpen: false });
    }, 4000);
  }

  handleUserSelectionChange = (e) => {
    this.handleAnswerSubmit(e);

    // trying to help reduce buildup of snackbars opening:
    // call only when !this.state.snackBarOpen
    // onClose for Snackbar and Alert might be able to improve behavior
    if (!this.state.snackBarOpen) {
      this.handleSnackbarClick();
    }
  }

  resetGame = () => {
    // reset states
    this.setState({
      componentMounted: false,
      correctAnswer: '',
      dataFetched: false,
      formError: false,
      formHelperText: '',
      gameStarted: false,
      selectedMovieImages: [],
      snackBarOpen: false,
      userSelection: '',
      winGameEnd: false
    });
    // refresh/reload page
    window.location.reload();
  }

  returnRandomIntRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  get endGame() {
    return this.state.userSelection === this.state.correctAnswer && this.state.winGameEnd;
  }

  get resetButtonDisabled() {
    return this.state.selectedMovieImages.length <= 0 || !this.state.componentMounted;
  }

  get startButtonDisabled() {
    return this.state.selectedMovieImages.length >= 1 || !this.state.componentMounted;
  }

  render() {
    return (
      <ThemeProvider theme={customTheme}>
        <CustomThemeComponent className="App">
          <h2 className="appMainHeader">PictoPlots</h2>
          <Movies
            correctAnswer={this.state.correctAnswer}
            dataFetched={this.state.dataFetched}
            formHelperText={this.state.formHelperText}
            gameStarted={this.state.gameStarted}
            handleAnswerSubmit={this.handleAnswerSubmit}
            handleUserSelectionChange={this.handleUserSelectionChange}
            moviesArray={this.moviesArray}
            selectedMovieImages={this.state.selectedMovieImages}
            userSelection={this.state.userSelection}
            winGameEnd={this.state.winGameEnd}
          />

          <div style={appDivStyles}>
            {
              !this.state.dataFetched ? (
                <StartButton
                  disabled={this.startButtonDisabled}
                  onClick={this.fetchSelectedMovieData}
                  variant='contained'
                >Start PictoPlots!
                </StartButton>
              ) : (<></>)
            }

            {
              this.state.dataFetched ? (
                <ResetButton
                  disabled={this.resetButtonDisabled}
                  onClick={this.resetGame}
                  sx={{
                    backgroundColor: this.state.winGameEnd
                      ? 'darkslategray'
                      : '#800040',
                    '&:disabled': {
                      color: '#555',
                      backgroundColor: '#333',
                    }
                  }}
                >
                  {this.state.winGameEnd ? 'Try Again? (reload page)' : 'Reset Game'}
                </ResetButton>
              ) : (<></>)
            }

          </div>
        </CustomThemeComponent>
        <Footer />

        <Stack spacing={2} sx={stackSx}>
          <Snackbar open={this.state.snackBarOpen}>
            <Alert
              severity={this.endGame ? 'success' : 'error'}
              sx={{ width: '100%' }}
            >
              {this.endGame ? 'Correct! You Win!' : 'Incorrect. Please try again.'}
            </Alert>
          </Snackbar>
        </Stack>
      </ThemeProvider>
    );
  }
}
