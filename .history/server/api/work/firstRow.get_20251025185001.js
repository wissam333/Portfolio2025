export default defineEventHandler(async (event) => {
  const firstRow = [
    {
      id: 1,
      name: "Oasis Business Center",
      nameAr: "واحة المركز التجاري",
      type: "Real Estate",
      typeAr: "عقارات",
      urlField: "https://oasisbusinesscentre.net/",
      image: "/works/7.png",
    },
    {
      id: 2,
      name: "Hamasat Perfumes",
      nameAr: "همسات العطور",
      type: "E-commerce",
      typeAr: "التجارة الإلكترونية",
      urlField: "https://hamasatperfumes.com/",
      image: "/works/3.webp",
    },
    {
      id: 3,
      name: "Emarati Magazine",
      nameAr: "مجلة إماراتي",
      type: "News",
      typeAr: "أخبار",
      urlField: "https://emaratimagazine.com/",
      image: "/works/1.png",
    },
    {
      id: 7,
      name: "Kahramana",
      nameAr: "كرامانا",
      type: "Real Estate",
      typeAr: "عقارات",
      urlField: "https://kahramanarealestate.com/",
      image: "/works/8.png",
    },
    {
      id: 8,
      name: "Dqiqa",
      nameAr: "دقيقة",
      type: "Restaurant",
      typeAr: "مطعم",
      urlField: "https://dqiqa.ly/",
      image: "/works/9.png",
    },
  ];

  return {
    status: 200,
    data: firstRow,
    message: "First row portfolio items fetched successfully",
  };
});
