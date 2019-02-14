import React, { Component } from "react";
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import ReactLoading from 'react-loading';

let keywords = [];
let eraseMoustache;
let eraseTripleMoustache;

class Fill extends Component {
  constructor(props) {
    super(props);

    this.state={
      loadingForm: true,
      moustachesArray: [],
      tripleMoustachesArray: []
    }

    /*this.loadSlidesApi = this.loadSlidesApi.bind(this);*/
    this.listSlides = this.listSlides.bind(this);

    this.loadSlidesReplace = this.loadSlidesReplace.bind(this);
    this.listSlidesReplace = this.listSlidesReplace.bind(this);
  }

  componentDidMount() {
    this.loadSlidesApi();

  }

  loadSlidesApi() {
    if(this.props.presentationId !== '') {
      window.gapi.client.load('slides', 'v1').then(this.listSlides);
    }
  }

  loadClient() {
    console.log('soy loadclient');
    return window.gapi.client.load("https://www.googleapis.com/discovery/v1/apis/slides/v1/rest")
        .then(this.execute)
  }

  execute() {
    console.log('soy execute');
    console.log(window.gapi.client.drive);
    return window.gapi.client.drive.files.copy({
      "fileId": "1C3ThRHIdUdcgMKtsEAhEyOfYFmJcHHFHrXZX3QrxkXY",
      "resource": {}
    })
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
              },
              function(err) { console.error("Execute error", err); })
        .then(this.listSlides())
  }

  listSlides() {
    window.gapi.client.slides.presentations.get({
      presentationId : this.props.presentationId
    }).then(response => {
      let presentation = response.result;
      let moustaches = JSON.stringify(presentation).match(/(?<!{){{\s*[\w]+\s*}}(?!})/g);
      let tripleMoustaches = JSON.stringify(presentation).match(/(?<!{){{{\s*[\w\.]+\s*}}}(?!})/g);
      eraseMoustache = moustaches.map(item =>item.replace('{{','').replace('}}',''));
      eraseTripleMoustache= tripleMoustaches.map(item=>item.replace('{{{','').replace('}}}',''));
      this.setState({moustachesArray: [...keywords, ...eraseMoustache]});
      this.setState({tripleMoustachesArray: [...keywords, ...eraseTripleMoustache]});
      console.log('hola');
      console.log(eraseTripleMoustache);

      this.props.handleInitInputs(this.state.moustachesArray);
      this.props.handleImagesInputs(this.state.tripleMoustachesArray);
    });
  }

  loadSlidesReplace() {
    if(this.props.presentationId !== '') {
      window.gapi.client.load('slides', 'v1').then(this.listSlidesReplace);
    }
  }

  listSlidesReplace() {
    let t = this.execute;
    setTimeout(function(){
      // Esto lo hacemos para cambiar los permisos de una imagen subida a GDrive.
      var body = {
        'value': "default",
        'type': "anyone",
        'role': "reader"
      };
      var request = window.gapi.client.drive.permissions.insert({
        'fileId': "1NwwRePCedmhsCPqvLuBnJd-oY3IyXTHo",
        'resource': body
      });
      request.execute(function(resp) { console.log(resp);
      console.log('Oleee');});
    },2000);

    setTimeout(function(){
      t();
    },5000);


    let requests = [];
    this.props.imagesInputs.requests.push({
      replaceAllShapesWithImage: {
        imageUrl:'https://drive.google.com/uc?export=view&id=1NwwRePCedmhsCPqvLuBnJd-oY3IyXTHo',
        imageReplaceMethod: 'CENTER_CROP',
        containsText:{
          text: '{{{logo}}}',
          matchCase: false
        }
      }
    });
    this.props.inputs.map(item => {
      requests.push({
        replaceAllText: {
          containsText: {
            text: `{{${item[0]}}}`
          },
          replaceText: item[1]
        }
      });
      return requests;
    });

    window.gapi.client.slides.presentations.batchUpdate({
      presentationId: this.props.presentationId,
      requests: requests
    }).then((response) => {
      console.log(response);
    });
  }

  paintForm() {
    const {handleInputs, handleChangeFile, fileInput, fakeClick} = this.props;
    if (this.state.moustachesArray.length > 0){
      return(
        <form>
          {this.state.moustachesArray.map(item => {
            return (
              <div key={item} className="form-group">
                <label htmlFor={item}>{item.toUpperCase()}:</label>
                <input className="form-control " id={item} type="text" onKeyUp={handleInputs} />
              </div>
            );
            })
          }
          {this.state.tripleMoustachesArray.map(item=>{
            return (
              <div key={item} className="form-group">
                    <label htmlFor={item}>{item.toUpperCase()}:</label>
                    <input className="form-control " id={item} type="file" ref={fileInput} onChange={handleChangeFile} />
                    <button className="btn__img--false" type="button" onClick={fakeClick}></button>
                  </div>
            );
          })
          }
        </form>
      )
    } else {
        return(<div className="errorMessage">Sorry but your template has not any keyword to create a form. Please review our 'How to use' section</div>)
    }
  }

  render() {
    const { selectedTemplate} = this.props;
    if (this.state.moustachesArray){

      return (
        <div className="fill-page">
          <div className="fill-template__result">
            <div id="result">{selectedTemplate}</div>
            <div className="fill-page__btn back-btn">
                <button type="button" className="btn btn-light"><Link to="/steps/choose">Choose another template</Link></button>
            </div>
          </div>
          <div className="fill-page__form">
          {this.paintForm()}
          </div>
          <div className="row d-flex justify-content-around">
            <div className="fill-page__btn back-btn">
              <Link to="/steps/choose"><button type="button" className="btn btn-light">Back</button></Link>
              <div className="fill-page__btn next-btn">
                <Link to="/steps/success"><button type="button" className="btn btn-light" onClick={this.loadSlidesReplace}>Next</button></Link>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
        return(
          <ReactLoading type={'spinningBubbles'} color={'#990099'} height={100} width={100} />
        )
      }
  }
}

Fill.propTypes = {
  handleInitInputs: PropTypes.func,
  handleImagesInputs: PropTypes.func,
  handleInputs: PropTypes.func,
  handleTripleMoustaches: PropTypes.func,
  inputs: PropTypes.array,
  selectedTemplate: PropTypes.string
};

export default Fill;

