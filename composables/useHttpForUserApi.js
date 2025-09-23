export const useHttpForUserApi = () => {
  const { public: {apiBase} } = useRuntimeConfig();
  
  // Post Data
  const post = async (endpoint, data, isServer = true, isLazy = false) => useFetch(() => `${endpoint}`, {
    key: `${endpoint}`,
    baseURL: apiBase,
    method: 'post',
    body: data,
    server: isServer,
    lazy: isLazy,
    headers: {
      'Accept-Language': 'en-US',
      'Authorization': `Bearer ${useToken().value}`
    },
    onRequest({ request, options }) {
      // Set the request headers
      options.headers.Authorization = `Bearer ${useToken().value}`
    }
  })
  

  // Put Data
  const put = async (endpoint, data) => useFetch(() => `${endpoint}`, {
    key: `${endpoint}`,
    baseURL: apiBase,
    method: 'put',
    body: data,
    headers: {
      'Authorization': `Bearer ${useToken().value}`
    },
    onRequest({ request, options }) {
      // Set the request headers
      options.headers.Authorization = `Bearer ${useToken().value}`
    },
    onResponseError({ request, response, options }) {
      if (response.status == 401) {
          return resetUserAuth();
      }
    }
  })
  
  
  return {
    post,
    put
  }
}