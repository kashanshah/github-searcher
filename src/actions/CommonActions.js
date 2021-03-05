import {
    DISPLAY_MESSAGE,
    LOADING_SWITCH, ADD_SEARCH_RESULTS, FLUSH_SEARCH_RESULTS,
} from "./types";

export const switchLoading = (isLoading) => {
    return (dispatch) => {
        dispatch({
            type: LOADING_SWITCH,
            payload: isLoading
        });
    }
};

export const displayMessage = (data) => {
    return (dispatch) => {
        dispatch({
            type: DISPLAY_MESSAGE,
            payload: {
                code: data.code,
                message: data.message
            }
        });
    }
};

export const addSearchResults = (searchResults, searchType = 'users') => {
    return (dispatch) => {
        dispatch({
            type: ADD_SEARCH_RESULTS,
            payload: {
                searchResults,
                searchType,
            }
        });
    }
};

export const flushSearchResults = () => {
    return (dispatch) => {
        dispatch({
            type: FLUSH_SEARCH_RESULTS,
        });
    }
};

