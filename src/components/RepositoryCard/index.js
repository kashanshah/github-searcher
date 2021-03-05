import styles from "./repositorycard.module.css";
import colors from "./colors.json";
import {formatDate} from "../../common";
import Button from "../Button";

function CardHeader (props) {
    var style = {
        backgroundImage: 'url(' + ((props.owner && props.owner.avatar_url) || '') + ')',
    };
    return (
        <header className={styles.cardHeader}>
            <a href={(props.owner && props.owner.html_url) || '#'} target={"_blank"} rel={"noreferrer"} className={styles.repoAvatarImage} style={{
                ...style,
                fontSize: 0}}>{props.owner.login || ''}</a>
            <div>
                <h4 className={styles.cardHeaderTitle}><a className={styles.cardHeaderTitleAnchor} href={props.owner.html_url || '#'} target={"_blank"} rel={"noreferrer"}>{props.owner.login || ''}</a></h4>
                <p className={styles.cardDate}><a className={styles.cardHeaderTitleAnchor} href={props.owner.html_url || '#'} target={"_blank"} rel={"noreferrer"}>{props.owner.html_url || ''}</a></p>
            </div>
        </header>
    )
}

function CardBody (props) {
    return (
        <div className={styles.cardBody}>

            <h2 className={styles.cardBodyTitle}><a className={styles.cardBodyTitleAnchor} href={props.link || '#'} target={"_blank"} rel={"noreferrer"}>{props.title}</a></h2>

            <p className={styles.cardBodyContent}>{props.text}</p>
            <div className={styles.cardMetaInfoDiv}>
                <div className={styles.starInfo}>
                    <svg className="octicon octicon-star mr-1" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
                        <path fillRule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path>
                    </svg>
                    <span className={styles.cardStarCount}>{props.stars}</span>
                </div>
                <div className={styles.forkInfo}>
                    <svg className="octicon octicon-repo-forked" viewBox="0 0 16 16" version="1.1" width="16"
                         height="16" aria-hidden="true">
                        <path fillRule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path>
                    </svg>
                    <span className={styles.cardForkCount}>{props.forks_count}</span>
                </div>
                <div className={styles.lastCommitInfo}>
                    <svg className="octicon octicon-repo-forked" viewBox="0 0 490 490" version="1.1" width="16"
                         height="16" aria-hidden="true">
		<path d="M245,0C109.5,0,0,109.5,0,245s109.5,245,245,245s245-109.5,245-245S380.5,0,245,0z M245,449.3
			c-112.6,0-204.3-91.7-204.3-204.3S132.4,40.7,245,40.7S449.3,132.4,449.3,245S357.6,449.3,245,449.3z"/>
        <path d="M290.9,224.1h-25v-95.9c0-11.5-9.4-20.9-20.9-20.9s-20.9,9.4-20.9,20.9V245c0,11.5,9.4,20.9,20.9,20.9h45.9
			c11.5,0,20.9-9.4,20.9-20.9S302.3,224.1,290.9,224.1z"/></svg>
                    <span className={styles.lastCommitInfoText}>{formatDate(new Date(props.updated_at))}</span>
                </div>
            </div>
            {
                props.language ?
                    <div className={styles.languageInfo}>
                        <span className={styles.languageIcon} style={{backgroundColor: colors[props.language] ? colors[props.language].color : '#000'}}></span>
                        <a href={props.link + "/search?l=" + props.language} className={styles.cardStarCount} target={"_blank"} rel={"noreferrer"}>{props.language}</a>
                    </div>
                    :
                    ''
            }
            <Button>
                <a href={props.link} target={"_blank"} rel={"noreferrer"}>Find out more</a>
            </Button>
        </div>
    )
}

function RepositoryCard (props) {
    return (
        <div className={styles.card}>
            <div className={styles.repositoryCard}>
                <CardHeader owner={props.data.owner} full_name={props.data.full_name} pushed_at={props.data.pushed_at} />
                <CardBody title={props.data.name} link={props.data.html_url} text={props.data.description} forks_count={props.data.forks_count} stars={props.data.stargazers_count} language={props.data.language} languages_url={props.data.languages_url} updated_at={props.data.updated_at}/>
            </div>
        </div>
    )
}

export default RepositoryCard;