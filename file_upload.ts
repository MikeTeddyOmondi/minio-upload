import { config } from 'dotenv'
import { Client } from 'minio'

config()

const { MINIO_ACCESS_KEY, MINIO_SECRET_KEY, MINIO_API_HOST } = process.env;

if (MINIO_ACCESS_KEY == undefined || MINIO_SECRET_KEY == undefined || MINIO_API_HOST == undefined) {
    console.error("[#] Configuration required!")
    process.exit(1);
}

const BUCKET_NAME = String("photos")

// Instantiate the minio client with
// the endpoint and access keys
var minioClient = new Client({
    endPoint: MINIO_API_HOST,
    port: 9000,
    useSSL: false,
    accessKey: MINIO_ACCESS_KEY,
    secretKey: MINIO_SECRET_KEY,
})

// File that needs to be uploaded.
var file = './javascript.png'

minioClient.bucketExists('photos', function (err, exists) {
    if (err) {
        return console.log(err)
    }

    // Create bucket if it doesn't exist
    if (!exists) {
        // Make a bucket called photos.
        minioClient.makeBucket('photos', 'us-east-1', function (err) {
            if (err) return console.log(err)
            console.log('Bucket created successfully in "us-east-1" region.')
        })
    }
    return console.log(`Bucket: ${BUCKET_NAME} exists...`)
})

let metaData = {
    'Content-Type': 'image',
    'X-Amz-Meta-Testing': 1234,
    example: 5678,
}

// Using fPutObject API upload your file to the bucket europetrip.
minioClient.fPutObject('photos', 'javascript.png', file, metaData, function (err, etag) {
    if (err) return console.log(err)
    console.log('File uploaded successfully!')
})
