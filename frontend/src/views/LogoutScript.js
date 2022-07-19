import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { logoutUser } from "../reduxActions/authActions";

class Logout extends React.Component {
    componentDidMount() {
        this.props.logoutUser();
    }
    render() {
        return <p></p>;
    }
}


Logout.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
    auth: state.auth
});
export default connect(
    mapStateToProps,
    { logoutUser }
)(Logout);