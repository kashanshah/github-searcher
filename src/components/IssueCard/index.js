import React, { Component } from "react";
import styles from "./issuecard.module.css";
import {createReqParams, formatDate, notify, GIT_STATE_COLORS} from "../../common";

function CardHeader (props) {
    const {data} = props;
    var style = {
        backgroundImage: 'url(' + (data.user.avatar_url || '') + ')',
    };
    return (
        <header className={styles.cardHeader}>
            <a href={(data.user.html_url) || '#'} target={"_blank"} rel={"noreferrer"} className={styles.issueAvatarImage} style={{
                ...style,
                fontSize: 0}}>{data.login || ''}</a>
            <div className={styles.cardHeaderContent}>
                <h4 className={styles.cardHeaderTitle}><a className={styles.cardHeaderTitleAnchor} href={data.html_url || '#'} target={"_blank"} rel={"noreferrer"}>#{data.number} <span style={{fontWeight: 400, marginLeft: 7}}>{data.title}</span></a> </h4>
                <div style={{display: "flex"}}>
                    <label className={styles.issueState} style={{backgroundColor: GIT_STATE_COLORS[data.state]}}>
                        <svg height="16" className="octicon octicon-git-pull-request" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zM11 2.5h-1V4h1a1 1 0 011 1v5.628a2.251 2.251 0 101.5 0V5A2.5 2.5 0 0011 2.5zm1 10.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM3.75 12a.75.75 0 100 1.5.75.75 0 000-1.5z" fill="#FFFFFF"></path>
                        </svg>
                        {data.state.toUpperCase()}
                    </label>
                    <label className={styles.commentCount}>
                        <svg className="octicon octicon-git-commit d-none d-md-inline-block" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
                            <path fillRule="evenodd" d="M10.5 7.75a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm1.43.75a4.002 4.002 0 01-7.86 0H.75a.75.75 0 110-1.5h3.32a4.001 4.001 0 017.86 0h3.32a.75.75 0 110 1.5h-3.32z"></path>
                        </svg>
                        {data.comments} Comments
                    </label>
                </div>
                <p style={{marginBottom: 0}}><a className={styles.cardHeaderTitleAnchor} href={data.user.html_url || '#'} style={{fontWeight: 700}} target={"_blank"} rel={"noreferrer"}>{data.user.login}</a> created on {formatDate(new Date(data.created_at))}</p>
            </div>
        </header>
    )
}

class IssueCard extends Component {
    state = {
        showDetails: false,
        userInfo: null,
        loading: false
    }

    loadMoreInfo = (url) => {
        this.setState({
            loading: true
        });
        if(!this.state.loading){
            createReqParams(url)
                .then(response => {
                    this.setState({
                        loading: false
                    });
                    if(response && response.data) {
                        const data = response.data;
                        if(response.data.login){
                            this.setState({
                                userInfo: data,
                                showDetails: true,
                            });
                        }
                        else if(response.data.message){
                            notify(response.data.message);
                        }
                        else{
                            notify('An error occured. Please try again later');
                        }
                    }
                    else{
                        notify('An error occured. Please try again later');
                    }
                })
                .catch(e=> {
                    notify('An error occured. Please try again later');
                    console.warn(e);
                });
        }
    }

