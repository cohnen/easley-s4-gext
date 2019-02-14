import React, { Component } from "react";
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import ReactLoading from 'react-loading';

let keywords = [];
let eraseMoustache;
let presentation;

class Fill extends Component {
  constructor(props) {
    super(props);

    this.state={
      loadingForm: true,
      moustachesArray : [],
      presentationIdCopy : '',
    }

    this.loadSlidesApi = this.loadSlidesApi.bind(this);
    this.listSlides = this.listSlides.bind(this);
    this.execute = this.execute.bind(this);
    this.loadSlidesReplace = this.loadSlidesReplace.bind(this);
  }

  componentDidMount() {
    this.loadSlidesApi();
  }

  loadSlidesApi() {
    if(this.props.presentationId !== '') {
      presentation = this.props.presentationId;
      window.gapi.client.load('slides', 'v1').then(this.listSlides);
    }
  }

  listSlides() {
    window.gapi.client.slides.presentations.get({
      presentationId : this.props.presentationId
    }).then(response => {
      let presentation = response.result;
      let moustaches = JSON.stringify(presentation).match(/(?<!{){{\s*[\w]+\s*}}(?!})/g);
      eraseMoustache = moustaches.map(item =>item.replace('{{','').replace('}}',''));
      this.setState({moustachesArray: [...keywords, ...eraseMoustache]});
      this.props.handleInitInputs(this.state.moustachesArray);
    });
  }

  loadSlidesReplace() {
    if(this.props.presentationId !== '') {
      window.gapi.client.load('slides', 'v1').then(f=>{
        window.gapi.client.load('drive', 'v2').then(execute=>{
          this.execute()
        })
      }).catch(error=>{console.log(error)});
    }
  }

  execute() {
    return window.gapi.client.drive.files.copy({
      "fileId": presentation,
      "resource": {}
    })
        .then((response) => {
          let newId = response.result.id;
          this.props.handleCopyId(newId);
        },
        function(err) { console.error("Execute error", err); })
        .catch(err=>{console.log(err);})
  }

  render() {
    const { selectedTemplate, handleInputs } = this.props;

    if (this.state.moustachesArray && this.state.moustachesArray.length > 0){
      return (
        <div className="fill-page">
          <div className="fill-template__result">
            <div id="result">{selectedTemplate}</div>
            <div className="fill-page__btn back-btn">
                <button type="button" className="btn btn-light"><Link to="/steps/choose">Choose another template</Link></button>
            </div>
          </div>
          <div className="fill-page__form">
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
            </form>
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
  handleInputs: PropTypes.func,
  inputs: PropTypes.array,
  selectedTemplate: PropTypes.string
};

export default Fill;

