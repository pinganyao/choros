export type Region = {
  id: string
  slug: string
  name: string
  nameGreek: string
  geoIds: string[]
}

export const regions: Region[] = [
  // Mainland
  {
    id: 'attica',
    slug: 'attica',
    name: 'Attica',
    nameGreek: 'Αττική',
    geoIds: ['0901', '0902', '0903', '0904', '0905', '0906', '0907', '0908'],
  },
  {
    id: 'peloponnese',
    slug: 'peloponnese',
    name: 'Peloponnese',
    nameGreek: 'Πελοπόννησος',
    geoIds: ['1001', '1002', '1003', '1004', '1005'],
  },
  {
    id: 'central-greece',
    slug: 'central-greece',
    name: 'Central Greece',
    nameGreek: 'Στερεά Ελλάδα',
    geoIds: ['0801', '0802', '0803', '0804', '0805'],
  },
  {
    id: 'western-greece',
    slug: 'western-greece',
    name: 'Western Greece',
    nameGreek: 'Δυτική Ελλάδα',
    geoIds: ['0701', '0702', '0703'],
  },
  {
    id: 'epirus',
    slug: 'epirus',
    name: 'Epirus',
    nameGreek: 'Ήπειρος',
    geoIds: ['0401', '0402', '0403', '0404'],
  },
  {
    id: 'thessaly',
    slug: 'thessaly',
    name: 'Thessaly',
    nameGreek: 'Θεσσαλία',
    geoIds: ['0501', '0502', '0503', '0504', '0505'],
  },
  {
    id: 'west-macedonia',
    slug: 'west-macedonia',
    name: 'West Macedonia',
    nameGreek: 'Δυτική Μακεδονία',
    geoIds: ['0301', '0302', '0303', '0304'],
  },
  {
    id: 'central-macedonia',
    slug: 'central-macedonia',
    name: 'Central Macedonia',
    nameGreek: 'Κεντρική Μακεδονία',
    geoIds: ['0201', '0202', '0203', '0204', '0205', '0206', '0207'],
  },
  {
    id: 'east-macedonia-thrace',
    slug: 'east-macedonia-thrace',
    name: 'East Macedonia & Thrace',
    nameGreek: 'Ανατολική Μακεδονία και Θράκη',
    geoIds: ['0101', '0102', '0103', '0104', '0105', '0106'],
  },
  // Crete
  {
    id: 'crete',
    slug: 'crete',
    name: 'Crete',
    nameGreek: 'Κρήτη',
    geoIds: ['1301', '1302', '1303', '1304'],
  },
  // Ionian Islands
  {
    id: 'corfu',
    slug: 'corfu',
    name: 'Corfu',
    nameGreek: 'Κέρκυρα',
    geoIds: ['0603'],
  },
  {
    id: 'lefkada',
    slug: 'lefkada',
    name: 'Lefkada',
    nameGreek: 'Λευκάδα',
    geoIds: ['0605'],
  },
  {
    id: 'cephalonia-ithaca',
    slug: 'cephalonia-ithaca',
    name: 'Cephalonia & Ithaca',
    nameGreek: 'Κεφαλονιά & Ιθάκη',
    geoIds: ['0602', '0604'],
  },
  {
    id: 'zakynthos',
    slug: 'zakynthos',
    name: 'Zakynthos',
    nameGreek: 'Ζάκυνθος',
    geoIds: ['0601'],
  },
  // North Aegean
  {
    id: 'lesbos',
    slug: 'lesbos',
    name: 'Lesbos',
    nameGreek: 'Λέσβος',
    geoIds: ['1101'],
  },
  {
    id: 'chios',
    slug: 'chios',
    name: 'Chios',
    nameGreek: 'Χίος',
    geoIds: ['1105'],
  },
  {
    id: 'samos',
    slug: 'samos',
    name: 'Samos',
    nameGreek: 'Σάμος',
    geoIds: ['1104'],
  },
  {
    id: 'limnos',
    slug: 'limnos',
    name: 'Limnos',
    nameGreek: 'Λήμνος',
    geoIds: ['1103'],
  },
  {
    id: 'ikaria',
    slug: 'ikaria',
    name: 'Ikaria',
    nameGreek: 'Ικαρία',
    geoIds: ['1102'],
  },
  // South Aegean — Cyclades & Dodecanese
  {
    id: 'rhodes',
    slug: 'rhodes',
    name: 'Rhodes',
    nameGreek: 'Ρόδος',
    geoIds: ['1211'],
  },
  {
    id: 'kos',
    slug: 'kos',
    name: 'Kos',
    nameGreek: 'Κως',
    geoIds: ['1206'],
  },
  {
    id: 'karpathos',
    slug: 'karpathos',
    name: 'Karpathos',
    nameGreek: 'Κάρπαθος',
    geoIds: ['1204'],
  },
  {
    id: 'santorini',
    slug: 'santorini',
    name: 'Santorini',
    nameGreek: 'Σαντορίνη',
    geoIds: ['1202'],
  },
  {
    id: 'naxos-paros',
    slug: 'naxos-paros',
    name: 'Naxos & Paros',
    nameGreek: 'Νάξος & Πάρος',
    geoIds: ['1209', '1210'],
  },
  {
    id: 'andros',
    slug: 'andros',
    name: 'Andros',
    nameGreek: 'Άνδρος',
    geoIds: ['1201'],
  },
  {
    id: 'syros',
    slug: 'syros',
    name: 'Syros',
    nameGreek: 'Σύρος',
    geoIds: ['1212'],
  },
  {
    id: 'milos',
    slug: 'milos',
    name: 'Milos',
    nameGreek: 'Μήλος',
    geoIds: ['1207'],
  },
  {
    id: 'mykonos',
    slug: 'mykonos',
    name: 'Mykonos',
    nameGreek: 'Μύκονος',
    geoIds: ['1208'],
  },
  {
    id: 'cyclades',
    slug: 'cyclades',
    name: 'Cyclades',
    nameGreek: 'Κυκλάδες',
    geoIds: ['1205', '1213'],
  },
  {
    id: 'dodecanese',
    slug: 'dodecanese',
    name: 'Dodecanese',
    nameGreek: 'Δωδεκάνησα',
    geoIds: ['1203'],
  },
]

const regionBySlug = new Map(regions.map((r) => [r.slug, r]))
const regionById = new Map(regions.map((r) => [r.id, r]))

export function getRegionBySlug(slug: string): Region | undefined {
  return regionBySlug.get(slug)
}

export function getRegionById(id: string): Region | undefined {
  return regionById.get(id)
}
