'use strict';

/* globals UI */
/* globals Localizer */
/* globals Permalink */
/* globals Mode */

const Expert = (function() { // eslint-disable-line no-unused-vars
  const me = {};

  let notes = [];

  me.search = function(query, limit, closed) {
    const url = Request.buildURL(query, limit, closed, false);

    Request.get(new XMLHttpRequest(), url, function(result) {
      if (result.features.length === 0) {
        UI.nothingFound();
      }

      notes = [];
      let ids = [];

      for (let i = 0; i < result.features.length; i++) {
        const feature = result.features[i];
        if (ids.indexOf(feature.properties.id) === -1) {
          const note = feature.properties;
          const comment = note.comments[0];
          const geometry = feature.geometry;

          ids.push(note.id);
          notes.push({
            id: note.id,
            user: comment.user || Localizer.getMessage('note.anonymous'),
            text: comment.html,
            position: geometry.coordinates,
            comments: note.comments,
            date: note.date_created
          });
        }
      }

      notes.sort(function(a, b) {
        return a.id - b.id;
      });
      if (UI.sortOrder.checked === true) {
        notes.reverse();
      }

      add(notes, function() {
        UI.toggleButtons();
      });

      //Display how much notes were found
      document.getElementById('found-notes').textContent = Localizer.getMessage('note.found') + ids.length;
    });
  };

  me.changeOrder = function() {
    notes.sort(function(a, b) {
      return a.id - b.id;
    });
    if (UI.sortOrder.checked === true) {
      notes.reverse();
    }
    add(notes);
  };

  function add(notes, callback) {
    const html = [];
    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      html.push(
        '<div class="col s12 m6 l4">' +
          '<div class="card blue-grey darken-1">' +
            '<div class="card-content white-text">' +
              '<span class="card-title">' +
                note.id + ' (' + note.user + ')' +
                UI.getAgeOfNoteBadge(note.date) +
                UI.getAmountOfCommentsBadge(note.comments) +
              '</span>' +
              '<p>' + note.text + '</p>' +
            '</div>' +
            '<div class="card-action">' +
              UI.getNoteActions(note.text, note.id, note.position) +
            '</div>' +
          '</div>' +
        '</div>');
    }
    document.getElementById('notes').innerHTML = html.join('');

    if (typeof callback === 'function') {
      callback();
    }
  }

  return me;
})();

// init modules
Mode.set(Mode.EXPERT);
Localizer.init(function() {
  Permalink.update();
  UI.init();
});
