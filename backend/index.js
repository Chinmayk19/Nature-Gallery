const port = 3001;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const nodemailer = require("nodemailer");
const { Console } = require("console");
const bcrypt = require("bcrypt");
const cloudinary=require("cloudinary");
const { secret_key } = require("./Config");

app.use(express.json());
app.use(cors());
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", reason.stack || reason);
});

// Database connection with MongoDB
mongoose.connect(
  "mongodb+srv://student1234:student1234567890@cluster0.tnajmkf.mongodb.net/onlinetutor"
);


// Schema for Users
const Users = mongoose.model("Users", {
  username: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  followers: {
    type: Array,
  },
  following: {
    type: Array,
  },
  userimg: {
    type: Array,
  },
  favourite: {
    type: Array,
  },
  likedimg: {
    type: Array,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});


// Schema for OTP

const OTP = mongoose.model("Otp", {
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: Number,
    required: true,
  },
});

// Schema for Images
const Images = mongoose.model("Images", {
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    defaultValue: 0,
  },
  name: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Image Storage Engine

// const storage = multer.diskStorage({
//   destination: "./Upload/images",
//   filename: (req, file, cb) => {
//     return cb(
//       null,
//       `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
//     );
//   },
// });

// const upload = multer({ storage: storage });

// app.use("/images", express.static("Upload/images"));
// app.post("/Upload", upload.single("image"), (req, res) => {
//   res.json({
//     success: 1,
//     image_url: `http://localhost:${port}/images/${req.file.filename}`,
//   });
// });

// Endpoint to add image
app.post("/addimage", async (req, res) => {
  try {
    
    const { category, image, name, username, email } = req.body;
    if (!category || !image || !name || !username || !email) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Find the user by username
    const user = await Users.findOne({ username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    let images = await Images.find({});
    let id;
    if (images.length > 0) {
      let last_image_array = images.slice(-1);
      let last_image = last_image_array[0];
      id = last_image.id + 1;
    } else {
      id = 1;
    }

    const imageUpload = new Images({
      id: id,
      category,
      image,
      name,
      user: user.username, 
      likes: 0,
      email,
    });

    await imageUpload.save();
    const imgarray = {
      id: imageUpload.id,
      category: imageUpload.category,
      image: imageUpload.image,
      likes: 0,
    };
    user.userimg.push(imgarray);
    user.save();
    res.json({
      success: true,
      message: "Image Uploaded",
    });
  } catch (error) {
    console.error("Error while uploading image:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload image",
      error: error.message,
    });
  }
});

app.get("/allimages", async (req, res) => {
  const fromDate = req.query.fromDate
    ? new Date(req.query.fromDate)
    : new Date(0);
  const toDate = req.query.toDate ? new Date(req.query.toDate) : new Date();
  let images = await Images.find({
    createdAt: { $gte: fromDate, $lte: toDate },
  }).sort({ createdAt: -1 });
  res.json(images);
});

app.get("/allusers", async (req, res) => {
  let users = await Users.find({});
  res.send(users);
});

// Function to generate a verification code
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000);
}
// email verification endpoint 
app.options("/send-verification-email", cors());
app.post("/send-verification-email", cors(), async (req, res) => {
  try {
    const { email } = req.body;
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, errors: "Invalid email format" });
    }

    const check = await Users.findOne({ username: req.body.username });
    if (check) {
      return res
        .status(400)
        .json({ success: false, errors: "Username Already Existed" });
    }
    const check2 = await Users.findOne({ email: req.body.email });
    if (check2) {
      return res
        .status(400)
        .json({ success: false, errors: "User Already Existed" });
    }
    const check3 = await OTP.findOne({ email: req.body.email });
    if (check3) {
      return res.status(400).json({
        success: false,
        errors:
          "Email already Sent.Check your Inbox or Click Resend Verification after 1 min",
      });
    }
    // Send a verification email
    const verificationCode = generateVerificationCode();
    checkVerificationCode(verificationCode);
    await sendVerificationEmail(email, verificationCode);

    const Otp = new OTP({
      email: req.body.email,
      otp: verificationCode,
    });
    await Otp.save();

    setTimeout(async () => {
      let deleteOtp = await OTP.findOneAndDelete({ email: req.body.email });
    }, 60000);

    res.json({
      success: true,
      message:
        "Verification email sent. Check your inbox and enter the code within 60 seconds.",
    });
  } catch (error) {
    console.error("Error in /send-verification-email:", error);
    res.status(500).json({ success: false, errors: "Internal server error" });
  }
});
function checkVerificationCode(verificationCode) {
  return verificationCode;
}

