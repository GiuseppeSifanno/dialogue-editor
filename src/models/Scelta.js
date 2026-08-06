export default class Scelta {
    constructor(id, testo = 'Nuova scelta', next = '') {
        this.id = id;
        this.testo = testo;
        this.next = next;
    }
}