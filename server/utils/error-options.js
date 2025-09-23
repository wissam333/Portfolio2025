export default function (error) {
    return {
        statusCode: error?.response?.status ?? 444,
        message: error?.message ?? 'Error ::::: ',
        data: {
          responseBody: error.stack,
        },
    }
}