export default defineEventHandler(async (event) => {
  const events = [
    {
      title: "Start Journey",
      titleAr: "بداية الرحلة",
      date: "2018",
      icon: "mdi:briefcase-account",
      color: "#9C27B0",
      description:
        "Started learning web basics, discovered passion for coding.",
      descriptionAr: "بدأت تعلم أساسيات الويب، واكتشفت شغف البرمجة.",
    },
    {
      title: "Learning JS",
      titleAr: "تعلم الجافاسكريبت",
      date: "2019",
      icon: "mdi:code",
      color: "#673AB7",
      description: "Learned JavaScript, Pascal, and C++ basics.",
      descriptionAr: "تعلمت أساسيات JavaScript و Pascal و C++.",
    },
    {
      title: "University & SQL",
      titleAr: "الجامعة وقواعد البيانات",
      date: "2020",
      icon: "mdi:database",
      color: "#FF9800",
      description: "Studied SQL, C++, Java, Sass, Bootstrap, JS DOM/BOM.",
      descriptionAr: "درست SQL و C++ و Java و Sass و Bootstrap و JS DOM/BOM.",
    },
    {
      title: "First Job",
      titleAr: "الوظيفة الأولى",
      date: "2021",
      icon: "mdi:briefcase",
      color: "#607D8B",
      description: "Learned Vue 2 and worked at Dr Social Company.",
      descriptionAr: "تعلمت Vue 2 وعملت في شركة Dr Social.",
    },
    {
      title: "Vue 3 & Freelancing",
      titleAr: "فيو 3 والعمل الحر",
      date: "2022",
      icon: "mdi:remote-desktop",
      color: "#9C27B0",
      description:
        "Worked as freelancer, plan to master Nuxt & backend skills.",
      descriptionAr: "عملت كمستقل، وأخطط لإتقان Nuxt ومهارات الخلفية.",
    },
    {
      title: "Remote Work",
      titleAr: "العمل عن بُعد",
      date: "2023",
      icon: "mdi:code-brackets",
      color: "#a89233",
      description: "Worked as Vue developer for 3 companies.",
      descriptionAr: "عملت كمطور Vue لثلاث شركات.",
    },
    {
      title: "FSIT Company",
      titleAr: "شركة FSIT",
      date: "2024",
      icon: "mdi:code-braces",
      color: "#59bc90",
      description: "Worked as Nuxt developer at FSIT company for 1.5 years.",
      descriptionAr: "عملت كمطور Nuxt في شركة FSIT لمدة 1.5 سنة.",
    },
  ];

  return {
    status: 200,
    data: events,
    message: "Events fetched successfully",
  };
});
