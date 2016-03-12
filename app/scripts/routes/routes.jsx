import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { App, Playlist, Settings } from 'containers/';
import { ImportOptions, ImportKakapo, ImportSearch, ImportCustomUrl } from 'components/';

export default (
  <Route component={App} path="/">
    <IndexRoute component={ImportOptions} />
    <Route component={Playlist} path="playlist(/:playlistId)" />
    <Route component={Settings} path="settings" />
    <Route component={ImportKakapo} path="kakapo" />
    <Route component={ImportSearch} path="youtube" />
    <Route component={ImportSearch} path="soundcloud" />
    <Route component={ImportCustomUrl} path="custom" />
    <Route component="" path="*" />
  </Route>
);
