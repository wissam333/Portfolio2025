export default defineEventHandler(async (event) => {
  const firstRow = [
    {
      id: 1,
      name: "Oasis Business Center",
      type: "Real Estate",
      urlField: "https://oasisbusinesscentre.net/",
      image: "/works/7.png",
    },
    {
      id: 2,
      name: "Hamasat Perfumes",
      type: "E-commerce",
      urlField: "https://hamasatperfumes.com/",
      image: "/works/3.webp",
    },
    {
      id: 3,
      name: "Emarati Magazine",
      type: "News",
      urlField: "https://emaratimagazine.com/",
      image: "/works/1.png",
    },
    {
      id: 7,
      name: "Kahramana",
      type: "Real Estate",
      urlField: "https://kahramanarealestate.com/",
      image: "/works/8.png",
    },
    {
      id: 8,
      name: "Dqiqa",
      type: "Restaurant",
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
