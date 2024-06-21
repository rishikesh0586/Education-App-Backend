// import {Redis} from 'ioredis';
// require('dotenv').config();

// const redisClient = () => {
//     if(process.env.REDIS_URL){
//         console.log(`Redis connected`);
//         return process.env.REDIS_URL;
//     }
//     throw new Error('Redis connection failed');
// };
//  const redis = new Redis(redisClient(), {
//     connectTimeout: 1000, // Increase the timeout to 10 seconds
//     retryStrategy: (times) => {
//         // Exponential backoff strategy for retries
//         return Math.min(times * 50, 2000);
//     },
// });


// redis.on('error', (err:any) => {
//     console.error('Redis connection error:', err);
// });

// redis.on('connect', () => {
//     console.log('Connected to Redis');
// });

// redis.on('ready', () => {
//     console.log('Redis is ready');
// });

// redis.on('reconnecting', (delay:any) => {
//     console.log(`Reconnecting to Redis in ${delay} ms...`);
// });

// redis.on('end', () => {
//     console.log('Redis connection closed');
// });

// export {redis};



import {Redis} from 'ioredis';
require('dotenv').config();

const redisClient = () => {
    if(process.env.REDIS_URL){
        console.log(`Redis connected`);
        return process.env.REDIS_URL;
    }
    throw new Error('Redis connection failed');
};

export const redis = new Redis(redisClient());
