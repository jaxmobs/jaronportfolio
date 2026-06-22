// ─────────────────────────────────────────────
//  PROJECTS
//  Add a youtubeId to get a play button + modal
//  on that card. Leave it null to skip the modal.
// ─────────────────────────────────────────────
export const PROJECTS = [
  {
    id: 1,
    title: "Nunatak Apex",
    client: "Alaska Gear Company",
    year: "2024",
    category: "Gear",
    description: "Summer alpine product launch shot across the Denali Highway. Pure backcountry light.",
    thumb: "https://img.youtube.com/vi/Iwu86F8O_os/maxresdefault.jpg",
    tags: ["outdoor", "gear"],
    youtubeId: "Iwu86F8O_os",
  },
  {
    id: 2,
    title: "Pilot Profile: Matt Williams",
    client: "Alaska Gear Company",
    year: "2024",
    category: "Documentary",
    description: "A bush pilot's story — the sky, the silence, and the machines that make it possible.",
    thumb: "https://img.youtube.com/vi/sUep9gDu-gU/maxresdefault.jpg",
    tags: ["mini-doc", "aviation"],
    youtubeId: "sUep9gDu-gU",
  },
  {
    id: 3,
    title: "Adventure Packs Release",
    client: "Kaladi Brothers Coffee",
    year: "2024",
    category: "Brand",
    description: "Pack your bag. Pour your cup. Alaska starts here.",
    thumb: "https://img.youtube.com/vi/9bkFW7MLN_g/maxresdefault.jpg",
    tags: ["brand", "outdoor"],
    youtubeId: "9bkFW7MLN_g",
  },
  {
    id: 4,
    title: "Winter Campaign",
    client: "Kaladi Brothers Coffee",
    year: "2023",
    category: "Brand",
    description: "Shot at -20°F. Coffee has never looked so earned.",
    thumb: "https://img.youtube.com/vi/XzNVzTOZLHo/maxresdefault.jpg",
    tags: ["brand", "winter"],
    youtubeId: "XzNVzTOZLHo",
  },
  {
    id: 5,
    title: "Alaskan Bushwheels Summer Highlight Reel 2024",
    client: "Alaskan Bushwheels",
    year: "2024",
    category: "Gear",
    description: "Summer 2024 highlight reel — tundra, tires, and the Alaska backcountry.",
    thumb: "https://img.youtube.com/vi/AOCm0vQeSwo/maxresdefault.jpg",
    tags: ["gear", "highlight"],
    youtubeId: "AOCm0vQeSwo",
  },
];

export const SKILLS = [
  "Outdoor Storytelling",
  "Cinematography",
  "Photography",
  "Color Grading",
];

export const FILTERS = ["all", "mini-doc", "brand", "gear", "editorial"];

