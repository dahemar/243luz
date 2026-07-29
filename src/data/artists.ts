export interface Artist {
  id: string;
  name: string;
  sortName: string;
  biography: string;
  exhibitionIds: string[];
  portrait?: string;
}

const PLACEHOLDER_BIO = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

const PLACEHOLDER_PORTRAIT = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500"><rect width="400" height="500" fill="#f0f0f0"/><text x="200" y="250" text-anchor="middle" fill="#ccc" font-family="Georgia,serif" font-size="14">Portrait</text></svg>')}`;

const artists: Artist[] = [
  {
    id: "adam-patrick-grant",
    name: "Adam Patrick Grant",
    sortName: "Adam Patrick Grant",
    biography: PLACEHOLDER_BIO,
    exhibitionIds: ["adam-patrick-grant-mourning-dance"],
    portrait: PLACEHOLDER_PORTRAIT,
  },
  {
    id: "aidan-duffy",
    name: "Aidan Duffy",
    sortName: "Aidan Duffy",
    biography: PLACEHOLDER_BIO,
    exhibitionIds: ["aidan-duffy-after-the-function"],
    portrait: PLACEHOLDER_PORTRAIT,
  },
  {
    id: "august-boch",
    name: "August Boch",
    sortName: "August Boch",
    biography: PLACEHOLDER_BIO,
    exhibitionIds: ["august-boch-elia-munoz-perfect-vacuum"],
    portrait: PLACEHOLDER_PORTRAIT,
  },
  {
    id: "ben-gomes",
    name: "Ben Gomes",
    sortName: "Ben Gomes",
    biography: PLACEHOLDER_BIO,
    exhibitionIds: ["ben-gomes-outside"],
    portrait: PLACEHOLDER_PORTRAIT,
  },
  {
    id: "elia-munoz",
    name: "Elia Munoz",
    sortName: "Elia Munoz",
    biography: PLACEHOLDER_BIO,
    exhibitionIds: ["august-boch-elia-munoz-perfect-vacuum"],
    portrait: PLACEHOLDER_PORTRAIT,
  },
  {
    id: "iw-payne",
    name: "I.W. Payne",
    sortName: "I.W. Payne",
    biography: PLACEHOLDER_BIO,
    exhibitionIds: ["iw-payne-lie-down"],
    portrait: PLACEHOLDER_PORTRAIT,
  },
  {
    id: "jack-otway",
    name: "Jack Otway",
    sortName: "Jack Otway",
    biography: PLACEHOLDER_BIO,
    exhibitionIds: ["jack-otway-richard-tinkler"],
    portrait: PLACEHOLDER_PORTRAIT,
  },
  {
    id: "kevin-lowenthal",
    name: "Kevin Lowenthal",
    sortName: "Kevin Lowenthal",
    biography: PLACEHOLDER_BIO,
    exhibitionIds: ["kevin-lowenthal-honeymoon"],
    portrait: PLACEHOLDER_PORTRAIT,
  },
  {
    id: "lynn-hershman-leeson",
    name: "Lynn Hershman Leeson",
    sortName: "Lynn Hershman Leeson",
    biography: PLACEHOLDER_BIO,
    exhibitionIds: ["lynn-hershman-leeson"],
    portrait: PLACEHOLDER_PORTRAIT,
  },
  {
    id: "marlie-mul",
    name: "Marlie Mul",
    sortName: "Marlie Mul",
    biography: PLACEHOLDER_BIO,
    exhibitionIds: ["marlie-mul-opening-up"],
    portrait: PLACEHOLDER_PORTRAIT,
  },
  {
    id: "nasir-mazhar",
    name: "Nasir Mazhar",
    sortName: "Nasir Mazhar",
    biography: PLACEHOLDER_BIO,
    exhibitionIds: ["nasir-mazhar-i-always-wanted"],
    portrait: PLACEHOLDER_PORTRAIT,
  },
  {
    id: "racheal-crowther",
    name: "Racheal Crowther",
    sortName: "Racheal Crowther",
    biography: PLACEHOLDER_BIO,
    exhibitionIds: ["racheal-crowther-managed-decline"],
    portrait: PLACEHOLDER_PORTRAIT,
  },
  {
    id: "richard-tinkler",
    name: "Richard Tinkler",
    sortName: "Richard Tinkler",
    biography: PLACEHOLDER_BIO,
    exhibitionIds: ["jack-otway-richard-tinkler"],
    portrait: PLACEHOLDER_PORTRAIT,
  },
  {
    id: "shola-von-reinhold",
    name: "Shola Von Reinhold",
    sortName: "Shola Von Reinhold",
    biography: PLACEHOLDER_BIO,
    exhibitionIds: ["shola-von-reinhold-rebis"],
    portrait: PLACEHOLDER_PORTRAIT,
  },
  {
    id: "thirza-smith",
    name: "Thirza Smith",
    sortName: "Thirza Smith",
    biography: PLACEHOLDER_BIO,
    exhibitionIds: ["thirza-smith-all-together-now"],
    portrait: PLACEHOLDER_PORTRAIT,
  },
];

export default artists;
