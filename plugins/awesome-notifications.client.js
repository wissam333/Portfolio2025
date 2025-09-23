import AWN from 'awesome-notifications';
export default defineNuxtPlugin((nuxtApp) => {
    const options = {
        position: 'top-right',
        durations: { global: 2000 },
    }

    return {
        provide: {
            awn: new AWN(options)
        }
    }
})