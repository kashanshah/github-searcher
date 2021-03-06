# `Coding Task:` [Github Searcher](https://test.kashanshah.com)

## Overview

Github Searcher is a simple single page application built with [React JS](https://reactjs.org).

The project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Production Link:

The project's is also deployed at this link for viewing purpose: [test.kashanshah.com](https://test.kashanshah.com)

## Task Details:

Even though the requirements may be done with a single route, but since react router was a requirement, therefore, using [React Router Dom](https://github.com/ReactTraining/react-router) I have created 2 routes:
1. `/`: Default route 
1. `/search`: Search Page route

On search page, there are two inputs, i.e. search field, to enter the search keyword; and the dropdown where user can pick "User", "Repository" or "Issues" to define the entities that he want to search.

When a user types 3 or more characters, based on the Entity type dropdown value, the search results are fetched from [github API](https://docs.github.com/en/rest/reference/search) and displayed to the user. **30 results** per hit has been rendered, with **infinite scrolling** untill all the results are displayed.

For easily making the API calls, [axios](https://www.npmjs.com/package/axios) has been used which is wrapped in a custom developed function `createReqParams` in [functions.js](./src/common/functions.js#L4). To avoid the unnecessary API calls, [debouncing is also implemented](src/templates/SearchPage/index.js#L35) using [lodash](https://lodash.com/). In case a search api call is in the queue, [the new API call cancels the previous call](./src/templates/SearchPage/index.js#L41) and then makes a new one.

For dropdown, [React Select](https://react-select.com/) has been used. While for infinite scrolling, [React Infinite Scroll Component](https://www.npmjs.com/package/react-infinite-scroll-component) has been used.

The first 30 results against each searched keyword are also stored in redux store, through [redux-persist](https://www.npmjs.com/package/redux-persist). The cached results are flushed when the default route `/` is mounted. 

Before calling the API, the [application first checks](./src/templates/SearchPage/index.js#L53) the redux store for the results against the typed keyword. If the result is present, the application checks if the cached data is not older than an hour. If the data is not an hour older, it displays the data from redux store, otherwise a new API call is executed to get refreshed data.

As mentioned in the [Github Documentation](https://docs.github.com/en/rest/reference/search#rate-limit), it allows **10 requests per minute** while searching for any keyword. Therefore, whenever the API calls exceeds than the allowed number, it displays the error and a **Retry** button appears so that the user may wait and retry again to continue the search.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\

### `npm run build`

Builds the app for production to the `build` folder.\

### Other Links

* [www.kashanshah.com](https://www.kashanshah.com)
* [www.greenlightlabs.tech](https://www.greenlightlabs.tech)
* [neom-react.trafficdemos.com](http://neom-react.trafficdemos.com/)
* *LinkedIn:* [ https://www.linkedin.com/in/kashanshah/](https://www.linkedin.com/in/kashanshah/)
