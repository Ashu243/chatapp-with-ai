import cookie from "cookie";
import Project from "../models/project.models.js";
import ApiError from "../utils/ApiError.js";
import jwt from 'jsonwebtoken'


export const socketAuth = async(socket, next)=>{
      try {
        const rawCookies = socket.request.headers.cookie;

        if (!rawCookies) {
            return next(new Error("No cookies sent"));
        }

        const cookies = cookie.parse(rawCookies);
        const token = cookies.accessToken;

        if (!token) throw new ApiError(404, 'unauthorized User!')

        // verify token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        if (!decoded) throw new ApiError(400, 'invalid token!')

        socket.userId = decoded._id
        next()

     } catch (error) {
    next(new ApiError(401, "Invalid token")) // socket.IO expects errors to be passed to next().
  }

}