import Redis from "ioredis"; // Import Redis library

/* @author: Jagraj Kaur
   @FileDescription: Redis Client configuration to connect with the Redis container 
   (connected on default port 6379)
*/

const redisClient = new Redis();

// check redis connection status
redisClient.on("connect", () => {
    console.log("Redis Client connected");
});

redisClient.on("error", (err) => {
    console.log("Error in Redis Client connection:", err);
});

export default redisClient;
