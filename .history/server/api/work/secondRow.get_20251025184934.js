// server/api/portfolio/secondRow.get.ts
export default defineEventHandler(async (event) => {
  const secondRow = [
    {
      id: 4,
      name: "UAE Triathlon",
      nameAr: "الترايثلون الإماراتي",
      type: "Sport",
      typeAr: "رياضة",
      urlField: "https://triathlonuae.net/",
      image: "/works/4.png",
    },
    {
      id: 5,
      name: "Metaverse Training",
      nameAr: "تدريب الميتافيرس",
      type: "Education",
      typeAr: "تعليم",
      urlField: "https://metavers-t.net/",
      image: "/works/10.webp",
    },
    {
      id: 6,
      name: "True Future",
      nameAr: "ترو فيوتشر",
      type: "Real Estate",
      typeAr: "عقارات",
      urlField: "https://truefre.net/",
      image: "/works/2.svg",
    },
    {
      id: 9,
      name: "Massar School",
      nameAr: "مدرسة مسار",
      type: "Education",
      typeAr: "تعليم",
      urlField: "https://schooltec.org/",
      image: "/works/6.png",
    },
    {
      id: 10,
      name: "UAE Archery Federation",
      nameAr: "اتحاد الرماية الإماراتي",
      type: "Sport",
      typeAr: "رياضة",
      urlField: "https://uaearchery.net/",
      image: "/works/5.webp",
    },
  ];

  return {
    status: 200,
    data: secondRow,
    message: "Second row portfolio items fetched successfully",
  };
});
