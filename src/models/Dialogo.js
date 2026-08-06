import Battuta from "./Battuta";
import Scelta from "./Scelta";

export default class Dialogo {
    constructor({ id = "", battute = [], scelte = [], nextId = "" } = {}) {
        this.id = id;
        this.battute = battute.map((b) =>
            b instanceof Battuta ? b : new Battuta(b.personaggioId, b.testo),
        );
        this.scelte = scelte.map((s) =>
            s instanceof Scelta ? s : new Scelta(s.id, s.testo, s.next),
        );
        this.nextId = nextId;
    }

    addBattuta(personaggioId = "", testo = "") {
        this.battute.push(new Battuta(personaggioId, testo));
    }

    addScelta(id) {
        this.scelte.push(new Scelta(id));
    }
}
