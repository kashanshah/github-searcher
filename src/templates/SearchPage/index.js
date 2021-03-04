import React from "react";
import {connect} from "react-redux";
import _ from "lodash";
import {createReqParams, notify, SEARCH_URL} from "../../common";
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from "./searchpage.module.css";
import axios from "axios";
import Select from "../../components/Select";
import {addSearchResults, flushSearchResults, switchLoading} from "../../actions/CommonActions";
import UserCard from "../../components/UserCard";
import RepositoryCard from "../../components/RepositoryCard";
import LoadingCard from "../../components/LoadingCard";

class SearchPage extends React.Component {

    state = {
        items: [],
        page: 1,
        query: 'kashan',
        per_page: 30,
        total_count: 0,
        show_total: false,
        searchType: {value: 'users', label: 'Users'}
    }

    componentDidMount() {
        this.fetchData();
        this.props.switchLoading(false);
    }

    cancelToken;

    fetchData =  _.debounce((isNext = false) => {
        if(!isNext){
            this.setState({
                page: 1,
            });
        }
        if (typeof this.cancelToken != typeof undefined) {
            this.cancelToken.cancel("Operation canceled due to new request.");
        }
        this.cancelToken = axios.CancelToken.source();
        if(this.state.query.length >= 3){
            if(!isNext){
                this.props.switchLoading(true);
            }
            const q = this.state.query;
            const searchType = this.state.searchType.value;
            if(this.props.searchResults[searchType] && this.props.searchResults[searchType][q] && this.state.page === 1){
                this.setState({
                    page: this.state.page + 1,
                    items: this.props.searchResults[searchType][q].items,
                    total_count: this.props.searchResults[searchType][q].total_count,
                    show_total: true
                });
                this.props.switchLoading(false);
            }
            else {
                this.setState({
                    show_total: false
                });
                createReqParams(SEARCH_URL + '/' + searchType, {q: q, page: this.state.page, per_page: this.state.per_page}, 'GET', this.cancelToken.token)
                    .then(response => {
                        if(response && response.data){
                            const data = response.data;
                            if(response.data.items){
                                const searchResult = {};
                                searchResult['' + q] = data;
                                if(this.state.page === 1) {
                                    this.props.addSearchResults(searchResult, searchType);
                                }
                                this.setState({
                                    page: this.state.page + 1,
                                    items: isNext ? this.state.items.concat(data.items) : data.items,
                                    total_count: data.total_count,
                                    show_total: true
                                });
                                this.props.switchLoading(false);
                            }
                            else if(response.data.message){
                                notify(response.data.message);
                            }
                            else{
                                notify('An error occured. Please try again later');
                            }
                        }
                    })
                    .catch(e=> {
                        notify('An error occured. Please try again later');
                        this.props.switchLoading(false);
                        console.warn(e);
                    });
            }
        }
        else{
            this.resetResults();
            this.props.switchLoading(false);
        }
    }, 500);

    resetResults = e => {
        this.setState({
            page: 1,
            items: [],
            total_count: 0,
            show_total: false
        });
    }

    showLoading = () => {
        return (
            <div className={"c_row"}>
                <div className={styles.resultsItem}>
                    <LoadingCard />
                </div>
                <div className={styles.resultsItem}>
                    <LoadingCard />
                </div>
            </div>
        )
    }

    render() {
        return (
            <>
                <div className={styles.searchpage + " " + (this.state.query.length >= 3 ? styles.searchpageActive : '')}>
                    <div className={styles.searchpageFieldWrap + " " + (this.state.query.length >= 3 ? styles.searchpageFieldWrapActive : '')}>
                        <div className={styles.searchpageFieldDiv}>
                            <div className={styles.searchpageFieldIcon}>
                                <svg version="1.1" viewBox="0 0 16 16"
                                     className="octicon octicon-mark-github" aria-hidden="true">
                                    <path fillRule="evenodd"
                                          d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                                </svg>
                            </div>
                            <div>
                                <h2 className={styles.searchpageFieldHeading}>Github Searcher</h2>
                                <h3 className={styles.searchpageFieldText}>Search users or repositories below</h3>
                            </div>
                        </div>
                        <div className={styles.searchboxDiv}>
                            <input
                                className={styles.searchboxInput}
                                type={"text"}
                                placeholder={"Start typing to search .."}
                                value={this.state.query}
                                onChange={e => {
                                    this.setState({query: e.target.value});
                                    this.fetchData();
                                }}
                            />
                            <Select
                                className={styles.searchboxSelect}
                                name="searchType"
                                id="searchType"
                                styles
                                options={[
                                    {value: 'users', label: 'Users'},
                                    {value: 'repositories', label: 'Repositories'},
                                    {value: 'issues', label: 'Issues'}
                                ]}
                                value={this.state.searchType}
                                onChange={e => {
                                    this.resetResults();
                                    this.setState({
                                        searchType: e
                                    });
                                    if(this.state.query.length >= 3){
                                        this.props.switchLoading(true);
                                        this.fetchData();
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.searchResults + " c_container"}>
                    <div className={styles.totalCount + " c_row"}>
                        <div className="c_col">
                            {this.state.show_total ? <>Total Results: <span className={styles.totalCountSpan}>{this.state.total_count && this.state.total_count}</span></> : <span>&nbsp;</span> }
                        </div>
                    </div>
                    {this.props.isLoading ?
                        this.showLoading()
                        :
                        this.state.items.length > 0 ?
                            <InfiniteScroll
                                dataLength={this.state.items.length} //This is important field to render the next data
                                next={e=> this.fetchData(true)}
                                hasMore={(this.state.items.length < this.state.total_count)}
                                loader={this.showLoading()}
                                endMessage={
                                    <p style={{ textAlign: 'center' }}>
                                        <b>Yay! You have seen it all</b>
                                    </p>
                                }
                            >
                                <div className={"c_row"}>
                                    {
                                        this.state.items ? this.state.items.map((e, index) => {
                                            switch (this.state.searchType.value) {
                                                case "users":
                                                    return (
                                                        <div className={styles.resultsItem} key={e.id+index}>
                                                            <UserCard data={e} />
                                                        </div>
                                                    )
                                                case "repositories":
                                                    return (
                                                        <div className={styles.resultsItem} key={e.id+index}>
                                                            <RepositoryCard data={e} />
                                                        </div>
                                                    )
                                                case "issues":
                                                    return <div className={styles.resultsItem}><UserCard key={e.id+index} /></div>
                                                default :
                                                    return ''
                                            }
                                        }) : ''
                                    }
                                </div>
                            </InfiniteScroll>
                            :
                            ''}
                    <span onClick={this.props.flushSearchResults}>Empty Cached Results</span>
                </div>
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        isLoading: state.common.isLoading,
        searchResults: state.common.searchResults,
    }
};

export default connect(mapStateToProps, {addSearchResults, flushSearchResults, switchLoading})(SearchPage);