import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { ipcRenderer, remote } from 'electron';
import fs from 'fs-extra';
import Dropzone from 'react-dropzone';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import { soundActions } from 'actions/';
import { Header, Nav, SoundList, DownloadList } from 'components/';
import { Subroutes } from 'components/ui';
import { pathConfig, toasterInstance } from 'utils/';
import 'styles/base.css';
import './app.css';

let autoUpdater;
let gradients;
let initialState = {};

if (__DESKTOP__) {
  autoUpdater = remote.autoUpdater;
  gradients = fs.readJsonSync(pathConfig.gradientFile);
  initialState = {
    updateAvailable: false,
    gradient: gradients[Math.floor(Math.random() * gradients.length)]
  };
}

class App extends Component {
  static propTypes = {
    children: PropTypes.object,
    soundActions: PropTypes.object
  };

  state = initialState;

  componentDidMount() {
    this.props.dispatch(soundActions.soundsInit());

    if (__DESKTOP__) {
      ipcRenderer.on('application:update-available', this.handleUpdateAvailable);
      autoUpdater.checkForUpdates();
    }
  }

  onDrop = (files) => { // Desktop only
    if (__DESKTOP__) {
      files.map(_f => this.props.soundActions.addLocalSound(_f.name, _f.path));
    } else {
      toasterInstance().then(_t => _t.toast('You can only add desktop files with the Kakapo desktop app.'));
    }
  };

  // Desktop only
  handleUpdateAvailable = () => this.setState({ updateAvailable: true });

  // Desktop only
  handleAutoUpdateClick = () => ipcRenderer.send('application:quit-install');

  renderUpload() {
    return (
      <div
        className="upload-files"
        style={{
          background: `linear-gradient(90deg, ${this.state.gradient.colors[0]} 10%, ${this.state.gradient.colors[1]} 90%)`
        }}
      >
        <div className="inner">
          <h3><i className="icon-add"></i></h3>
          <p className="text">Drop files to upload</p>
          <a className="gradient-name" href="http://uigradients.com" target="_blank">
            Gradient: {this.state.gradient.name}
          </a>
        </div>
      </div>
    );
  }

  render() {
    const { sounds, themes, intl, dispatch, location } = this.props;
    return (
      <div className={classNames('app-container', { web: __WEB__, desktop: __DESKTOP__ })}>
        <Dropzone
          activeClassName="activeDrop"
          className="inactiveDrop"
          disableClick
          onDrop={this.onDrop}
        >
          {__DESKTOP__ ? this.renderUpload() : null}
          {this.state.updateAvailable ? <a className="update-now" onClick={this.handleAutoUpdateClick}>Hi, there is a new version of Kakapo!<br/>Click here to update</a> : null}

          <Nav {...{ themes, intl, dispatch }}/>
          <Header {...{ themes, location, intl }}/>

          <Subroutes {...this.props}/>

          <SoundList {...{ sounds, themes, intl, dispatch }}/>
          <aside className="toast-view"></aside>
          <DownloadList {...{ sounds }}/>
        </Dropzone>
      </div>
    );
  }
}

export default injectIntl(connect(state => ({
  settings: state.settings,
  sounds: state.sounds,
  search: state.search,
  themes: state.themes
}))(App));
