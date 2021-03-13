const express = require('express');
const app = express();
const mongoose = require('mongoose');
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const multer = require('multer');
//const bodyParser = require('body-parser');
const myIpAddress = "172.20.15.3";

// for parsing application/json
app.use(express.json()); 

// for parsing application/xwww-form-urlencoded
app.use(express.urlencoded({ extended: true })); 

// for parsing multipart/form-data

// ======= Kết nối dến mongodb
const mongoURL = 'mongodb+srv://nothingCanStopMe2k:9vjYfi3oIugjeQCU@cluster0.hi4qb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
mongoose.connect(mongoURL, {
    useNewUrlParser: true
})
mongoose.connection.once("open", ()=>{
    console.log("Connected Success")
})
mongoose.connection.on("error", (err)=>{
    console.log("Connected Failure: ", err)
})



require('./Song');
require('./Users');
require('./Post');
const Song = mongoose.model('song'), 
    Users = mongoose.model('users'),
    Post = mongoose.model('post');

//Lưu file ảnh, lên gg drive (Đườg dẫn nên để tên trường là 'file')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './images')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
var upload = multer({ storage: storage }).single('file');

app.post('/upload', (req, res) => {

    let auth1;
    const SCOPES = ['https://www.googleapis.com/auth/drive'];
    const TOKEN_PATH = 'token.json';

    //Read credentials.json
    fs.readFile('credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Drive API.
        authorize(JSON.parse(content), () => {});
    });
    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * The callback to call with the authorized client.
     */
    function authorize(credentials, callback) {
        const {client_secret, client_id, redirect_uris} = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);
        auth1 = oAuth2Client;
   
   
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        console.log("TOKEN:", TOKEN_PATH);
        if (err) return getAccessToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
    }

    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     The callback for the authorized client.
    */
    function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
            if (err) return console.error(err);
            console.log('Token stored to', TOKEN_PATH);
        });
        callback(oAuth2Client);
        });
    });
    }

    let detailPost; //Biến này dùng để lưu những thông tin kèm theo khi user post ảnh.
    function listFiles() {
        const drive = google.drive({version: 'v3', auth: auth1});
        drive.files.list({
          pageSize: 1,
          fields: 'nextPageToken, files(id, name)',
        }, (err, res) => {
          if (err) return console.log('The API returned an error: ' + err);
          const files = res.data.files;
          if (files.length) {
            //Lưu file vào database.
            const today = new Date(Date.now());

            const post = new Post({
                userId: 'null',
                caption: detailPost.caption,
                creation: today.toUTCString(),
                mediaUrl: "https://drive.google.com/uc?id=" + files[0].id
            })
            post.save();
            
          } 
          else {
            console.log('No files found.');
          }
        });
      }

    //   ----------------------------------------- Những thứ mà user post lên sẽ năm trong phần req.body ở trong hàm Upload() sau.
    upload(req, res, function(err){
        if(err) 
            console.log(err); 
        else{
            detailPost = req.body;
            const drive = google.drive({version: 'v3', auth: auth1});
            const fileMetaData = {
                name: req.file.filename
            }
            const media = {
                mimeType: req.file.mimetype,
                body: fs.createReadStream(req.file.path)
            }
            drive.files.create({
                resource: fileMetaData,
                media: media,
                fields: "id"
            }, err => {
                if(err){
                    console.log(err)
                }
                else {
                    //Xóa file trong folder images (local)
                    fs.unlinkSync(req.file.path);
                    console.log("Uploaded!, waiting to save to database...")
                }
            })
            //Set thời gian để dữ lấy id của file vừa upload.
            setTimeout(()=>{
                fs.readFile('credentials.json', (err, content) => {
                    if (err) return console.log('Error loading client secret file:', err);
                    // Authorize a client with credentials, then call the Google Drive API.
                    authorize(JSON.parse(content), listFiles);
                });
            }, 10000)

        }
    }) 
    
})

app.post('/send-data-user', (req, res) => {
    console.log(req.body);
    const user = new Users({
        email: req.body.email,
        nameUsers: req.body.nameUsers,
        ageUsers: req.body.ageUsers,
        password: req.body.password
    })
    user.save()
    .then(data => {
        console.log(data)
    }).catch(err => {
        console.log("Error: ", err);
    })
})


app.get('/', (req, res) => {
    Song.find({})
    .then(data => {
        res.send(data)
    }).catch(err => {
        res.send(err)
    })
})

app.get('/get-data-users', (req, res) => {
    Users.find({})
    .then(data => {
        res.send(data)
    }).catch(err => {
        res.send(err)
    })
})

var port = process.env.PORT || 8080
app.listen(port, () => {
    console.log('Listening on port: ', port);
})

//=============================================================


  