import React, { Component, Fragment } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { logout as actionLogout } from '@/actions/auth';
import { FormattedMessage } from 'react-intl';
import { Segment } from 'semantic-ui-react';
import TopNav from './TopNav';

const mapStateToProps = ({ auth, user }) => ({ auth, user });
const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(actionLogout()),
});

class ProtectedRoute extends Component {
  isAuthenticated = () => {
    const { auth, logout, user } = this.props;

    if (!auth.isValidAuth) {
      logout();
      return false;
    }

    if (user.exp) {
      if (moment().isAfter(moment.unix(user.exp))) {
        logout();
        return false;
      }
      return true;
    }

    return false;
  }

  render() {
    const { component: Component, user, ...rest } = this.props;
    return (
      <Fragment>
        <TopNav userName={user.username} />
        <Route
          {...rest}
          render={props => (
            this.isAuthenticated() ? (
              <Component {...props} />
            ) : (
              <Redirect to="/accounts/login" />
            )
          )}
        />

        <Segment textAlign="center" raised style={{ margin: '10px 10% 10px 10%' }}>
          <h4>
            <FormattedMessage
              id="app.protected_route.conduct_message"
              description="Rovercode Code of Conduct"
              defaultMessage="All users must follow the "
            />
            <a href="asdf">
              <FormattedMessage
                id="app.protected_route.conduct_link"
                description="Rovercode Code of Conduct"
                defaultMessage="Rovercode Code of Conduct."
              />
            </a>
          </h4>
          <h4>
            <FormattedMessage
              id="app.protected_route.inappropriate_message"
              description="Instructions for what a student should do if they experience harassment"
              defaultMessage="If you see in appropriate behavior or feel you are being harassed, please stop using Rovercode and tell your teacher"
            />
          </h4>
          <h4>
            <FormattedMessage
              id="app.protected_route.teachers_message"
              description="Teacher conduct reporting link"
              defaultMessage="Teachers, visit "
            />
            <a href="asdf">
              <FormattedMessage
                id="app.protected_route.teachers_link"
                description="Teacher conduct reporting link"
                defaultMessage="this page "
              />
            </a>
            <FormattedMessage
              id="app.protected_route.teachers_secondmessage"
              description="Teacher conduct reporting link"
              defaultMessage="to report the issue."
            />
          </h4>
        </Segment>
      </Fragment>
    );
  }
}


ProtectedRoute.propTypes = {
  auth: PropTypes.shape({
    isValidAuth: PropTypes.bool,
  }).isRequired,
  user: PropTypes.shape({
    exp: PropTypes.number,
  }).isRequired,
  component: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  logout: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProtectedRoute);