// login signup endpoint
app.post("/login", async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    const passCompare = await bcrypt.compare(req.body.password, user.password);
    if (passCompare) {
      const token = user.token;
      res.json({ success: true, token });
    } else {
      res.json({ success: false, errors: "Wrong Password" });
    }
  } else {
    res.json({ success: false, errors: "Wrong Email no" });
  }
});


app.post("/signup", async (req, res) => {
  if (!req.body.email) {
    return res.json({ success: false, message: "Email is required" });
  }
  const check = await Users.findOne({ username: req.body.username });
  if (check) {
    return res
      .status(400)
      .json({ success: false, message: "Username Already Existed" });
  }

  const existingUser = await Users.findOne({ email: req.body.email });
  if (existingUser) {
    return res.json({ success: false, message: "Email is already registered" });
  }
  const userinfo = await OTP.findOne({ email: req.body.email });
  if (userinfo) {
    let confirmOTP = Number.parseInt(req.body.confirmcode);
    if (confirmOTP === userinfo.otp) {
      const hashpassword = await bcrypt.hash(req.body.password, 10);
      let finduser = await Users.find({});
      let id;
      if (finduser.length > 0) {
        let last_image_array = finduser.slice(-1);
        let last_image = last_image_array[0];
        id = last_image.id + 1;
      } else {
        id = 1;
      }
      const user = new Users({
        id: id,
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
        password: hashpassword,
        followers: [],
        following: [],
        favourite: [],
        likedimg: [],
        userimg: Images,
        token: "_",
      });
      await user.save();
      const data = {
        user: {
          id: user.id,
        },
      };

      const token = jwt.sign(data, secret_key);
      user.token = token;
      await user.save();
      await OTP.findOneAndDelete({ email: req.body.email });

      return res.json({ success: true, token, message: "SignUp Successful" });
    } else {
      return res.json({ success: false, message: "Enter valid OTP" });
    }
  } else {
    return res.json({ success: false, message: "Verify Email First" });
  }
});

// Function to send a verification email
async function sendVerificationEmail(email, verificationCode) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "chinmaykspam@gmail.com",
        pass: "zbru egck beyv aiuz",
      },
    });
    const mailOptions = {
      from: "chinmaykspam@gmail.com",
      to: email,
      subject: "Email Verification",
      text: `Your verification code is: ${verificationCode}.OTP is valid for 60 seconds.`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent:", info.response);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error; // Propagate the error to handle it in the calling function
  }
}




// like-unlike img endpoint
app.options("/like-img", cors());
app.post("/like-img", cors(), async (req, res) => {
  try {
    const token = req.body.token;
    const image = req.body.image;
    const imguser = req.body.imguser;

    const user = await Users.findOne({ token: token });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
    const finduser = await Users.findOne({ username: imguser });
    if (!finduser) {
      return res.status(404).json({
        success: false,
        message: "User whose image is being liked not found.",
      });
    }

    const Img = await Images.findOne({ image: image });
    if (!Img) {
      return res
        .status(404)
        .json({ success: false, message:"Image not found."});
    }
    const finduserimage = finduser.userimg.find((e) => e.image === image);
    if (!finduserimage) {
      return res
        .status(404)
        .json({ success: false, message: "Image not found in user's images" });
    }
    const obj = {
      imagename: image,
      Username: imguser,
      Date:Date(),
    };
    user.likedimg.push(obj);

    Img.likes += 1;

    await Users.updateOne(
      { username: imguser, "userimg.image": image },
      { $set: { "userimg.$.likes": finduserimage.likes + 1 } }
    );
    await Promise.all([user.save(), Img.save(), finduser.save()]);
    res
      .status(200)
      .json({ success: true, message: "Image liked successfully." });
  } catch (error) {
    console.error("Error in /like-img:", error);
    res.status(500).json({ success: false, message: "Internal Server Error." });
  }
});