    render() {
        const {data} = this.props;
        return (
            <div className={styles.card}>
                <div className={styles.issueCard}>
                    <CardHeader data={data} onButtonClick={e=>{this.loadMoreInfo(data.repository_url)}} showDetails={this.state.showDetails} loading={this.state.loading} />
                    <div className={styles.cardFooter}>
                        <div className={styles.cardFooterInfo}>
                            <div className={styles.cardContent}>
                                <p className={styles.cardDate}><a className={styles.cardHeaderTitleAnchor} href={data.html_url || '#'} target={"_blank"} rel={"noreferrer"}>{data.body || ''}</a></p>
                                <a className={styles.cardHeaderBtn} href={data.html_url || '#'} target={"_blank"} rel={"noreferrer"}>View on Github</a>
                                <div className={styles.cardContentUsername}>{this.state.userInfo && this.state.userInfo.name}</div>
                                <div className={styles.cardContentBio}>{this.state.userInfo && this.state.userInfo.bio}</div>
                                {this.state.userInfo && this.state.userInfo.email ? <div className={styles.cardContentBio}>Email: <strong>{this.state.userInfo && this.state.userInfo.email}</strong></div> : ''}
                                {this.state.userInfo && this.state.userInfo.company ? <div className={styles.cardContentBio}>Company: <strong>{this.state.userInfo && this.state.userInfo.company}</strong></div> : ''}
                                {this.state.userInfo && this.state.userInfo.blog ? <div className={styles.cardContentBio}>Blog: <strong>{this.state.userInfo && this.state.userInfo.blog}</strong></div> : ''}
                                {this.state.userInfo && this.state.userInfo.location ? <div className={styles.cardContentBio}>Location: <strong>{this.state.userInfo && this.state.userInfo.location}</strong></div> : ''}
                                {this.state.userInfo && this.state.userInfo.twitter_username ? <div className={styles.cardContentBio}>Twitter: <strong>{this.state.userInfo && this.state.userInfo.twitter_username}</strong></div> : ''}
                            </div>
                        </div>
                    </div>
                    <div className={styles.cardLoadMoreContent + " " + (this.state.showDetails ? styles.cardLoadMoreContentActive : '')}>
                        <div className={styles.cardFooter}>
                            <div className={styles.cardFooterInfo}>
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <svg className="octicon octicon-people text-gray-light" height="16" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true" style={{display: 'flex', alignItems: 'center', marginRight: 5}}>
                                        <path fillRule="evenodd"
                                              d="M5.5 3.5a2 2 0 100 4 2 2 0 000-4zM2 5.5a3.5 3.5 0 115.898 2.549 5.507 5.507 0 013.034 4.084.75.75 0 11-1.482.235 4.001 4.001 0 00-7.9 0 .75.75 0 01-1.482-.236A5.507 5.507 0 013.102 8.05 3.49 3.49 0 012 5.5zM11 4a.75.75 0 100 1.5 1.5 1.5 0 01.666 2.844.75.75 0 00-.416.672v.352a.75.75 0 00.574.73c1.2.289 2.162 1.2 2.522 2.372a.75.75 0 101.434-.44 5.01 5.01 0 00-2.56-3.012A3 3 0 0011 4z"></path>
                                    </svg>
                                    <span>{this.state.userInfo && this.state.userInfo.followers}</span>
                                </div>
                                <div className={styles.label}> Followers</div>
                            </div>
                            <div className={styles.cardFooterInfo}>
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <svg className="octicon octicon-people text-gray-light" height="16" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true" style={{display: 'flex', alignItems: 'center', marginRight: 5}}>
                                        <path fillRule="evenodd" d="M5.5 3.5a2 2 0 100 4 2 2 0 000-4zM2 5.5a3.5 3.5 0 115.898 2.549 5.507 5.507 0 013.034 4.084.75.75 0 11-1.482.235 4.001 4.001 0 00-7.9 0 .75.75 0 01-1.482-.236A5.507 5.507 0 013.102 8.05 3.49 3.49 0 012 5.5zM11 4a.75.75 0 100 1.5 1.5 1.5 0 01.666 2.844.75.75 0 00-.416.672v.352a.75.75 0 00.574.73c1.2.289 2.162 1.2 2.522 2.372a.75.75 0 101.434-.44 5.01 5.01 0 00-2.56-3.012A3 3 0 0011 4z"></path>
                                    </svg>
                                    <span>{this.state.userInfo && this.state.userInfo.following}</span>
                                </div>
                                <div className={styles.label}> Following</div>
                            </div>
                            <div className={styles.cardFooterInfo}>
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <svg className="octicon octicon-repo UnderlineNav-octicon hide-sm" height="16" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true" style={{display: 'flex', alignItems: 'center', marginRight: 5}}>
                                        <path fillRule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"></path>
                                    </svg>
                                    <span>{this.state.userInfo && this.state.userInfo.public_repos}</span>
                                </div>
                                <div className={styles.label}>Repositories</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default IssueCard;