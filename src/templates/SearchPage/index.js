import React from "react";
import {connect} from "react-redux";
import _ from "lodash";
import {createReqParams, isAnHourAgo, notify, SEARCH_TYPES, SEARCH_URL} from "../../common";
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from "./searchpage.module.css";
import axios from "axios";
import Select from "../../components/Select";
import {addSearchResults, switchLoading} from "../../actions/CommonActions";
import UserCard from "../../components/UserCard";
import RepositoryCard from "../../components/RepositoryCard";
import LoadingCard from "../../components/LoadingCard";
import IssueCard from "../../components/IssueCard";
import AppTitle from "../../components/AppTitle";

class SearchPage extends React.Component {

    state = {
        items: [],
        page: 1,
        query: '',
        per_page: 30,
        total_count: 0,
        show_total: false,
        searchType: SEARCH_TYPES[0]
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
            const per_page = this.state.per_page;
            const page = this.state.page;
            if(this.state.page === 1 && this.props.searchResults[searchType] && this.props.searchResults[searchType][q] && !isAnHourAgo(this.props.searchResults[searchType][q].searchedAt)){
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
                createReqParams(SEARCH_URL + '/' + searchType, {q: q, page: page, per_page: per_page}, 'GET', this.cancelToken.token)
                    .then(response => {
                        if(response && response.data){
                            const data = response.data;
                            if(response.data.items){
                                const searchResult = {
                                    [q]: {
                                        ...data,
                                        searchedAt: new Date()
                                    }
                                };
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
                        <AppTitle />
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
                                options={SEARCH_TYPES}
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
                            {this.state.show_total ? <>Total Results: <span className={styles.totalCountSpan}>{this.state.total_count && this.state.total_count}</span></> : '' }
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
                                    <div style={{ padding: '30px 0', textAlign: 'center' }}>
                                        <b>That's all!</b>
                                    </div>
                                }
                            >
                                <div className={"c_row " + (this.state.searchType.value === 'issues' ? styles.issueSearchRow : '')}>
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
                                                    return (
                                                        <div className={styles.resultsItem} key={e.id+index}>
                                                            <IssueCard data={e} />
                                                        </div>
                                                    )
                                                default :
                                                    return ''
                                            }
                                        }) : ''
                                    }
                                </div>
                            </InfiniteScroll>
                            :
                            ''}
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

export default connect(mapStateToProps, {addSearchResults, switchLoading})(SearchPage);