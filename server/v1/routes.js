const express = require('express');
const useragent = require('useragent');
const Saml2js = require('saml2js');

const passport = require('../../config');

const {
  handler,
} = require('../../middlewares');

// const {
//   userLogin,
// } = require('./../../controller');

const userAgentHandler = (req, res, next) => {
  const agent = useragent.parse(req.headers['user-agent']);
  const deviceInfo = Object.assign({}, {
    device: agent.device,
    os: agent.os,
  });
  req.device = deviceInfo;
  next();
};

const router = express.Router();

/**
 * This Route Authenticates req with IDP
 * If Session is active it returns saml response
 * If Session is not active it redirects to IDP's login form
 */
router.get('/login/sso',
  passport.authenticate('saml', {
    successRedirect: '/',
    failureRedirect: '/login',
  }));

/**
 * This is the callback URL
 * Once Identity Provider validated the Credentials it will be called with base64 SAML req body
 * Here we used Saml2js to extract user Information from SAML assertion attributes
 * If every thing validated we validates if user email present into user DB.
 * Then creates a session for the user set in cookies and do a redirect to Application
 */
router.post('/login/sso/callback',
  userAgentHandler,
  passport
    .authenticate('saml', { failureRedirect: '/', failureFlash: true }), (req, res, next) => {
    const xmlResponse = req.body.SAMLResponse;
    const parser = new Saml2js(xmlResponse);
    req.samlUserObject = parser.toObject();
    next();
  },
  (req, res) => {
    
    log.info('createUserSession called');
    // const user = await userService.getUserByEmail(req.userDetails.email);
    // if(!user){
    //     return res.redirect(302, `${process.env.DOMAIN_RL}/validate-sso-token?error=User Not reqistered with BrightLab`);        
    // }
    // const ssoResponse = loginDato.createWSSORespSameAsDeep(req.userDetails, user);
    // const session =  await sessionService.createSession(user, null, false, req.deviceInfo, true, ssoResponse);
    // const token = cassndraUtil.generateTimeuuid();
    // await redisUtil.save(token, session.data, 60);
    // res.coooie('Authorization', session);
    // return res.redirect(302, `${process.env.DOMAIN_URL}/validate-sso-token?token=${token}`);

    // userLogin.createUserSession(res, req);
  });


router.get('/login/sso/:id?',
passport.authenticate('saml', { successRedirect: '/', failureRedirect: '/login' } ));

router.post('/login/sso/callback/:id?',
 userAgentHandler, passport
.authenticate('saml', { failureRedirect: '/', failureFlash: true }), (req, res, next) => {
const xmlResponse = req.body.SAMLResponse;
const parser = new Saml2js(xmlResponse);
req.samlUserObject  = parser.toObject();
next();
},

(req, res) => [req.samlUserObject, req.device]);
module.exports = router;