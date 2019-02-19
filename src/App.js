import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import Steps from './components/Steps';
import AboutUs from './components/AboutUs';
import Legal from './components/Legal';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

const themeApp = createMuiTheme({
  palette: {
    primary: {
      light: '#ad33ad',
      main: '#990099',
      dark: '#6b006b',
      contrastText: '#fff',
    },
    secondary: {
      light: '#5b5b5b',
      main: '#333333',
      dark: '#232323',
      contrastText: '#fff',
    },
  },
  typography: {
    fontFamily: ['Roboto', 'sans-serif'].join(','),
    fontSize: 16,
  },
});

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeStep: 0,
      clientId: '754675357649-76ar45tndb0lcbqr59v1hqlm4aea3lrs.apps.googleusercontent.com',
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/slides/v1/rest'],
      scopes:
        'https://www.googleapis.com/auth/presentations https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.photos.readonly',
      inputs: [],
      imagesInputs: [],
      images: [],
      template: [],
      signIn: false,
      selectedTemplate: '',
      loadingHome: true,
      presentationId: '',
      copyId: '',
      open: false,
      uploadedFileId: '',
    };

    this.fileInput = React.createRef();
    this.templateInput = React.createRef();

    this.updateStateLogin = this.updateStateLogin.bind(this);
    this.handleSignoutClick = this.handleSignoutClick.bind(this);
    this.handleInputs = this.handleInputs.bind(this);
    this.handleTripleMoustaches = this.handleTripleMoustaches.bind(this);
    this.handleChangeFile = this.handleChangeFile.bind(this);
    this.handleChangeTemplate = this.handleChangeTemplate.bind(this);
    this.handleTemplate = this.handleTemplate.bind(this);
    this.handleInitInputs = this.handleInitInputs.bind(this);
    this.handleImagesInputs = this.handleImagesInputs.bind(this);
    this.handlePresentationId = this.handlePresentationId.bind(this);
    this.handleCopyId = this.handleCopyId.bind(this);
    this.listSlidesReplace = this.listSlidesReplace.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.uploadImageDrive = this.uploadImageDrive.bind(this);
    this.uploadTemplateDrive = this.uploadTemplateDrive.bind(this);
    this.resetStatus = this.resetStatus.bind(this);
  }

  handleInit = () => {
    this.setState({
      activeStep: 0,
    });
  };

  handleNext = () => {
    this.setState(state => ({
      activeStep: state.activeStep + 1,
    }));
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
      uploadedFileId: '',
    }));
  };

  resetStatus() {
    this.setState({
      uploadedFileId: '',
    });
  }

  handleOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }

  handleInitInputs(data) {
    let newArray = [];
    if (data !== undefined) {
      data.map(item => {
        newArray.push([item, '']);
        return newArray;
      });

      this.setState({
        inputs: newArray,
      });
    }
  }

  handleImagesInputs(data) {
    let newArray = [];
    if (data !== undefined) {
      data.map(item => {
        newArray.push([item, '']);
        return newArray;
      });

      this.setState({
        imagesInputs: newArray,
      });
    }
  }

  handleInputs(e) {
    const target = e.currentTarget.id;
    const value = e.currentTarget.value;
    const { inputs } = this.state;

    let newValue = [];
    newValue = inputs.map(item => {
      if (item[0] === target) {
        item[1] = value;
      }
      return item;
    });

    this.setState({
      inputs: newValue,
    });
  }

  handleTripleMoustaches(idImage, uploadId) {
    let imagesIdArray = [];
    imagesIdArray = this.state.imagesInputs.map(item => {
      if (item[0] === uploadId) {
        item[1] = idImage;
      }
      return item;
    });
    this.setState({
      imagesInputs: imagesIdArray,
    });
  }

  handleChangeTemplate(event) {
    const myFile = event.currentTarget.files[0];
    const url = [];
    url.push(myFile);
    this.setState(
      {
        template: url,
      },
      () => this.uploadTemplateDrive()
    );
  }

  handleClick() {
    this.templateInput.current.click();
  }

  uploadTemplateDrive() {
    let file = this.state.template[0];
    let metadata = {
      name: file.name,
      mimeType: 'application/vnd.google-apps.presentation',
    };
    let accessToken = window.gapi.auth.getToken().access_token;
    let form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);
    var xhr = new XMLHttpRequest();
    xhr.open(
      'post',
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id'
    );
    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    xhr.responseType = 'json';
    xhr.onload = () => {
      let fileId = xhr.response.id;
      this.setState(
        {
          uploadedFileId: fileId,
        },
        () => {
          let message = 'You picked: ' + file.name;
          this.handleTemplate(message);
          this.handleNext();
        }
      );
    };
    xhr.send(form);
  }

  handleChangeFile(event) {
    const myFile = event.currentTarget.files[0];
    const uploadId = event.currentTarget.id;
    const url = [];
    url.push(myFile);
    this.setState(
      {
        images: url,
      },
      () => window.gapi.client.load('drive', 'v2').then(this.uploadImageDrive(uploadId))
    );
  }

  uploadImageDrive(uploadId) {
    let file = this.state.images[0];
    let metadata = {
      name: file.name,
      mimeType: file.type,
    };
    let accessToken = window.gapi.auth.getToken().access_token;
    let form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);
    const xhr = new XMLHttpRequest();
    xhr.open(
      'post',
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id'
    );
    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    xhr.responseType = 'json';
    xhr.send(form);
    xhr.onload = () => {
      const body = {
        value: 'default',
        type: 'anyone',
        role: 'reader',
      };
      const request = window.gapi.client.drive.permissions
        .insert({
          fileId: xhr.response.id,
          resource: body,
        })
        .then(() => {
          let idImage = xhr.response.id;
          this.handleTripleMoustaches(idImage, uploadId);
          return request;
        });
    };
  }

  updateStateLogin(isSignedIn) {
    if (isSignedIn) {
      this.setState({
        signIn: true,
        loadingHome: true,
      });
    } else {
      this.setState({
        signIn: false,
        loadingHome: false,
      });
    }
  }

  handleSignoutClick() {
    window.gapi.auth2.getAuthInstance().signOut();
    this.setState({
      signIn: false,
      loadingHome: false,
    });
  }

  handleTemplate(msg, id) {
    this.setState({
      selectedTemplate: msg,
    });
  }

  handlePresentationId(id) {
    this.setState({
      presentationId: id,
    });
  }

  handleCopyId(id) {
    this.setState(
      {
        copyId: id,
      },
      () => {
        this.listSlidesReplace();
      }
    );
  }

  listSlidesReplace() {
    let requests = [];
    this.state.inputs.map(item => {
      requests.push({
        replaceAllText: {
          containsText: {
            text: `{{${item[0]}}}`,
          },
          replaceText: item[1],
        },
      });
      return requests;
    });
    this.state.imagesInputs.map(item => {
      requests.push({
        replaceAllShapesWithImage: {
          imageUrl:
            item[1] === ''
              ? 'https://drive.google.com/uc?export=view&id=1IbFzcNbWSBs_o1L_fSp3nUWd8JKRbKnj'
              : `https://drive.google.com/uc?export=view&id=${item[1]}`,
          imageReplaceMethod: 'CENTER_INSIDE',
          containsText: {
            text: `{{{${item[0]}}}}`,
            matchCase: false,
          },
        },
      });
      return requests;
    });

    window.gapi.client.slides.presentations
      .batchUpdate({
        presentationId: this.state.copyId,
        requests: requests,
      })
      .then(response => {
        console.log(response);
      });
  }

  render() {
    const {
      discoveryDocs,
      clientId,
      scopes,
      signIn,
      inputs,
      selectedTemplate,
      loadingHome,
      presentationId,
      copyId,
      open,
      imagesInputs,
      activeStep,
      uploadedFileId,
    } = this.state;
    return (
      <React.Fragment>
        <CssBaseline />
        <MuiThemeProvider theme={themeApp}>
          <Switch>
            <Route
              exact
              path="/"
              render={props => (
                <Home
                  clientId={clientId}
                  discoveryDocs={discoveryDocs}
                  scopes={scopes}
                  updateStateLogin={this.updateStateLogin}
                  signIn={signIn}
                  loadingHome={loadingHome}
                  handleOpen={this.handleOpen}
                  handleClose={this.handleClose}
                  open={open}
                />
              )}
            />
            <Route
              path="/steps"
              render={props => (
                <Steps
                  handleSignoutClick={this.handleSignoutClick}
                  signIn={signIn}
                  clientId={clientId}
                  scopes={scopes}
                  handleInputs={this.handleInputs}
                  handleTripleMoustaches={this.handleTripleMoustaches}
                  inputs={inputs}
                  imagesInputs={imagesInputs}
                  selectedTemplate={selectedTemplate}
                  handleTemplate={this.handleTemplate}
                  handleInitInputs={this.handleInitInputs}
                  handleImagesInputs={this.handleImagesInputs}
                  handleChangeFile={this.handleChangeFile}
                  presentationId={presentationId}
                  handlePresentationId={this.handlePresentationId}
                  photos={this.state.images.photos}
                  fakeClick={this.fakeClick}
                  fileInput={this.fileInput}
                  handleCopyId={this.handleCopyId}
                  copyId={copyId}
                  handleOpen={this.handleOpen}
                  handleClose={this.handleClose}
                  open={open}
                  handleBack={this.handleBack}
                  handleNext={this.handleNext}
                  handleInit={this.handleInit}
                  activeStep={activeStep}
                  handleClick={this.handleClick}
                  templateInput={this.templateInput}
                  handleChangeTemplate={this.handleChangeTemplate}
                  uploadedFileId={uploadedFileId}
                  resetStatus={this.resetStatus}
                />
              )}
            />
            <Route
              path="/about"
              render={props => (
                <AboutUs handleOpen={this.handleOpen} handleClose={this.handleClose} open={open} />
              )}
            />
            <Route
              path="/legal"
              render={props => (
                <Legal handleOpen={this.handleOpen} handleClose={this.handleClose} open={open} />
              )}
            />
          </Switch>
        </MuiThemeProvider>
      </React.Fragment>
    );
  }
}

export default App;
