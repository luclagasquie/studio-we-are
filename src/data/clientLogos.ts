export type ClientLogo = {
  id: string;
  order: number;
  src: string;
  alt: string;
};

export const clientLogos: ClientLogo[] = [
  { id: 'aquitaine-cars', order: 1, src: '/clients-logos/aquitaine-cars.svg', alt: 'Aquitaine Cars' },
  { id: 'emmaus', order: 2, src: '/clients-logos/emmaus.svg', alt: 'Emmaüs' },
  { id: 'geraldine', order: 3, src: '/clients-logos/geraldine.svg', alt: 'Atelier Géraldine' },
  { id: 'nos-jardins-imparfaits', order: 4, src: '/clients-logos/nos-jardins-imparfaits.svg', alt: 'Nos Jardins Imparfaits' },
  { id: 'eurek', order: 5, src: '/clients-logos/eurek.svg', alt: 'Euré-k !' },
  { id: 'alliance-francaise-toulouse', order: 6, src: '/clients-logos/alliance-francaise-toulouse.svg', alt: 'Alliance Française Toulouse' },
];
