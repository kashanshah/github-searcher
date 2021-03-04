import styles from "./loadingcard.module.css";

function CardHeader (props) {
    const { image } = props;
    var style = {
        backgroundImage: 'url(' + image + ')',
    };
    return (
        <header id={image} className={styles.cardHeader}>
            <div className={styles.repoAvatarImage} style={style}></div>
            <div>
                <h4 className={styles.cardHeaderTitle}>&nbsp;</h4>
                <p className={styles.cardDate}>&nbsp;</p>
            </div>
        </header>
    )
}

function LoadingCard (props) {
    return (
        <article className={styles.repositoryCard}>
            <CardHeader />
        </article>
    )
}

export default LoadingCard;