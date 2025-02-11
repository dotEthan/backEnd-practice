const crypto = require('crypto');

const User = require('../models/user');
const bcrypt = require('bcryptjs');
// Not installed as email service was garbage
// const nodemailer = require('nodemailer');
// const sendgridTransport = require('nodemailer-sendgrid-transport');
// const transporter = nodemailer.createTransprot(sendgridTransport({
//   auth: {
//     api_key: '***Key***'
//   }
// }));

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message,
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash('error', 'Invalid Email or Password');
        return res.redirect('/login');
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect('/');
            });
          }
          req.flash('error', 'Invalid Email or Password');
          res.redirect('/login');
        })
        .catch((err) => {
          console.log(err);
          return res.redirect('/login');
        });
    })
    .catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash('error', 'User with this email already exists.');
        return res.redirect('/signup');
      }
      return bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new User({
          email: email,
          password: hashedPassword,
          card: { items: [] },
        });
        return user.save();
      });
    })
    // Not implemented as sendgrid wasn't working
    // .then((result) => {
    //   return transporter.sendMail({
    //     to: email,
    //     from: 'shop@node-complete.com',
    //     subject: 'Signup succeeded',
    //     html: '<h1>You did it!</h1>'
    //   });
    // })
    .then((result) => {
      res.redirect('/login');
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  console.log('test');
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash('error', 'No Account Found');
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        //send email with token attached to link Not implemented as sendgrid wasn't working
        //   return transporter.sendMail({
        //     to: req.body.email,
        //     from: 'shop@node-complete.com',
        //     subject: 'Password Reset',
        //     html: `<p>click here with new password<p>
        //            <a href="http://localhost:3000/reset/${token}">CLICK HERE</a>
        //            `
        //   });
        res.redirect('/');
      })
      .catch((err) => console.log(err));
  });
};

exports.getNewPassword = (req, res, next) => {
  // const token = req.params.token; // Token from email service not implemented
  const token = 1234;
  console.log('test');
  User.findOne({
    email: 'test@test.com',
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      console.log(user);
      const token = user.resetToken;
      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => {
      console.log('changing password: ', err);
    });
};

exports.postNewPassword = (req, res, next) => {
  const passwordToken = req.params.token; // Token from email service not implemented
  const newPassword = req.body.password;
  const userId = req.body.userId;
  let resetUser;

  User.findOne({
    _id: userId,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect('/login');
    })
    .catch((err) => console.log(err));
};
