import $ from 'jquery';
import Router from './router';

const router = new Router();

// can't seem to get pushState to work with this dev server. tried:
  // devServer: {
  //   historyApiFallback: true }
// but no dice. off for now.
// Backbone.history.start({ pushState: true });

Backbone.history.start({ pushState: true });
