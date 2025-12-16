import Redis from "ioredis";


const redis = new Redis({
  host: process.env.REDIS_HOST,      // from cloud
  port: process.env.REDIS_PORT,          
  password: process.env.REDIS_PASSWORD,
//   tls: {}                       // important: enables SSL
});

redis.on("connect", ()=>{
    console.log('Redis connected!')
})


export default redis