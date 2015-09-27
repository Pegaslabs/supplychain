import $ from 'jquery';
import Router from './router';
import MainView from './views/main';

const router = new Router();

let mainView = new MainView();
mainView.render();

// can't seem to get pushState to work with this dev server. tried:
// devServer: { historyApiFallback: true }
// but no dice. off for now.
// Backbone.history.start({ pushState: true });
Backbone.history.start();

