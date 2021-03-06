import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import PropTypes from "prop-types";
import CustomCard from "./CustomCard";

class ApiPicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pickerApiLoaded: false,
      oauthToken: '',
      picked: false,
    }

    this.onApiLoad = this.onApiLoad.bind(this);
    this.onPickerApiLoad = this.onPickerApiLoad.bind(this);
    this.handleAuthResult = this.handleAuthResult.bind(this);
    this.createPicker = this.createPicker.bind(this);
    this.pickerCallback = this.pickerCallback.bind(this);
    this.onAuthApiLoad = this.onAuthApiLoad.bind(this);
  }

  onApiLoad() {
    window.gapi.load('auth2', this.onAuthApiLoad);
    window.gapi.load('picker', this.onPickerApiLoad);
    this.props.handleNext();
  }

  onPickerApiLoad() {
    this.setState({
      pickerApiLoaded: true
    });
    this.createPicker();
  }

  onAuthApiLoad() {
    window.gapi.auth.authorize({
      client_id: this.props.clientId,
      scope: this.props.scopes,
      immediate: true
    }, this.handleAuthResult);
  }

  handleAuthResult(authResult) {
    if (authResult && !authResult.error) {
      this.setState({
        oauthToken: authResult.access_token,
      })
      this.createPicker();
    }
  }

  createPicker() {
    let { pickerApiLoaded, oauthToken } = this.state;
    if (pickerApiLoaded && oauthToken) {
      let picker = new window.google.picker.PickerBuilder()
        .addView(window.google.picker.ViewId.PRESENTATIONS)
        .setOAuthToken(oauthToken)
        .setDeveloperKey(process.env.REACT_APP_API_KEY)
        .setCallback(this.pickerCallback)
        .build();
      picker.setVisible(true);
    }
  }

  pickerCallback(data) {
    let templateName = 'nothing selected';
    let templateId = '';
    if (data[window.google.picker.Response.ACTION] === window.google.picker.Action.PICKED) {
      let doc = data[window.google.picker.Response.DOCUMENTS][0];
      templateName = doc.name;
      templateId = doc.id;
      let message = 'You picked: ' + templateName;
      this.props.handleTemplate(message);
      this.props.handlePresentationId(templateId);
      this.setState({
        picked: true,
       });
    }
  }

  render() {
    if (this.state.picked) {
      return <Redirect to='/steps/fill' />
    } else {
      return (
        <CustomCard text="Select Template from Drive" onClick={this.onApiLoad} icon="fab fa-google-drive fa-5x"/>
      );
    }
  }
}

ApiPicker.propTypes = {
  handlePresentationId: PropTypes.func.isRequired,
  handleTemplate: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  clientId: PropTypes.string.isRequired,
  scopes: PropTypes.string.isRequired
};

export default ApiPicker;
