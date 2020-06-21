import * as $ from 'jquery';
import {Toggl} from "./toggl";
import {sendEntries} from "./redmine";
import {get, store} from "./storage";
import {notify} from "./util";

function showEntriesTab(reload: boolean= false){
  $('#tab-entries').show();
  $('#tab-config').hide();
  $('#nav-link-entries').addClass('active');
  $('#nav-link-config').removeClass('active');
}

function showConfigTab(){
  $('#tab-entries').hide();
  $('#tab-config').show();
  $('#nav-link-entries').removeClass('active');
  $('#nav-link-config').addClass('active');
  get(['redmineHost', 'redmineKey', 'togglKey'], function (result) {
    $('#redmineHost').val(result.redmineHost);
    $('#redmineKey').val(result.redmineKey);
    $('#togglKey').val(result.togglKey);
  })
}

function fetchTogglEntries(range = 'today') {
  get(['togglKey'], function (result) {
    Toggl.fetchEntries({togglKey: result.togglKey}, range)
  })
}
const $loading = $('#ajax-loader').hide();
$(document)
    .ajaxStart(function () {
      $loading.show();
    })
    .ajaxStop(function () {
      $loading.hide();
    });

$(function() {

  showEntriesTab();
  let range = $('option:selected', $('#filter_entries')).val() + '';

  fetchTogglEntries(range);

  $('#nav-link-config').click(function () {
    showConfigTab();
  });

  $('#nav-link-entries').click(function () {
    showEntriesTab();
  });

  $('#check_all_entries').click(function (e) {
    $('.issue-check').prop( "checked", true );
  });

  $('#sync_entries').click(function () {
    sendEntries(()=> {showEntriesTab();});
  });

  $('#syncForm').submit(function (e) {
    e.preventDefault();
    const redmineHost = encodeURI('' + $('#redmineHost').val());
    const redmineKey = encodeURI('' + $('#redmineKey').val());
    const togglKey = encodeURI('' + $('#togglKey').val());

    store({redmineHost: redmineHost, redmineKey: redmineKey, togglKey: togglKey}, function () {
      showEntriesTab(true);
      notify('Configuration saved', 'success');
    })
  });

  $('#filter_entries').change(function (e) {
    range = $('option:selected', $(e.target)).val() + '';
    fetchTogglEntries(range);
  });

  $('#reloadButton').click(()=> {
    window.location.reload();
  })
});
