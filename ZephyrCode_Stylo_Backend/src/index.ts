
import dotenv from 'dotenv'
dotenv.config()

import { v4 as uuidv4 } from 'uuid';
// import express from "express"
import bodyParser from "body-parser"
import authenticationRouter from './routes/autheticationRouter'
import feedbackRouter from './routes/feedbackRouter'
import forgetRouter from './routes/forgotRouters'
import profileRouter from './routes/profileRouter'
import cors from 'cors'
// import { bucket } from "./constant/firebaseAdmin"
import multer from 'multer';
import stream from 'stream'

import express, { Request, Response } from 'express';
// import multer from 'multer';
import { PythonShell } from 'python-shell';
import path from 'path';
import fs from 'fs';
 import { PrismaClient } from '@prisma/client';
import admin from 'firebase-admin';
// import { v4 as uuidv4 } from 'uuid';

// import { dbDisconnector, prisma } from './prisma/database'






const app = express()
const PORT = 5000

process.env.NODE_OPTIONS = '--openssl-legacy-provider';

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(cors())


// app.use(express.json());

// // Define a route to insert hairstyles
// app.post('/hairstyles', async (req, res) => {
//   try {
//     const { gender, face_shape, age_range, hairLength, dresscode, imageLink, how_to_achieve, Products_to_achieve } = req.body;

//     const newHairstyle = await prisma.hairstyle.create({
//       data: {
//         gender,
//         face_shape,
//         age_range,
//         hairLength,
//         dresscode,
//         imageLink,
//         how_to_achieve,
//         Products_to_achieve
//       },
//     });

//     res.json(newHairstyle);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error creating hairstyle entry' });
//   }
// });



app.get('/', (req, res) => {
  return res.json({
    "Result": "Success"

  })

})

const users = ["asnaff"]

app.get('/users', (req, res) => {
  return res.send(users)
})

// const upload = multer();


// app.post('/upload', upload.single('file'), async (req, res) => {
//   if (!req.file) {
//     return res.status(400).send('No file uploaded.');
//   }

//   const fileName = req.file.originalname;
//   const fileBuffer = req.file.buffer;

//   console.log({
//     file: req.file
//   })

//   const blob = bucket.file(fileName);
//   const blobStream = blob.createWriteStream({
//     metadata: {
//       contentType: req.file.mimetype,
//       metadata: {
//         firebaseStorageDownloadTokens: uuidv4() // Generate a download token
//       }
//     }
//   });

//   blobStream.on('error', (err) => {
//     console.error('Error uploading file:', err);
//     res.status(500).send('Error uploading file.');
//   });

//   blobStream.on('finish', () => {
//     //@ts-ignore
//     const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(blob.name)}?alt=media&token=${blob.metadata.metadata.firebaseStorageDownloadTokens}`;
//     res.status(200).send({ fileName, url: publicUrl });
//   });

//   blobStream.end(fileBuffer);

// });


// Firebase setup
const serviceAccount = require('./constant/zephyrcode-firebase-adminsdk-9fxps-ad336a51bf.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://zephyrcode.appspot.com'
});
const bucket = admin.storage().bucket();


const prisma = new PrismaClient();

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

app.use(express.json());

