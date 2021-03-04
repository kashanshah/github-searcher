function CardHeader (props) {
    const { image } = props;
    var style = {
        backgroundImage: 'url(' + image + ')',
    };
    return (
        <header style={style} id={image} className="card-header">
            <h4 className="card-header--title">News</h4>
        </header>
    )
}

function Button (props) {
    return (
        <button className="button button-primary">
            <i className="fa fa-chevron-right"></i> Find out more
        </button>
    )
}

function CardBody (props) {
    return (
        <div className="card-body">
            <p className="date">March 20 2015</p>

            <h2>{props.title}</h2>

            <p className="body-content">{props.text}</p>

            <Button />
        </div>
    )
}

function UserCard (props) {
    return (
        <article className="card">
            <CardHeader image={props.image}/>
            <CardBody title={props.title} text={props.text}/>
        </article>
    )
}

export default UserCard;