app.post("/unlike-img", async (req, res) => {
  try {
    const token = req.body.token;
    const image = req.body.image;
    const imguser = req.body.imguser;
    const user = await Users.findOne({ token: token });
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
    }
    const Img = await Images.findOne({ image: image });
    if (!Img) {
      res.status(404).json({ success: false, message: "Image Not found" });
    }
    const finduser = await Users.findOne({ username: imguser });
    if (!finduser) {
      res
      .status(404)
      .json({
        success: false,
        message: "User whose image is being liked not found. ",
      });
    }
    const finduserimage = finduser.userimg.find((e) => e.image === image);
    if (!finduserimage) {
      return res
      .status(404)
      .json({ success: false, message: "Image not found in user's images" });
    }
    const index = user.likedimg.findIndex(
      (obj) => obj.imagename === image && obj.Username === imguser
    );
    if (index !== -1) {
      user.likedimg.splice(index, 1);
      // await user.save();
    }
    Img.likes -= 1;
    // await Img.save();
    await Users.updateOne(
      { username: imguser, "userimg.image": image },
      { $set: { "userimg.$.likes": finduserimage.likes - 1 } }
    );
    // await finduser.save();
    await Promise.all([user.save(), Img.save(), finduser.save()]);
    res
    .status(200)
    .json({ success: true, message: "Image unliked successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});


// Add-remove fav endpoint
app.post("/add-fav", async (req, res) => {
  try {
    const token = req.body.token;
    const img = req.body.image;
    const imguser = req.body.imguser;
    const user = await Users.findOne({ token: token });
    if (user) {
      const obj = {
        image: img,
        Username: imguser,
        Date:Date.now(),
      };
      user.favourite.push(obj);
      user.save();
      res.json({ success: true, message: "Added to Favourites" });
    } else {
      res.json({ success: false, message: "user not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
app.post("/remove-fav", async (req, res) => {
  try {
    const token = req.body.token;
    const img = req.body.image;
    const imguser = req.body.imguser;
    
    const user = await Users.findOne({ token: token });
    if (user) {
      const index = user.favourite.findIndex(
        (obj) => obj.image === img && obj.Username === imguser
      );
      if (index !== -1) {
        user.favourite.splice(index, 1);
        user.save();
        res.json({
          success: true,
          message: "Image removed from Fav successfully.",
        });
      } else {
        res.json({ success: false, message: "Error in removing from Fav." });
      }
    } else {
      res.json({ success: false, message: "user not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

//Follow and unfollow endpoint

app.post("/follow", async (req, res) => {
  try {
    const token = req.body.token;
    const username = req.body.username;
    
    const userFollowing = await Users.findOne({ token: token });
    if (userFollowing) {
      const userFollowed = await Users.findOne({ username: username });
      if (userFollowed) {
        const obj = {
          username: username,
          date: Date(),
        };
        userFollowing.following.push(obj);
        userFollowing.save();
        const obj2 = {
          username: userFollowing.username,
          date: Date(),
        };
        userFollowed.followers.push(obj2);
        userFollowed.save();
        res.json({ success: true, message: "Followed" });
      } else {
        res.status(404).json({ success: false, message: "User not Found" });
      }
    } else {
      res.status(404).json({ success: false, message: "Login First" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

app.post("/unfollow", async (req, res) => {
  try {
    let token = req.body.token;
    let username = req.body.username;
    const userFollowing = await Users.findOne({ token: token });
    if (userFollowing) {
      const userFollowed = await Users.findOne({ username: username });
      if (userFollowed) {
        const follwingIndex = userFollowing.following.findIndex(
          (e) => e.username === username
        );
        if (follwingIndex !== -1) {
          userFollowing.following.splice(follwingIndex, 1);
          userFollowing.save();
        }
        const FollowerIndex = userFollowed.followers.findIndex(
          (e) => e.username === userFollowing.username
        );
        if (FollowerIndex !== 1) {
          userFollowed.followers.splice(FollowerIndex, 1);
          userFollowed.save();
        }
        res.json({ success: true, message: "Unfollowed" });
      } else {
        res.status(404).json({ success: false, message: "User not Found" });
      }
    } else {
      res.status(404).json({ success: false, message: "Login First" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
app.post("/deleteimg", async (req, res) => {
  try {
    const token = req.body.token;
    const img = req.body.image;
    const ImgUser = await Users.findOne({ token: token });
    if (!ImgUser) {
      res.status(404).json({ success: false, message: "User not found" });
    }
    const findImage = await Images.findOneAndDelete({ image: img });
    if (!findImage) {
      res.status(404).json({ success: false, message: "Image not found" });
    }
    
    const ImageIndex = ImgUser.userimg.findIndex((e) => e.image === img);
    if (ImageIndex !== -1) {
      ImgUser.userimg.splice(ImageIndex, 1);
      ImgUser.save();
    }
    // Remove the image from all users who liked it
    await Users.updateMany({ "likedimg.imagename": img }, { $pull: { likedimg: { imagename: img } } });
    
    // Remove the image from all users who added it to their favorites
    await Users.updateMany({ "favourite.image": img }, { $pull: { favourite: { image: img } } });
    
    res.status(200).json({success:true,message:"Post Deleted"});
  } catch (error) {
    res.status(501).json({ success: false, message: "Internal Server Error" });
    
  }
});

  app.listen(port, (error) => {
    if (!error) {
      console.log("Server running on port " + port);
    } else {
      console.log("Error: " + error);
    }
  });