// ─────────────────────────────────────────────
//  GALLERY
//  Add images to public/gallery/ and reference as /gallery/filename.jpg
//  Edit caption and date for each — they show in the lightbox on click.
//  Run: node scripts/optimize-gallery.js — to optimize new photos before adding.
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
//  For best SEO, update alt and caption on each
//  image to describe what's actually in the shot.
//  e.g. "Fat bike on Knik Glacier, Alaska" or
//  "Bush plane on a remote Alaska gravel bar"
// ─────────────────────────────────────────────
export const GALLERY = [
  { id: 1, src: "/gallery/02475632-228B-4374-AE65-04761CDAB06A_1_105_c.jpg", alt: "Outdoor photography — Alaska", caption: "", date: "" },
  { id: 2, src: "/gallery/1076C72E-F12E-4298-80BA-C0BA720A7225_1_105_c.jpg", alt: "Outdoor photography — Alaska", caption: "", date: "" },
  { id: 3, src: "/gallery/1A65FB89-33D2-42A1-B686-7678ED6A4CE8_1_102_o.jpg", alt: "Outdoor photography — Alaska", caption: "", date: "" },
  { id: 4, src: "/gallery/28DF3FA7-0AE7-4803-A614-2C2DAC62BEAA_1_105_c.jpg", alt: "Outdoor photography — Alaska", caption: "", date: "" },
  { id: 5, src: "/gallery/2E919E1A-D3D2-4A60-B541-1C6ED4CE1D81_1_105_c.jpg", alt: "Outdoor photography — Alaska", caption: "", date: "" },
  { id: 6, src: "/gallery/2E9D6F83-E141-472D-BD13-7D38E313532A_1_105_c.jpg", alt: "Outdoor photography — Alaska", caption: "", date: "" },
  { id: 7, src: "/gallery/369E4282-DD6E-4E12-8658-560F0449D834_1_102_o.jpg", alt: "Outdoor photography — Alaska", caption: "", date: "" },
  { id: 8, src: "/gallery/48A0019E-F98B-4503-AA1D-4A8ABDD03463_1_105_c.jpg", alt: "Outdoor photography — Alaska", caption: "", date: "" },
  { id: 9, src: "/gallery/4E883D74-9D2E-4B75-9FAC-4F0985131620_1_102_a.jpg", alt: "Outdoor photography — Alaska", caption: "", date: "" },
  { id: 10, src: "/gallery/50068D5C-B7B1-40E0-A2D4-E5AD14DEF4A5_1_102_o.jpg", alt: "Outdoor photography — Alaska", caption: "", date: "" },
  { id: 11, src: "/gallery/53D62F3B-3F5C-4C79-9B01-891EBD489366_1_102_o.jpg", alt: "Outdoor photography — Alaska", caption: "", date: "" },
  { id: 12, src: "/gallery/53EBB4E0-DBDF-41CA-B0AE-04C45E7D8156_1_102_o.jpg", alt: "Outdoor photography — Alaska", caption: "", date: "" },
  { id: 13, src: "/gallery/5D32E1FF-B757-4674-BAD5-2E278DF5B21D_1_102_o.jpg", alt: "Outdoor photography — Alaska", caption: "", date: "" },
  { id: 14, src: "/gallery/642DDD36-744D-41A6-B260-4187AC233F45_1_102_a.jpg", alt: "Outdoor photography — Alaska", caption: "", date: "" },
  { id: 15, src: "/gallery/68810E3F-9FB5-44DF-84B0-157364607CAA_1_102_o.jpg", alt: "Outdoor photography — Alaska", caption: "", date: "" },
  { id: 16, src: "/gallery/739AB60F-98B4-49DC-B7BE-41ABDB892C98_1_105_c.jpg", alt: "Outdoor photography — Alaska", caption: "", date: "" },
  { id: 17, src: "/gallery/7519EA92-59CB-4DC6-ADFC-776D02401CCC_1_102_o.jpg", alt: "Outdoor photography — Alaska", caption: "", date: "" },
  { id: 18, src: "/gallery/7D64FDCD-8932-481F-AC2C-ABB845C30AC1_1_105_c.jpg", alt: "Outdoor photography — Alaska", caption: "", date: "" },
  { id: 19, src: "/gallery/7E0A4D3E-76C3-4AB8-AA9F-C440BCC4679B_1_102_o.jpg", alt: "Outdoor photography — Alaska", caption: "", date: "" },
  { id: 20, src: "/gallery/8664244A-D789-4F23-A93F-0FA8F6EC5E5F_1_105_c.jpg", alt: "Outdoor photography — Alaska", caption: "", date: "" },
  { id: 21, src: "/gallery/8A70E011-93F8-4D2D-9D2B-513943267FD6_1_105_c.jpg", alt: "Outdoor photography — Alaska", caption: "", date: "" },
  { id: 22, src: "/gallery/8FD218C2-D406-41C3-BCB2-FAD2C551AD47_1_105_c.jpg", alt: "Outdoor photography — Alaska", caption: "", date: "" },
  { id: 23, src: "/gallery/902A69E9-53A5-4584-B3D3-999BF63D1FFA_1_102_o.jpg", alt: "Outdoor photography — Alaska", caption: "", date: "" },
  { id: 24, src: "/gallery/909CF4C6-E0C0-4BE1-8101-FB4869B3C492_1_102_o.jpg", alt: "Outdoor photography — Alaska", caption: "", date: "" },
  { id: 25, src: "/gallery/ABE5C455-5B8A-4967-AF1C-0337F11BB00D_1_105_c.jpg", alt: "Outdoor photography — Alaska", caption: "", date: "" },
  { id: 26, src: "/gallery/AEA377F8-F5EA-490C-9C38-D2D138B184FE_1_102_a.jpg", alt: "Outdoor photography — Alaska", caption: "", date: "" },
  { id: 27, src: "/gallery/B4E03B11-3B00-4E69-A857-6A6F73653E3E_1_102_a.jpg", alt: "Outdoor photography — Alaska", caption: "", date: "" },
  { id: 28, src: "/gallery/C8B7D7A5-97B3-40BA-B128-8345AEE82601_1_102_a.jpg", alt: "Outdoor photography — Alaska", caption: "", date: "" },
  { id: 29, src: "/gallery/CB215ED8-09E8-4C71-9F33-D318F186B64F_1_201_a.jpg", alt: "Outdoor photography — Alaska", caption: "", date: "" },
  { id: 30, src: "/gallery/D3E597AD-A382-4CAF-9D9A-671B93F22E81_1_105_c.jpg", alt: "Outdoor photography — Alaska", caption: "", date: "" },
  { id: 31, src: "/gallery/E049DA4F-E1FB-4751-9FD4-62D8815F6F12_1_102_o.jpg", alt: "Outdoor photography — Alaska", caption: "", date: "" },
  { id: 32, src: "/gallery/E7DEA7B1-E32B-44A5-94C0-A0627ABB41CD_1_105_c.jpg", alt: "Outdoor photography — Alaska", caption: "", date: "" },
  { id: 33, src: "/gallery/EE3DED71-B892-469A-8DE4-FAE62DF9E446_1_105_c.jpg", alt: "Outdoor photography — Alaska", caption: "", date: "" },
  { id: 34, src: "/gallery/F38BAC68-77A7-4F56-B93A-B8E024C25114_1_105_c.jpg", alt: "Outdoor photography — Alaska", caption: "", date: "" },
  { id: 35, src: "/gallery/F3995686-27FD-4307-93D1-8451F39643F4_1_105_c.jpg", alt: "Outdoor photography — Alaska", caption: "", date: "" },
  { id: 36, src: "/gallery/AKGL%20Portage%20Glacier_-16.jpg", alt: "Portage Glacier aerial view, Alaska — Jaron Mobley Videography", caption: "", date: "" },
  { id: 37, src: "/gallery/Brenden%20Cub_1.8.1.jpg", alt: "Bush plane Cub aircraft Alaska — Jaron Mobley Videography", caption: "", date: "" },
  { id: 38, src: "/gallery/Color%20Test%202%20_1.19.1.jpg", alt: "Outdoor videography color grade — Alaska", caption: "", date: "" },
  { id: 39, src: "/gallery/Color%20Test%20_2.7.1.jpg", alt: "Outdoor videography color grade — Alaska", caption: "", date: "" },
  { id: 40, src: "/gallery/IMG_1132.jpg", alt: "Outdoor photography — Alaska", caption: "", date: "" },
  { id: 41, src: "/gallery/IMG_5185.jpg", alt: "Outdoor photography — Alaska", caption: "", date: "" },
  { id: 42, src: "/gallery/IMG_5189.jpg", alt: "Outdoor photography — Alaska", caption: "", date: "" },
];
