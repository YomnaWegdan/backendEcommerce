import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv"
import path from 'path'
dotenv.config({path:path.resolve(".env")})

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.cloudName, 
        api_key: process.env.apiKeyCloudinary , 
        api_secret: process.env.apiSecretCloudinary
    });
    
    export default cloudinary