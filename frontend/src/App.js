
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ScrollToTop from "scrollToTop";
import ReactGA from 'react-ga';
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./reduxActions/authActions";

import "public/style/styleGuidelines.css"

import { Provider } from "react-redux";
import reduxStore from "./reduxStore";


import PredefItems from "views/PredefItems";

import Home from "views/Warzone";
import Index from "views/Warzone";
import Page404 from "views/Page404";
import LaunchLandingPage from "views/launchLandingPage.js";
import AboutUs from "views/AboutUs.js";
import TermsPrivacy from "views/TermsPrivacy.js";
import Login from "views/Login.js";
import Signup from "views/Signup.js";
import Profile from "views/Profile.js";
import ListingPage from "views/ListingPage.js";
import Saved from "views/Saved.js";
import OrderHistory from "views/orderHistory.js";
import Listings from "views/listings.js";
// import ContactUs from "views/ContactUs.js";

import PublicRoute from "./utils/PublicOnlyRoute";
import PrivateRoute from "./utils/PrivateRoute";



import EmployeeDashboard from "./employeeScripts/views/Dashboard.js";




import ActivityMobile from "views/ActivityPageMobile";
import BlogPost from "views/BlogPost.js";
import Community from "views/Community";
import AccountSetup from "views/AccountSetup";
import PaymentInstructions from "views/PaymentInstructions";
import StripePayment from "views/StripePayment.js";
import ProfileLinks from "./views/ProfileLinks";
import Account from "./views/Account";
import Following from "./views/following.js";
import NewListing from "./views/NewListing.js";
import Search from "./views/Search.js"

import Warzone from "./views/Warzone";

import LogoutScript from "./views/LogoutScript"
import VerifyListing from "./views/VerifyListing";



ReactGA.initialize('UA-180599599-1');




// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  reduxStore.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    reduxStore.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "./login";
  }
}


function MainApp(props) {
  return (
    <Provider store={reduxStore}>
      <Router>
        <ScrollToTop>
          <Switch>

            <PublicRoute exact path="/" component={LaunchLandingPage} />
            <PublicRoute exact path="/index" component={Index} />

            <Route exact path="/predefItems" component={PredefItems} />

            <Route exact path="/about-us" render={props => { ReactGA.pageview(props.location.pathname); return <AboutUs {...props} /> }} />
            <Route exact path="/terms-privacy" render={props => { ReactGA.pageview(props.location.pathname); return <TermsPrivacy {...props} /> }} />
            <Route exact path="/login" render={props => { ReactGA.pageview(props.location.pathname); return <Login {...props} /> }} />
            <Route exact path="/signup" render={props => { ReactGA.pageview(props.location.pathname); return <Signup {...props} /> }} />

            <Route exact path="/user" render={props => { ReactGA.pageview(props.location.pathname); return <Profile {...props} /> }} />
            <Route exact path="/listing" render={props => { ReactGA.pageview(props.location.pathname); return <ListingPage {...props} /> }} />
            <Route exact path="/search" render={props => { ReactGA.pageview(props.location.pathname); return <Search {...props} /> }} />
            <Route exact path="/activity" render={props => { ReactGA.pageview(props.location.pathname); return <ActivityMobile {...props} /> }} />


            <Route exact path="/warzone" render={props => { ReactGA.pageview(props.location.pathname); return <Warzone {...props} /> }} />



            {/* <Route exact path="/payment" render={props => { ReactGA.pageview(props.location.pathname); return <StripePayment {...props} /> }} /> */}

            <Route exact path="/faq" render={props => { ReactGA.pageview(props.location.pathname); return <Community {...props} /> }} />
            <Route exact path="/blog-post/:id" render={props => { ReactGA.pageview(props.location.pathname); return <BlogPost {...props} /> }} />

            <Route exact path="/employee-dashboard" render={props => { ReactGA.pageview(props.location.pathname); return <EmployeeDashboard {...props} /> }} />

            <PrivateRoute exact path="/logout" component={LogoutScript} />
            <PrivateRoute exact path="/pay" component={StripePayment} />
            <PrivateRoute exact path="/verifyListing" component={VerifyListing} />
            <PrivateRoute exact path="/payment-details" component={PaymentInstructions} />
            <PrivateRoute exact path="/profile" component={ProfileLinks} />
            <PrivateRoute exact path="/account-setup" component={AccountSetup} />
            <PrivateRoute exact path="/home" component={Home} />
            <PrivateRoute exact path="/my-purchases" component={OrderHistory} />
            <PrivateRoute exact path="/my-listings" component={Listings} />
            <PrivateRoute exact path="/saved" component={Saved} />
            <PrivateRoute exact path="/account" component={Account} />
            <PrivateRoute exact path="/following" component={Following} />
            <PrivateRoute exact path="/new-listing" component={NewListing} />

            {/* <Route exact path="/contact-us" render={props => { ReactGA.pageview(props.location.pathname); return <ContactUs {...props} /> }} /> */}

            <Route path="*" render={props => { ReactGA.pageview(props.location.pathname); return <Page404 {...props} /> }} />
          </Switch>
        </ScrollToTop>
      </Router>
    </Provider >
  );
}

export default MainApp;