app.post('/analyze-face', upload.fields([{ name: 'front_face' }, { name: 'side_face' }]), async (req: Request, res: Response) => {
  const frontFacePath = (req.files as { [fieldname: string]: Express.Multer.File[] })['front_face'][0].path;
  const sideFacePath = (req.files as { [fieldname: string]: Express.Multer.File[] })['side_face'][0].path;
  const { email, gender, ageRange, dressCode, hairLength } = req.body;

  let faceShapeResult = '';
  let baldnessResultFront = '';
  let baldnessResultSide = '';
  let frontImageUrl = '';
  let sideImageUrl = '';
  let hairstyleTransferredImageUrl = ''; // Placeholder for the hairstyle transferred image URL



  // const options = {
  //   mode: 'text',
  //   pythonPath: path.join(__dirname, '../ml_service/venv/Scripts/python'), // Specify the Python executable in the virtual environment
  //   args: [frontFacePath]
  // };

  try {
// Define the base options
const baseOptions: Parameters<typeof PythonShell.run>[1] = {
  mode: 'text',
  pythonPath: path.join(__dirname, '../../venv_zc/python'),
};

// Run face shape classifier
faceShapeResult = await new Promise<string>(async (resolve, reject) => {
  const options = {
    ...baseOptions,
    args: [frontFacePath]
  };

  try {
    const results = await PythonShell.run(path.join(__dirname, '../ml_service/face_shape_classifier.py'), options);
    // resolve(results && results.length > 0 ? results[0] : '');
    resolve(results && results.length > 0 ? results[2] : '');
  } catch (err) {
    reject(err);
  }
});

// Run baldness detector for front face
baldnessResultFront = await new Promise<string>(async (resolve, reject) => {
  const frontOptions = {
    ...baseOptions,
    args: [frontFacePath, 'front']
  };

  try {
    const results = await PythonShell.run(path.join(__dirname, '../ml_service/baldness_detector.py'), frontOptions);
    resolve(results && results.length > 0 ? results[0] : '');
    console.log(results[0])
  } catch (err) {
    reject(err);
  }
});

// Run baldness detector for side face
baldnessResultSide = await new Promise<string>(async (resolve, reject) => {
  const sideOptions = {
    ...baseOptions,
    args: [sideFacePath, 'side']
  };

  try {
    const results = await PythonShell.run(path.join(__dirname, '../ml_service/baldness_detector.py'), sideOptions);
    resolve(results && results.length > 0 ? results[20] : '');
    console.log(results[20])
  } catch (err) {
    reject(err);
  }
});

    if (baldnessResultFront === 'No Bald' && baldnessResultSide === 'No Bald') {
      // Fetch hairstyle recommendations from the database
      const recommendations = await prisma.hairstyle.findMany({
        where: {
          face_shape: faceShapeResult,
          gender: gender,
          age_range: ageRange,
          dresscode: dressCode,
          hairLength: hairLength
        }
      });

      // Upload front face image to Firestore
      frontImageUrl = await uploadToFirestore(frontFacePath, 'front_face');

      // Upload side face image to Firestore
      sideImageUrl = await uploadToFirestore(sideFacePath, 'side_face');

      // Save details to userhistory table
      await prisma.userHistory.create({
        data: {
          email: email,
          front_image_link: frontImageUrl,
          side_image_link: sideImageUrl,
          gender: gender,
          faceshape: faceShapeResult,
          hairstyle_transferred_image_link: hairstyleTransferredImageUrl, // Update this once you implement the hairstyle transfer logic
          actionDateTime: new Date().toISOString(), // Use full ISO-8601 DateTime string
          agerange: ageRange,
          dresscode: dressCode,
          hairlength: hairLength
        }
      });

      res.json({ faceShape: faceShapeResult, recommendations });
    } else {
      res.json({ faceShape: faceShapeResult, message: "Sorry, don't have suggestions." });
    }

    // Cleanup uploaded files
    fs.unlinkSync(frontFacePath);
    fs.unlinkSync(sideFacePath);
  } catch (err) {
    res.status(500).send((err as Error).message);
  }
});
  
  async function uploadToFirestore(filePath: string, fileType: string): Promise<string> {
    const fileName = path.basename(filePath);
    const blob = bucket.file(`${fileType}/${fileName}`);
    const fileBuffer = fs.readFileSync(filePath);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: 'image/jpeg',
        metadata: {
          firebaseStorageDownloadTokens: uuidv4() // Generate a download token
        }
      }
    });
  
    return new Promise<string>((resolve, reject) => {
      blobStream.on('error', (err) => {
        reject('Error uploading file: ' + err);
      });
  
      blobStream.on('finish', () => {
        const downloadToken = blob.metadata?.metadata?.firebaseStorageDownloadTokens || '';
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(blob.name)}?alt=media&token=${downloadToken}`;
        resolve(publicUrl);
      });
  
      blobStream.end(fileBuffer);
    });
  }



  // app.get('/user-history', async (req, res) => {
  //   const { email } = req.body; // Retrieve the email from the query parameters
  
  //   if (!email) {
  //     return res.status(400).json({ error: 'Email is required' });
  //   }
  
  //   try {
  //     const userHistory = await prisma.userHistory.findMany({
  //       where: { email: email },
  //     });
  
  //     if (userHistory.length === 0) {
  //       return res.status(404).json({ error: 'No history found for this email' });
  //     }
  
  //     return res.status(200).json(userHistory);
  //   } catch (error) {
  //     console.error('Error retrieving user history:', error);
  //     return res.status(500).json({ error: 'Internal server error' });
  //   }
  // });



app.post('/users', (req, res) => {
  console.log("params", req.body)
  const newUser = req.body.username
  users.push(newUser)
  return res.send("success")
})



app.get('/user-history', async (req, res) => {
  const email = Array.isArray(req.query.email) ? req.query.email[0] : req.query.email;

if (typeof email === 'string') {
  const history = await prisma.userHistory.findMany({
    where: { email },
    orderBy: { actionDateTime: 'desc' },
  });
  res.json(history);
} else {
  res.status(400).json({ error: 'Invalid email format' });
}

});



app.get('/posts', async (req, res) => {
  try {
      const posts = await prisma.post.findMany({
          include: {
              user: {
                  select: {
                      userName: true,
                      profilePicture: true,
                  },
              },
              votes: {
                select: {
                    voteType: true,
                    // userEmail: true, // Include user email to check reactions
                },
            },
          },
      });

      // Map posts to include aggregated reaction counts
      const formattedPosts = posts.map((post) => {
          const thumbsUp = post.votes.filter((vote) => vote.voteType === 'up').length;
          const thumbsDown = post.votes.filter((vote) => vote.voteType === 'down').length;

          return {
              ...post,
              thumbsUp,
              thumbsDown,
          };
      });

      res.status(200).json(formattedPosts);
  } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ error: 'Unable to fetch posts' });
  }
});



app.post('/posts', async (req, res) => {
  const { email, imageUri } = req.body;

  const imageUrl = imageUri;

  // Basic validation
  if (!email || !imageUri) {
    return res.status(400).json({ message: 'Email and imageUrl are required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const post = await prisma.post.create({
      data: {
        userId: user.id,
        imageUrl,
      },
    });

    console.log('Post created:', post);
    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Unable to create post' });
  }
});



app.post('/posts/:postId/react', async (req, res) => {
  const { email, voteType } = req.body;
  const { postId } = req.params;

  try {
      const user = await prisma.user.findUnique({
          where: { email },
      });

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const existingVote = await prisma.vote.findUnique({
          where: {
              userId_postId: {
                  userId: user.id,
                  postId: Number(postId),
              },
          },
      });

      if (existingVote) {
          // Update vote if it differs from the current one
          if (existingVote.voteType !== voteType) {
              await prisma.vote.update({
                  where: { voteId: existingVote.voteId },
                  data: { voteType },
              });

              // Update thumbsUp and thumbsDown in Posts table
              const incrementField = voteType === 'up' ? 'thumbsUp' : 'thumbsDown';
              const decrementField = voteType === 'up' ? 'thumbsDown' : 'thumbsUp';

              await prisma.post.update({
                  where: { postId: Number(postId) },
                  data: {
                      [incrementField]: { increment: 1 },
                      [decrementField]: { decrement: 1 },
                  },
              });

              return res.status(200).json({ message: 'Vote updated successfully' });
          }

          return res.status(400).json({ message: 'You already reacted with this type' });
      }

      // Add new vote
      await prisma.vote.create({
          data: {
              userId: user.id,
              postId: Number(postId),
              voteType,
          },
      });

      // Increment the corresponding reaction count in Posts table
      const incrementField = voteType === 'up' ? 'thumbsUp' : 'thumbsDown';

      await prisma.post.update({
          where: { postId: Number(postId) },
          data: { [incrementField]: { increment: 1 } },
      });

      res.status(201).json({ message: 'Vote added successfully' });
  } catch (error) {
      console.error('Error reacting to post:', error);
      res.status(500).json({ error: 'Unable to react to post' });
  }
});


app.use(authenticationRouter)
app.use(feedbackRouter)
app.use(forgetRouter)
app.use(profileRouter)


app.listen(PORT, () => {
  console.log("Backend is running on", PORT)
})






/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// import dotenv from 'dotenv'
// dotenv.config()

// import { v4 as uuidv4 } from 'uuid';
// // import express from "express"
// import bodyParser from "body-parser"
// import authenticationRouter from './routes/autheticationRouter'
// import feedbackRouter from './routes/feedbackRouter'
// import forgetRouter from './routes/forgotRouters'
// import profileRouter from './routes/profileRouter'
// import cors from 'cors'
// // import { bucket } from "./constant/firebaseAdmin"
// import multer from 'multer';
// import stream from 'stream'

// import express, { Request, Response } from 'express';
// // import multer from 'multer';
// import { PythonShell } from 'python-shell';
// import path from 'path';
// import fs from 'fs';
//  import { PrismaClient } from '@prisma/client';
// import admin from 'firebase-admin';
// // import { v4 as uuidv4 } from 'uuid';

// // import { dbDisconnector, prisma } from './prisma/database'






// const app = express()
// const PORT = 5000

// process.env.NODE_OPTIONS = '--openssl-legacy-provider';

// // parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }))

// // parse application/json
// app.use(bodyParser.json())
// app.use(cors())


// app.use(express.json());

// // // Define a route to insert hairstyles
// // app.post('/hairstyles', async (req, res) => {
// //   try {
// //     const { gender, face_shape, age_range, hairLength, dresscode, imageLink, how_to_achieve, Products_to_achieve } = req.body;

// //     const newHairstyle = await prisma.hairstyle.create({
// //       data: {
// //         gender,
// //         face_shape,
// //         age_range,
// //         hairLength,
// //         dresscode,
// //         imageLink,
// //         how_to_achieve,
// //         Products_to_achieve
// //       },
// //     });

// //     res.json(newHairstyle);
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ error: 'Error creating hairstyle entry' });
// //   }
// // });

// // start here .....................................................................................
// app.post('/hairstyles', async (req, res) => {
//   try {
//     const hairstyles = req.body; // Expecting an array of hairstyle objects

//     if (!Array.isArray(hairstyles) || hairstyles.length === 0) {
//       return res.status(400).json({ error: 'Request body must be a non-empty array of hairstyles.' });
//     }

//     const createdHairstyles = await prisma.hairstyle.createMany({
//       data: hairstyles,
//       skipDuplicates: true, // Avoids creating duplicate entries if required
//     });

//     res.status(201).json({
//       message: `${createdHairstyles.count} hairstyle(s) added successfully.`,
//     });
//   } catch (error) {
//     console.error('Error inserting hairstyles:', error);
//     res.status(500).json({ error: 'Failed to insert hairstyles.' });
//   }
// });

// //end  here ......................................................................................


// app.get('/', (req, res) => {
//   return res.json({
//     "Result": "Success"

//   })

// })

// const users = ["asnaff"]

// app.get('/users', (req, res) => {
//   return res.send(users)
// })

// // const upload = multer();


// // app.post('/upload', upload.single('file'), async (req, res) => {
// //   if (!req.file) {
// //     return res.status(400).send('No file uploaded.');
// //   }

// //   const fileName = req.file.originalname;
// //   const fileBuffer = req.file.buffer;

// //   console.log({
// //     file: req.file
// //   })

// //   const blob = bucket.file(fileName);
// //   const blobStream = blob.createWriteStream({
// //     metadata: {
// //       contentType: req.file.mimetype,
// //       metadata: {
// //         firebaseStorageDownloadTokens: uuidv4() // Generate a download token
// //       }
// //     }
// //   });

// //   blobStream.on('error', (err) => {
// //     console.error('Error uploading file:', err);
// //     res.status(500).send('Error uploading file.');
// //   });

// //   blobStream.on('finish', () => {
// //     //@ts-ignore
// //     const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(blob.name)}?alt=media&token=${blob.metadata.metadata.firebaseStorageDownloadTokens}`;
// //     res.status(200).send({ fileName, url: publicUrl });
// //   });

// //   blobStream.end(fileBuffer);

// // });

// // start form here................................................................................................................


// const upload = multer();

// interface MulterRequest extends Request {
//   files: Express.Multer.File[]; // Extending the Request type to include `files`
// }

// app.post('/upload', upload.array('files'), async (req: Request, res: Response) => {
//   const typedReq = req as MulterRequest;

//   if (!typedReq.files || typedReq.files.length === 0) {
//     return res.status(400).send('No files uploaded.');
//   }

//   const folderName = req.body.folderName || 'default-folder'; // Folder name from request body
//   const uploadResults: { fileName: string; folder: string; url: string }[] = [];

//   try {
//     for (const file of typedReq.files) {
//       const fileName = file.originalname;
//       const fileBuffer = file.buffer;

//       // Construct file path with folder name
//       const filePath = `${folderName}/${fileName}`;

//       // Create blob for Firebase Storage
//       const blob = bucket.file(filePath);
//       const blobStream = blob.createWriteStream({
//         metadata: {
//           contentType: file.mimetype,
//           metadata: {
//             firebaseStorageDownloadTokens: uuidv4(), // Generate a download token
//           },
//         },
//       });

//       // Upload file using a Promise
//       await new Promise<void>((resolve, reject) => {
//         blobStream.on('error', (err) => {
//           console.error('Error uploading file:', err);
//           reject(err);
//         });

//         blobStream.on('finish', () => {
//           const token = blob.metadata?.metadata?.firebaseStorageDownloadTokens;
//           if (!token) {
//             console.error('Firebase storage token is undefined.');
//             reject(new Error('Firebase storage token is undefined.'));
//             return;
//           }

//           const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(blob.name)}?alt=media&token=${token}`;
//           uploadResults.push({ fileName, folder: folderName, url: publicUrl });
//           resolve();
//         });

//         blobStream.end(fileBuffer);
//       });
//     }

//     res.status(200).send({
//       message: 'Files uploaded successfully',
//       uploads: uploadResults,
//     });
//   } catch (error) {
//     console.error('Error uploading files:', error);
//     res.status(500).send('Error uploading files.');
//   }
// });

// // ends here............................................................

// // Firebase setup
// const serviceAccount = require('./constant/zephyrcode-firebase-adminsdk-9fxps-ad336a51bf.json');
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: 'gs://zephyrcode.appspot.com'
// });
// const bucket = admin.storage().bucket();


// const prisma = new PrismaClient();

// // Configure multer for file uploads
// // const upload = multer({ dest: 'uploads/' });

// app.use(express.json());

// app.post('/analyze-face', upload.fields([{ name: 'front_face' }, { name: 'side_face' }]), async (req: Request, res: Response) => {
//   const frontFacePath = (req.files as { [fieldname: string]: Express.Multer.File[] })['front_face'][0].path;
//   const sideFacePath = (req.files as { [fieldname: string]: Express.Multer.File[] })['side_face'][0].path;
//   const { email, gender, ageRange, dressCode, hairLength } = req.body;

//   let faceShapeResult = '';
//   let baldnessResultFront = '';
//   let baldnessResultSide = '';
//   let frontImageUrl = '';
//   let sideImageUrl = '';
//   let hairstyleTransferredImageUrl = ''; // Placeholder for the hairstyle transferred image URL



//   // const options = {
//   //   mode: 'text',
//   //   pythonPath: path.join(__dirname, '../ml_service/venv/Scripts/python'), // Specify the Python executable in the virtual environment
//   //   args: [frontFacePath]
//   // };

//   try {
// // Define the base options
// const baseOptions: Parameters<typeof PythonShell.run>[1] = {
//   mode: 'text',
//   pythonPath: path.join(__dirname, '../../venv_zc/python'),
// };

// // Run face shape classifier
// faceShapeResult = await new Promise<string>(async (resolve, reject) => {
//   const options = {
//     ...baseOptions,
//     args: [frontFacePath]
//   };

//   try {
//     const results = await PythonShell.run(path.join(__dirname, '../ml_service/face_shape_classifier.py'), options);
//     // resolve(results && results.length > 0 ? results[0] : '');
//     resolve(results && results.length > 0 ? results[2] : '');
//   } catch (err) {
//     reject(err);
//   }
// });

// // Run baldness detector for front face
// baldnessResultFront = await new Promise<string>(async (resolve, reject) => {
//   const frontOptions = {
//     ...baseOptions,
//     args: [frontFacePath, 'front']
//   };

//   try {
//     const results = await PythonShell.run(path.join(__dirname, '../ml_service/baldness_detector.py'), frontOptions);
//     resolve(results && results.length > 0 ? results[0] : '');
//     console.log(results[0])
//   } catch (err) {
//     reject(err);
//   }
// });

// // Run baldness detector for side face
// baldnessResultSide = await new Promise<string>(async (resolve, reject) => {
//   const sideOptions = {
//     ...baseOptions,
//     args: [sideFacePath, 'side']
//   };

//   try {
//     const results = await PythonShell.run(path.join(__dirname, '../ml_service/baldness_detector.py'), sideOptions);
//     resolve(results && results.length > 0 ? results[20] : '');
//     console.log(results[20])
//   } catch (err) {
//     reject(err);
//   }
// });

//     if (baldnessResultFront === 'No Bald' && baldnessResultSide === 'No Bald') {
//       // Fetch hairstyle recommendations from the database
//       const recommendations = await prisma.hairstyle.findMany({
//         where: {
//           face_shape: faceShapeResult,
//           gender: gender,
//           age_range: ageRange,
//           dresscode: dressCode,
//           hairLength: hairLength
//         }
//       });

//       // Upload front face image to Firestore
//       frontImageUrl = await uploadToFirestore(frontFacePath, 'front_face');

//       // Upload side face image to Firestore
//       sideImageUrl = await uploadToFirestore(sideFacePath, 'side_face');

//       // Save details to userhistory table
//       await prisma.userHistory.create({
//         data: {
//           email: email,
//           front_image_link: frontImageUrl,
//           side_image_link: sideImageUrl,
//           gender: gender,
//           faceshape: faceShapeResult,
//           hairstyle_transferred_image_link: hairstyleTransferredImageUrl, // Update this once you implement the hairstyle transfer logic
//           actionDateTime: new Date().toISOString(), // Use full ISO-8601 DateTime string
//           agerange: ageRange,
//           dresscode: dressCode,
//           hairlength: hairLength
//         }
//       });

//       res.json({ faceShape: faceShapeResult, recommendations });
//     } else {
//       res.json({ faceShape: faceShapeResult, message: "Sorry, don't have suggestions." });
//     }

//     // Cleanup uploaded files
//     fs.unlinkSync(frontFacePath);
//     fs.unlinkSync(sideFacePath);
//   } catch (err) {
//     res.status(500).send((err as Error).message);
//   }
// });
  
//   async function uploadToFirestore(filePath: string, fileType: string): Promise<string> {
//     const fileName = path.basename(filePath);
//     const blob = bucket.file(`${fileType}/${fileName}`);
//     const fileBuffer = fs.readFileSync(filePath);
//     const blobStream = blob.createWriteStream({
//       metadata: {
//         contentType: 'image/jpeg',
//         metadata: {
//           firebaseStorageDownloadTokens: uuidv4() // Generate a download token
//         }
//       }
//     });
  
//     return new Promise<string>((resolve, reject) => {
//       blobStream.on('error', (err) => {
//         reject('Error uploading file: ' + err);
//       });
  
//       blobStream.on('finish', () => {
//         const downloadToken = blob.metadata?.metadata?.firebaseStorageDownloadTokens || '';
//         const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(blob.name)}?alt=media&token=${downloadToken}`;
//         resolve(publicUrl);
//       });
  
//       blobStream.end(fileBuffer);
//     });
//   }







// app.post('/users', (req, res) => {
//   console.log("params", req.body)
//   const newUser = req.body.username
//   users.push(newUser)
//   return res.send("success")
// })

// app.get('/user-history', async (req, res) => {
//   const email = Array.isArray(req.query.email) ? req.query.email[0] : req.query.email;

// if (typeof email === 'string') {
//   const history = await prisma.userHistory.findMany({
//     where: { email },
//     orderBy: { actionDateTime: 'desc' },
//   });
//   res.json(history);
// } else {
//   res.status(400).json({ error: 'Invalid email format' });
// }

// });

// // app.get('/posts', async (req, res) => {
// //   try {
// //       const posts = await prisma.post.findMany({
// //           include: {
// //               user: {
// //                   select: {
// //                       userName: true,
// //                       profilePicture: true,
// //                       email: true,
// //                   },
// //               },
// //           },
// //           orderBy: {
// //               createdAt: 'desc',
// //           },
// //       });
// //       res.status(200).json(posts);
// //   } catch (error) {
// //       console.error('Error fetching posts:', error);
// //       res.status(500).json({ error: 'Unable to fetch posts' });
// //   }
// // });

// app.get('/posts', async (req, res) => {
//   try {
//       const posts = await prisma.post.findMany({
//           include: {
//               user: {
//                   select: {
//                       userName: true,
//                       profilePicture: true,
//                   },
//               },
//               votes: {
//                 select: {
//                     voteType: true,
//                     // userEmail: true, // Include user email to check reactions
//                 },
//             },
//           },
//       });

//       // Map posts to include aggregated reaction counts
//       const formattedPosts = posts.map((post) => {
//           const thumbsUp = post.votes.filter((vote) => vote.voteType === 'up').length;
//           const thumbsDown = post.votes.filter((vote) => vote.voteType === 'down').length;

//           return {
//               ...post,
//               thumbsUp,
//               thumbsDown,
//           };
//       });

//       res.status(200).json(formattedPosts);
//   } catch (error) {
//       console.error('Error fetching posts:', error);
//       res.status(500).json({ error: 'Unable to fetch posts' });
//   }
// });



// app.post('/posts', async (req, res) => {
//   const { email, imageUri } = req.body;

//   const imageUrl = imageUri;

//   // Basic validation
//   if (!email || !imageUri) {
//     return res.status(400).json({ message: 'Email and imageUrl are required' });
//   }

//   try {
//     const user = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const post = await prisma.post.create({
//       data: {
//         userId: user.id,
//         imageUrl,
//       },
//     });

//     console.log('Post created:', post);
//     res.status(201).json({ message: 'Post created successfully', post });
//   } catch (error) {
//     console.error('Error creating post:', error);
//     res.status(500).json({ error: 'Unable to create post' });
//   }
// });



// app.post('/posts/:postId/react', async (req, res) => {
//   const { email, voteType } = req.body;
//   const { postId } = req.params;

//   try {
//       const user = await prisma.user.findUnique({
//           where: { email },
//       });

//       if (!user) {
//           return res.status(404).json({ message: 'User not found' });
//       }

//       const existingVote = await prisma.vote.findUnique({
//           where: {
//               userId_postId: {
//                   userId: user.id,
//                   postId: Number(postId),
//               },
//           },
//       });

//       if (existingVote) {
//           // Update vote if it differs from the current one
//           if (existingVote.voteType !== voteType) {
//               await prisma.vote.update({
//                   where: { voteId: existingVote.voteId },
//                   data: { voteType },
//               });

//               // Update thumbsUp and thumbsDown in Posts table
//               const incrementField = voteType === 'up' ? 'thumbsUp' : 'thumbsDown';
//               const decrementField = voteType === 'up' ? 'thumbsDown' : 'thumbsUp';

//               await prisma.post.update({
//                   where: { postId: Number(postId) },
//                   data: {
//                       [incrementField]: { increment: 1 },
//                       [decrementField]: { decrement: 1 },
//                   },
//               });

//               return res.status(200).json({ message: 'Vote updated successfully' });
//           }

//           return res.status(400).json({ message: 'You already reacted with this type' });
//       }

//       // Add new vote
//       await prisma.vote.create({
//           data: {
//               userId: user.id,
//               postId: Number(postId),
//               voteType,
//           },
//       });

//       // Increment the corresponding reaction count in Posts table
//       const incrementField = voteType === 'up' ? 'thumbsUp' : 'thumbsDown';

//       await prisma.post.update({
//           where: { postId: Number(postId) },
//           data: { [incrementField]: { increment: 1 } },
//       });

//       res.status(201).json({ message: 'Vote added successfully' });
//   } catch (error) {
//       console.error('Error reacting to post:', error);
//       res.status(500).json({ error: 'Unable to react to post' });
//   }
// });

// // app.post('/posts/:postId/react', async (req, res) => {
// //   const { email, reaction } = req.body;
// //   const { postId } = req.params;

// //   try {
// //       const incrementField = reaction === 'up' ? 'thumbsUp' : 'thumbsDown';
// //       const decrementField = reaction === 'up' ? 'thumbsDown' : 'thumbsUp';

// //       const existingVote = await prisma.post.findUnique({
// //           where: { email_postId: { email, postId: Number(postId) } },
// //       });

// //       if (existingVote) {
// //           if (existingVote.reaction === reaction) {
// //               return res.status(400).json({ message: 'Already reacted' });
// //           }

// //           await prisma.vote.update({
// //               where: { id: existingVote.id },
// //               data: { reaction },
// //           });

// //           await prisma.post.update({
// //               where: { id: Number(postId) },
// //               data: {
// //                   [incrementField]: { increment: 1 },
// //                   [decrementField]: { decrement: 1 },
// //               },
// //           });

// //           return res.status(200).json({ message: 'Reaction updated successfully' });
// //       }

// //       await prisma.vote.create({
// //           data: {
// //               email,
// //               postId: Number(postId),
// //               reaction,
// //           },
// //       });

// //       await prisma.post.update({
// //           where: { id: Number(postId) },
// //           data: { [incrementField]: { increment: 1 } },
// //       });

// //       res.status(201).json({ message: 'Reaction added successfully' });
// //   } catch (error) {
// //       console.error('Error reacting to post:', error);
// //       res.status(500).json({ error: 'Unable to react to post' });
// //   }
// // });


// app.use(authenticationRouter)
// app.use(feedbackRouter)
// app.use(forgetRouter)
// app.use(profileRouter)


// app.listen(PORT, () => {
//   console.log("Backend is running on", PORT)
// })




