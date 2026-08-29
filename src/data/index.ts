import exhibitionsData, { type Exhibition, type ExhibitionImage } from "./exhibitions";
import artistsData, { type Artist } from "./artists";
import editionsData, { type Edition } from "./editions";

export function getExhibitions(): Exhibition[] {
  return exhibitionsData;
}

export function getArtists(): Artist[] {
  return artistsData;
}

export function getArtistById(id: string): Artist | undefined {
  return artistsData.find((a) => a.id === id);
}

export function getExhibitionById(id: string): Exhibition | undefined {
  return exhibitionsData.find((e) => e.id === id);
}

export function getArtistExhibitions(artistId: string): Exhibition[] {
  return exhibitionsData.filter((e) => e.artistIds.includes(artistId));
}

export function getEditions(): Edition[] {
  return editionsData;
}

export function getEditionsByArtist(artistId: string): Edition[] {
  return editionsData.filter((e) => e.artistId === artistId);
}

export function getEditionById(id: string): Edition | undefined {
  return editionsData.find((e) => e.id === id);
}

export function getEditionArtists(): Artist[] {
  const ids = new Set(editionsData.map((e) => e.artistId));
  return artistsData.filter((a) => ids.has(a.id));
}
