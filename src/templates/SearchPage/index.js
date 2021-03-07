import React from "react";
import {connect} from "react-redux";
import _ from "lodash";
import {createReqParams, isAnHourAgo, notify, ENTITY_TYPES, SEARCH_URL, DEFAULT_ERROR_MSG} from "../../common";
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
import Button from "../../components/Button";

class SearchPage extends React.Component {

    state = {
        items: [],
        page: 1,
        query: '',
        per_page: 30,
        total_count: 0,
        show_total: false,
        show_retry: false,
        entityType: ENTITY_TYPES[0]
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
            const entityType = this.state.entityType.value;
            const per_page = this.state.per_page;
            const page = this.state.page;
            if(this.state.page === 1 && this.props.searchResults[entityType] && this.props.searchResults[entityType][q] && !isAnHourAgo(this.props.searchResults[entityType][q].searchedAt)){
                this.setState({
                    page: this.state.page + 1,
                    items: this.props.searchResults[entityType][q].items,
                    total_count: this.props.searchResults[entityType][q].total_count,
                    show_total: true
                });
                this.props.switchLoading(false);
            }
            else {
                this.setState({
                    show_total: false
                });
                createReqParams(SEARCH_URL + '/' + entityType, {q: q, page: page, per_page: per_page}, 'GET', this.cancelToken.token)
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
                                    this.props.addSearchResults(searchResult, entityType);
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
                                console.log("HEREH", this.state.items.length)
                                notify(response.data.message);
                                this.setState({
                                    total_count: this.state.items.length,
                                    show_total: false,
                                    show_retry: true
                                });
                                this.props.switchLoading(false);
                            }
                            else{
                                notify(DEFAULT_ERROR_MSG);
                                this.props.switchLoading(false);
                            }
                        }
                    })
                    .catch(e=> {
                        notify(DEFAULT_ERROR_MSG);
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
                <div className={styles.searchpage + " " + (this.state.query.length >= 3 && styles.searchpageActive)}>
                    <div className={styles.searchpageFieldWrap + " " + (this.state.query.length >= 3 && styles.searchpageFieldWrapActive)}>
                        <AppTitle />
                        <div className={styles.searchboxDiv}>
                            <div className={styles.inputWrapper}>
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
                            </div>
                            <Select
                                className={styles.searchboxSelect}
                                name="entityType"
                                id="entityType"
                                styles
                                options={ENTITY_TYPES}
                                value={this.state.entityType}
                                onChange={e => {
                                    this.resetResults();
                                    this.setState({
                                        entityType: e
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
                            {this.state.show_total && <>Total Results: <span className={styles.totalCountSpan}>{this.state.total_count && this.state.total_count}</span></>}
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
                                    this.state.show_retry ?
                                        <div style={{ padding: '30px 0', textAlign: 'center' }}>
                                            <Button><span onClick={e=> {
                                                this.setState({
                                                    total_count: this.state.total_count + 1,
                                                    show_retry: false
                                                });
                                                this.fetchData(true);
                                            }}>Retry</span></Button>
                                        </div>
                                        :
                                        <div style={{ padding: '30px 0', textAlign: 'center' }}>
                                            <b>That's all!</b>
                                        </div>
                                }
                            >
                                <div className={"c_row " + (this.state.entityType.value === 'issues' && styles.issueSearchRow)}>
                                    {
                                        this.state.items && this.state.items.map((e, index) => {
                                            switch (this.state.entityType.value) {
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
                                        })
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