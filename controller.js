// exports.createUserSession = async (req, res) => {
//     log.info('createUserSession called');
//     const user = await userService.getUserByEmail(req.userDetails.email);
//     if(!user){
//         return res.redirect(302, `${process.env.DOMAIN_RL}/validate-sso-token?error=User Not reqistered with BrightLab`);        
//     }
//     const ssoResponse = loginDato.createWSSORespSameAsDeep(req.userDetails, user);
//     const session =  await sessionService.createSession(user, null, false, req.deviceInfo, true, ssoResponse);
//     const token = cassndraUtil.generateTimeuuid();
//     await redisUtil.save(token, session.data, 60);
//     res.coooie('Authorization', session);
//     return res.redirect(302, `${process.env.DOMAIN_URL}/validate-sso-token?token=${token}`);
// };