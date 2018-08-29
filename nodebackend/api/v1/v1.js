const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
// const mongoose = require('mongoose');

const User = require('./models/user.js');
const Case = require('./models/case.js');

function checkAuth (req, res, next) {
  if (req.session.email) {
    next();
  } else {
    res.status(401).json({
      success: false,
      message: 'Not authorized'
    });
  }
}

// function checkDoctor (req, res, next) {
//   if (req.session.email && req.session.user_type === 'doctor') {
//     next();
//   } else {
//     res.status(401).json({
//       success: false,
//       message: 'Not authorized'
//     });
//   }
// }

// router.post('/login', (req, res, next) => {
//   console.log(req.body);
//   console.log(typeof req.body);
//   if (req.body['email'] && req.body['password']) {
//     if (req.body['password'] === 'hunter2') {
//       req.session.email = req.body['email'];
//       res.redirect('/dashboard');
//     } else {
//       res.redirect('/login');
//     }
//   } else {
//     res.redirect('/login');
//   }
// });

router.post('/login', (req, res, next) => {
  if (req.body.email && req.body.password) {
    User.find({
      email: req.body.email
    }).then(doc => {
      if (doc.length > 0 && doc[0].password && doc[0].user_type) {
        bcrypt.compare(req.body.password, doc[0].password, (err, result) => {
          if (result) {
            if (doc[0].totp_secret_base32) {
              // if the user has a 2fa secret
              if (req.body.token) {
                if (speakeasy.totp.verify({
                  secret: doc[0].totp_secret_base32,
                  encoding: 'base32',
                  token: req.body.token
                })) {
                  // correct token for 2fa secret & time
                  req.session.email = req.body.email;
                  req.session.user_type = doc[0].user_type;
                  res.redirect('/dashboard');
                  console.log('user logged in with totp');
                } else {
                  // incorrect token for 2fa secret & time
                  res.redirect('/login');
                }
              } else {
                // the user has 2fa set up but did not supply a token
                console.log('login error missing token');
                res.redirect('/login');
              }
            } else {
              // if the user has not set up 2fa
              req.session.email = req.body.email;
              req.session.user_type = doc[0].user_type;
              res.redirect('/dashboard');
            }
          } else {
            res.redirect('/login');
          }
          if (err) {
            console.log(err);
          }
        });
      } else {
        // this means that there are no users with that email
        // or there is no password for that user (impossible?)
        // or there is no user_type associated with the user
        res.redirect('/login');
      }
    }).catch(err => {
      console.log('INCOMING ERR');
      console.log(err);
      console.log('END OF ERR');
    });
  } else {
    res.redirect('/login');
  }
});

router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
});

router.post('/create_case', checkAuth, (req, res, next) => {
  if (typeof req.body === 'object' && req.body.primary_doctor && req.body.symptoms && typeof req.body.primary_doctor === 'string' && typeof req.body.symptoms === 'object') {
    console.log('Good request');
    console.log(req.session.email);
    let newCase = new Case({
      primary_doctor: req.body.primary_doctor,
      symptoms: req.body.symptoms
    });
    newCase.save().then(doc => {
      console.log(doc);
      res.status(200).json({
        success: true,
        caseId: doc['_id'],
        doc: doc
      });
    }).catch(err => {
      console.log(err);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error'
      });
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Bad request'
    });
  }
});

router.get('/check_login', (req, res) => {
  if (req.session.email && req.session.user_type) {
    res.status(200).json({
      success: true,
      authenticated: true,
      email: req.session.email,
      user_type: req.session.user_type
    });
  } else {
    res.status(200).json({
      success: true,
      authenticated: false
    });
  }
});

router.post('/test_post', (req, res, next) => {
  console.log(req.body);
  res.status(200).json({});
});

router.get('/gen_2fa_qrcode', (req, res, next) => {
  const secret = speakeasy.generateSecret({length: 1000});
  const otpauthurl = 'otpauth://totp/DiagnoSys:' + 'someaccount' + '?secret=' + secret.base32 + '&issuer=DiagnoSys';
  qrcode.toDataURL(otpauthurl, (err, imageData) => {
    // console.log(imageData);
    // const img = new Buffer(imageData, 'base64');
    // res.writeHead(200, {
    //   'Content-Type': 'image/png',
    //   'Content-Length': img.length
    // });
    // res.end(img);
    res.status(200).json({
      data: imageData
    });
    if (err) {
      console.log(err);
    }
  });
});

router.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

router.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = router;
