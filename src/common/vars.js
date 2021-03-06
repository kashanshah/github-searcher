export const API_BASE_URL = 'https://api.github.com';
export const SEARCH_URL = API_BASE_URL + '/search';

export const DEFAULT_ERROR_MSG = 'An error occurred. Please try again later';

export const ENTITY_TYPES = [
    {value: 'users', label: 'Users'},
    {value: 'repositories', label: 'Repositories'},
    {value: 'issues', label: 'Issues'}
];
export const GIT_STATE_COLORS = {
    draft: "#6a737d",
    open: "#28a745",
    merged: "#6f42c1",
    closed: "#d73a49",
}

export const SEARCH_PAGE = "/search";
export const DEFAULT_PAGE = "/";
