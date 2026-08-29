export type EditionAvailability = "available" | "sold" | "enquire";

export interface Edition {
  id: string;
  artistId: string;
  title: string;
  year: string;
  medium: string;
  dimensions: string;
  editionSize: string;
  price: string;
  currency: string;
  availability: EditionAvailability;
  description: string;
  image: string;
  buyUrl: string;
}

const editions: Edition[] = [
  {
    id: "garcon-jog-mode",
    artistId: "salomon-garcon",
    title: "Jog Mode",
    year: "2025",
    medium: "Archival pigment print",
    dimensions: "29.7 × 42 cm",
    editionSize: "Edition of 25 + 2 AP",
    price: "£450",
    currency: "GBP",
    availability: "available",
    description: "Edition produced on the occasion of Jog Mode at Raven Row, 2025.",
    image: "/media/sunset beach/_DSC0182.jpg",
    buyUrl: "https://buy.stripe.com/4gM28q5Oy68T6Nj6FC5c400",
  },
  {
    id: "garcon-sunset-beach",
    artistId: "salomon-garcon",
    title: "Sunset Beach",
    year: "2024",
    medium: "Giclée print on cotton rag",
    dimensions: "50 × 70 cm",
    editionSize: "Edition of 10 + 2 AP",
    price: "£800",
    currency: "GBP",
    availability: "sold",
    description: "Edition produced on the occasion of sunset beach at 243Luz, Margate, 2024.",
    image: "/media/sunset beach/_DSC0198.jpg",
    buyUrl: "",
  },
  {
    id: "garcon-anansi-web",
    artistId: "salomon-garcon",
    title: "Anansi's Web",
    year: "2025",
    medium: "Risograph on paper",
    dimensions: "A3",
    editionSize: "Edition of 50",
    price: "Price on request",
    currency: "GBP",
    availability: "enquire",
    description: "Risograph edition accompanying the performance Anansi's Web – Dimanche.",
    image: "/media/sunset beach/_DSC0230.jpg",
    buyUrl: "",
  },
  {
    id: "payne-lie-down",
    artistId: "iw-payne",
    title: "Lie Down I Think I Love You",
    year: "2024",
    medium: "Archival pigment print",
    dimensions: "40 × 50 cm",
    editionSize: "Edition of 15",
    price: "£350",
    currency: "GBP",
    availability: "available",
    description: "Edition produced on the occasion of the exhibition at 243Luz, 2024.",
    image: "/media/I.W. Payne  Lie down I think I love you/DSCF9120.jpg",
    buyUrl: "https://buy.stripe.com/7sY7sK2Cm40L2x3fc85c401",
  },
  {
    id: "deacon-untitled",
    artistId: "lizzy-deacon",
    title: "Untitled",
    year: "2025",
    medium: "Monotype",
    dimensions: "30 × 40 cm",
    editionSize: "Unique",
    price: "£600",
    currency: "GBP",
    availability: "available",
    description: "Unique monotype.",
    image: "",
    buyUrl: "https://buy.stripe.com/5kQ4gydh0btd6Nj5By5c402",
  },
];

export default editions;
