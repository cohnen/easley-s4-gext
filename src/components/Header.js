import React, { Component } from "react";
import logoHeader from '../images/logo__gext_header.png';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import btn_google from '../images/btn_google.svg';
import Button from '@material-ui/core/Button';
import SimpleModal from './SimpleModal';


class Header extends Component {
  render() {
    return (
      <header className="header-container fluid-container row">
        <div className="header__logo col-auto mr-auto">
          <Link to="/"><img src={logoHeader} alt="Gext logo"></img></Link>
        </div>
        <button type="button" className="btn-signout btn btn-light" onClick={this.props.handleSignoutClick}><img src={btn_google} className="google-logo" alt="google logo" />Sign Out</button>
        <div className="header__link col-auto">
          <Button onClick={this.props.handleOpen}>How it works</Button>
        </div>
        <SimpleModal
              open={this.props.open}
              handleClose={this.props.handleClose}/>
      </header>
    );
  }
}
Header.propTypes={
  handleSignoutClick: PropTypes.func
}

export default Header;
