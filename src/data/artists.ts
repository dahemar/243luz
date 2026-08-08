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
    id: "iw-payne",
    name: "I.W. Payne",
    sortName: "I.W. Payne",
    biography: PLACEHOLDER_BIO,
    exhibitionIds: ["iw-payne-lie-down"],
    portrait: PLACEHOLDER_PORTRAIT,
  },
  {
    id: "salomon-garcon",
    name: "Solomon Garçon",
    sortName: "Solomon Garçon",
    biography: `Exhibitions

Stedelijk, Amsterdam
Manosphere (group)
April – May 2026

Kunstverein für die Rheinlande und Westfalen, Düsseldorf
Closing act
8 – 15 March 2026
https://kunstverein-duesseldorf.de/ausstellungen/bravo/

243Luz at Liste, Basel
solo presentation
15 June – 21 June 2025
https://www.instagram.com/p/DLE1qtho_yL/

Raven Row, UK
Fake Barn Country (group)
8 May – 6 July 2025
Organised by Ruth Angel Edwards, Lawrence Leaman and Oliver Williams
https://ravenrow.org/exhibitions/fake-barn-country

Galerie Buchholz, NY
an exhibition organized by Samuel Hindolo (group)
14 March – 17 May 2025
https://www.galeriebuchholz.de/exhibitions/group-show-new-york-samuel-hindolo

Galerina, London
untitled (group)
31.12.2024
@mygalerina

243Luz, Margate, UK
sunset beach (solo)
6 October – 10 November 2024
https://www.243luz.com/solomongar%C3%A7on

Tetro Grottesco at Basel Social Club, CH
Mug & zeusnetwork (solo)
6 June – 16 June 2024
invited by Saim Demircan
https://www.gonewiththeteatro.com/exhibitions/baselsocialclub2024.php

Studio Voltaire, London
ARMS (solo)
4 October 2022 – 14 January 2024
https://studiovoltaire.org/whats-on/solomon-garcon-arms/

Arcadia Missa x 243Luz
online viewing (group)
untitled (roof)
Dec 2023
https://www.instagram.com/p/C0bWZYtqjxE/

Galerie Buchholz (Fasanenstr. 31 space), Berlin
solomon's knock (collaboration with Samuel Hindolo)
28 April – 17 June 2023
https://cutt.ly/bwqe7aLK

Rose Easton, London
SNITCH (solo)
7 October – 5 November 2022
https://cutt.ly/mwqe9RR0

Auto Italia, London
Words Fail Me
April 2018
sound installation in collaboration with artist Adam Gallagher
http://autoitaliasoutheast.org/project/words-fail-me/

Performances

Raven Row, UK (Jaguar Shoes)
Jog Mode, 2025
Collaboration with Adam Gallagher
An event as part of the exhibition Fake Barn Country
https://ravenrow.org/events/fake-barn-country-at-jaguar-shoes

Volksbuehne (Roter Salon)
DO U WANT TO MOVE BACK TO LDN
collaboration with John T. Gast
https://ra.co/events/2002127

Haus der Kunst, Munich
Anansi's Web – Dimanche
collaboration with Nelta Kasparian
1 February 2025
https://www.hausderkunst.de/en/eintauchen/echoes-plot-twist

243Luz, Margate
sunset beach (pilot), 2024
collaboration with Josiane H. Pozi
as part of the exhibition sunset beach at 243Luz, Margate
5 November 2024
https://www.243luz.com/solomongar%C3%A7on

Hours and Hours, 2024
collaboration with Hilary Lloyd to coincide their neighbouring exhibitions:
Hilary Lloyd, Ok Darling, Show's Over, at Roland Ross, Margate
Solomon Garçon, sunset beach, at 243Luz, Margate
https://www.instagram.com/p/DCL6pMvIqXq/

Roskilde Festival
Anansi's Web – Dimanche
collaboration with Nelta Kasparian
July 2024
https://anansis-web.com/artist/dimanche-by-anansi-s-web

Café OTO, London
DO U WANT TO MOVE BACK TO LDN
collaboration with John T. Gast
Feb 2024
https://www.cafeoto.co.uk/events/do-u-want-to-move-back-to-london/

Sant' Andrea de Scaphis (Gavin Brown), Rome
June 2022
collaboration, invited by the artist Klein to perform in Psalm's Trust
https://www.santandreadescaphis.com/

Kunstverein München
June 2022
solo performance (as Jah Umbrella) during Klein's the roads were active
https://www.kunstverein-muenchen.de/en/programm/programmreihen/2022/between

FOAM, Amsterdam
Jan 2022
solo performance Doro's Leg – Legba's Dog during
Liz Johnson Artur: of life of love of sex of movement of hope
https://www.foam.org/events/Curtly-Thomas

Centre Pompidou, Paris
July 2021
collaboration with Nkisi
https://www.centrepompidou.fr/en/program/calendar/event/dlmkU8Y

South London Gallery, London
August 2019
solo performance during
Liz Johnson Artur: If you know the beginning, the end is no trouble
https://www.southlondongallery.org/events/performance-smallboydanger/

Exhibitions/Broadcasts

Auto Italia, London
October 2020
Axis Arkestra mix (collaboration with Nkisi)
https://autoitaliasoutheast.org/blog/pico-the-commandant-zabra-effect/

Residencies

Akademie der Künste, Berlin
Berlin Fellowship
01.10. – 31.12.2025

Institute of Interconnected Realities, Copenhagen
May 2022 with S. Rieser
https://highpass.events/basement/au9lhkc/

Grants

Arts Council – Developing Your Own Creative Practice November 2020 (£10k)
Arts Council – National Lottery Project grant 2021 (£15k)
Project: Anansi's WEB
Arts Council – National Lottery Project grant 2023 (£23k)
Project: Studio Voltaire exhibition (solo)
LOEWE FOUNDATION / Studio Voltaire Award September 2021
two-year rent-free studio programme (£5k)

Education

University of the Arts London
2010 – 2014 BA Art Direction
Bachelors degree 2:1`,
    exhibitionIds: ["sunset-beach"],
    portrait: PLACEHOLDER_PORTRAIT,
  },
  {
    id: "lizzy-deacon",
    name: "Lizzy Deacon",
    sortName: "Lizzy Deacon",
    biography: PLACEHOLDER_BIO,
    exhibitionIds: [],
    portrait: PLACEHOLDER_PORTRAIT,
  },
  {
    id: "juliette-lena-hager",
    name: "Juliette Lena Hager",
    sortName: "Juliette Lena Hager",
    biography: PLACEHOLDER_BIO,
    exhibitionIds: [],
    portrait: PLACEHOLDER_PORTRAIT,
  },
];

export default artists;
