export default class UI {
  /**
    * Constructor for an abstract view class (e.g. a map or a list)
    *
    * @constructor
    */
  constructor() {
    if (new.target === UI) {
      throw new TypeError('Abstract class "UI" cannot be instantiated directly');
    }
    if (this.show === undefined) {
      throw new TypeError('Must override method show()');
    }

    this.notes = [];
    this.query = null;
  }

  /**
    * Searches for the note with the specified id and returns it
    *
    * @function
    * @param {Number} id
    * @returns {Note}
    */
  get(id) {
    return this.notes.find(note => note.id === id);
  }

  /**
    * Updates a single note with new data
    *
    * @function
    * @param {Number} id
    * @param {Note} note
    * @returns {Promise}
    */
  update(id, note) {
    const index = this.notes.findIndex(element => element.id === id);
    if (index === -1) {
      throw new Error(`The note with the id ${id} could not be found in the array`);
    }
    this.notes[index] = note;
    return this.reload();
  }

  /**
    * Reload the notes because another event happened like a changed filter
    *
    * @function
    * @returns {Promise}
    */
  reload() {
    return this.show(this.notes, this.query, true);
  }
}
