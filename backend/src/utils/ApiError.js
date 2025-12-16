class ApiError extends Error{
    constructor(
        statusCode,
        message= 'Something went Wrong',
        error=[]
    ){
        super(message)
        this.statusCode = statusCode,
        this.message = message,
        this.data = null,
        this.success = false,
        this.error = error
        }
}

export default ApiError