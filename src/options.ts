import * as $ from 'jquery';
import {browser} from "webextension-polyfill-ts";
import {get, store} from "./storage";

// Saves options to chrome.storage.sync.
function save_options() {
  var color = $('#color').val();
  var likesColor = $('#like').prop('checked');

  browser.storage.sync.set({
    favoriteColor: color,
    likesColor: likesColor
  })
  store({
    favoriteColor: color,
    likesColor: likesColor
  }, function() {
    // Update status to let user know options were saved.
    var status = $('#status');
    status.text('Options saved.');
    setTimeout(function() {
      status.text('');
    }, 750);
  })
  ;
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  get({
    favoriteColor: 'red',
    likesColor: true
  }, function(items: {favoriteColor, likesColor}) {
    $('#color').val(items.favoriteColor);
    $('#like').prop('checked', items.likesColor);
  })
}

$('#save').click(save_options);
$(restore_options); // document.addEventListener('DOMContentLoaded', restore_options);

