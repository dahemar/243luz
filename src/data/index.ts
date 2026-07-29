import exhibitionsData, { type Exhibition, type ExhibitionImage } from "./exhibitions";
import artistsData, { type Artist } from "./artists";

export function getExhibitions(): Exhibition[] {
  return exhibitionsData;
}

export function getArtists(): Artist[] {
  return [...artistsData].sort((a, b) =>
    a.sortName.localeCompare(b.sortName)
  );
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
