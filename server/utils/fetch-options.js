export default function (apiBase, mainToken) {
    return {
        baseURL: apiBase,
        headers: {
            'Accept-Language': 'en-US',
            'Authorization': `Bearer ${mainToken}`
        }
    }
}