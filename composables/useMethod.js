export const isEn = () =>  {
    const lang = localStorage.getItem("lang") ?? 'en';
    return lang === 'en'
}

export const GetImg = (imgUrl,useDefault=true) => {
    const { public: { api, apiBase }, } = useRuntimeConfig();
    if(!imgUrl){
        return useDefault?`/logo/bluelogo.png`:''
    }
    if(imgUrl.startsWith('data:image')){
        return imgUrl;
    }else{
        return `${apiBase}/${imgUrl}`
    }
}