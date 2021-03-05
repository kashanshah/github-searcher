import React from "react";
import {connect} from "react-redux";
import styles from "./defaultpage.module.css";
import {flushSearchResults, switchLoading} from "../../actions/CommonActions";
import AppTitle from "../../components/AppTitle";
import {Link} from "react-router-dom";
import {SEARCH_PAGE} from "../../common";
import Button from "../../components/Button";

class DefaultPage extends React.Component {

    state = {
    }

    componentDidMount() {
        this.props.flushSearchResults();
        this.props.switchLoading(false);
    }

    render() {
        return (
            <>
                <div className={styles.defaultpage}>
                    <div className={styles.defaultpageFieldWrap}>
                        <AppTitle text={"Search users or repositories"} />
                        <Button><Link to={SEARCH_PAGE} >Click here to begin</Link></Button>
                    </div>
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

export default connect(mapStateToProps, {flushSearchResults, switchLoading})(DefaultPage);