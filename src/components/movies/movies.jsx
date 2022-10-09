import {
    FormControl,
    FormControlLabel,
    FormHelperText,
    ImageList,
    ImageListItem,
    Radio,
    RadioGroup,
    Tooltip
} from "@mui/material";
import React from "react";
import { blue, grey } from "@mui/material/colors";
import { styled } from '@mui/system';
import { tooltipClasses } from '@mui/material/Tooltip';
import '../../styles/movies.scss';

const DarkToolTip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.toolTipBackground,
        boxShadow: theme.shadows,
        color: theme.palette.common.toolTipColor,
        fontSize: '0.7em'
    },
}));

const MoviesDiv = styled('div')({
    borderRadius: '0.25em',
    color: 'darkslategrey',
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    margin: "auto",
    padding: '0'
});

const TooltipTitle = styled('h2')({
    borderRadius: '0.25em',
    color: 'snow',
    margin: 'auto'
});

const formControlSx = {
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",
    textAlign: "center",
    width: "80%"
}

const formHelperTextSx = {
    background: 'linear-gradient(to right, transparent, navy, transparent)',
    color: 'wheat',
    fontSize: '1em',
    margin: '0 auto',
    marginTop: '0.25em',
    textAlign: 'center',
    width: '100%',
    '&.MuiFormHelperText-root.Mui-disabled': {
        background: 'linear-gradient(to right, transparent, #396060, transparent)',
        color: 'palegreen'
    }
}

const radioSx = {
    '&.MuiSvgIcon-root': { display: 'none' },
    '&.PrivateSwitchBase-input': { display: 'none' },
    '&.MuiButtonBase-root': { display: 'none' },
    '&:enabled:active': {
        backgroundColor: 'yellow',
        color: 'black'
    }
}

export default function Movies(props) {
    const displayMoviesBackgroundColor = () => {
        if (props.dataFetched && !props.winGameEnd) {
            return '#ffdea6';
        }

        if (props.winGameEnd) {
            return 'darkseagreen';
        }

        return '#777';
    }

    const displayMoviesBorderColor = () => {
        if (props.dataFetched && !props.winGameEnd) {
            return '#03a9f4';
        }

        if (props.winGameEnd) {
            return 'darkseagreen';
        }

        return '#808080';
    }

    const moviesDivBackgroundColor = () => {
        if (props.dataFetched && !props.winGameEnd) {
            return 'rgba(255, 239, 213,0.7)';
        }

        if (props.winGameEnd) {
            return 'linear-gradient(to top right, #8fbc8f, #8fbc8f, #8fbc8f)';
        }

        return 'lightslategrey';
    }

    const displayMoviesArrayChoices = () => {
        return props.moviesArray.map((value, index) => {
            return (
                <FormControlLabel
                    control={<Radio sx={radioSx} />}
                    key={index}
                    label={value.Title}
                    sx={{
                        backgroundColor: `${displayMoviesBackgroundColor()}`,
                        border: `0.1em outset ${displayMoviesBorderColor()}`,
                        borderRadius: '5px',
                        margin: '0.1em',
                        padding: '3px',
                        transition: '0.2s',
                        width: '100%',
                        '&:hover': {
                            backgroundColor: props.selectedMovieImages.length && !props.winGameEnd
                                ? blue[900]
                                : '',
                            color: grey[50],
                        },
                        '&:active': {
                            backgroundColor: !props.selectedMovieImages.length || props.winGameEnd
                                ? ''
                                : 'yellow',
                            color: !props.selectedMovieImages.length || props.winGameEnd
                                ? ''
                                : '#222',
                            transition: '0.1s',
                        },
                        '&:disabled': { backgroundColor: '#222' },
                    }}
                    value={value.Title}
                />
            );
        });
    }

    const displaySelectedMovieImages = () => {
        if (props.gameStarted && props.selectedMovieImages.length && props.dataFetched) {
            return (
                <ImageList
                    cols={5}
                    gap={1}
                    rowHeight='auto'
                    sx={{ width: "95%", margin: "auto" }}
                >
                    {props.selectedMovieImages.map((image) => (
                        <DarkToolTip
                            arrow
                            key={image.previewURL}
                            title={<TooltipTitle>{image.searchTerm}</TooltipTitle>}
                            placement='bottom'
                        >
                            <ImageListItem key={image.previewURL}>
                                <img
                                    alt={image.searchTerm}
                                    loading='lazy'
                                    src={`${image.previewURL}`}
                                />
                            </ImageListItem>
                        </DarkToolTip>
                    ))}
                </ImageList>
            );
        } else if (props.gameStarted && !props.selectedMovieImages.length && !props.dataFetched) {
            return <h2>Loading ...</h2>
        } else {
            return (<></>);
        }
    }

    const displaySelectedMovieText = () => {
        if (!props.selectedMovieImages.length) {
            return 'Please select the correct movie below based on the pictures that load above on game start';
        } else if (props.userSelection) {
            return `Your Selection: ${props.userSelection}`;
        }
        else {
            return 'Please select a movie';
        }
    }

    return (
        <MoviesDiv
            sx={{
                backgroundColor: `${moviesDivBackgroundColor()}`,
                transition: '1.5s'
            }}
        >
            {displaySelectedMovieImages()}

            <h3 className="moviesText">{displaySelectedMovieText()}</h3>

            <form onSubmit={props.handleAnswerSubmit}>
                <FormControl
                    disabled={!props.selectedMovieImages.length || props.winGameEnd}
                    sx={formControlSx}
                >
                    <RadioGroup
                        onChange={props.handleUserSelectionChange}
                        sx={{ margin: "auto" }}
                        value={props.userSelection}
                    >
                        {displayMoviesArrayChoices()}
                    </RadioGroup>

                    <FormHelperText sx={formHelperTextSx}>
                        {props.formHelperText}
                    </FormHelperText>
                </FormControl>
            </form>
        </MoviesDiv >
    )
}
