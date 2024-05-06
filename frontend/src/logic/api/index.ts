import { getPrihlasky, type getPrihlaskyData } from "./prihlasky/get";
import { postPrihlaska } from "./prihlasky/prihlaska/post";
import { getSouteze, type getSoutezeData } from "./souteze/get";
import { deleteSoutez } from "./souteze/soutez/delete";
import { getSoutez, type getSoutezData } from "./souteze/soutez/get";
import { patchSoutez } from "./souteze/soutez/patch";
import { postSoutez, type postSoutezData } from "./souteze/soutez/post";
import { patchHeslo } from "./uzivatele/uzivatel/heslo/patch";
import { postPrihlaseni } from "./uzivatele/uzivatel/prihlaseni/post";
import { patchUzivatel } from "./uzivatele/uzivatel/patch";
import { putHeslo } from "./uzivatele/uzivatel/heslo/put";
import { getUzivatele } from "./uzivatele/get";
import { deleteUzivatel } from "./uzivatele/uzivatel/delete";
import { putUzivatel } from "./uzivatele/uzivatel/put";
import { postUzivatel } from "./uzivatele/uzivatel/post";

export default {
  prihlasky: {
    prihlaska: {
      post: postPrihlaska,
    },
    get: getPrihlasky,
  },
  souteze: {
    get: getSouteze,
    soutez: {
      get: getSoutez,
      post: postSoutez,
      patch: patchSoutez,
      delete: deleteSoutez,
    },
  },
  uzivatele: {
    get: getUzivatele,
    uzivatel: {
      post: postUzivatel,
      put: putUzivatel,
      patch: patchUzivatel,
      delete: deleteUzivatel,
      prihlaseni: {
        post: postPrihlaseni,
      },
      heslo: {
        patch: patchHeslo,
        put: putHeslo,
      },
    },
  },
};

export type { getSoutezData, getSoutezeData, getPrihlaskyData, postSoutezData };
