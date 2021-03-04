import {
    LOADING_SWITCH, ADD_SEARCH_RESULTS, FLUSH_SEARCH_RESULTS
} from "../actions/types";

const INITIAL_STATE = {
    searchResults: {},
    isLoading: null
};

export const CommonReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LOADING_SWITCH:
            return {
                ...state,
                isLoading: action.payload,
            }
        case ADD_SEARCH_RESULTS:
            return {
                ...state,
                searchResults: {
                    ...state.searchResults,
                    [action.payload.searchType]: {
                        ...state.searchResults[action.payload.searchType],
                        ...action.payload.searchResults
                    }
                },
            }
        case FLUSH_SEARCH_RESULTS:
            alert();
            return {
                ...state,
                searchResults: [],
            }
        default:
            return {...state};
    }
}
