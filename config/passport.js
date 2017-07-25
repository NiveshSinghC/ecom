const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const shopsaccount = require('../models/shopsaccount');
const config = require('../config/database');

module.exports = function(passport){
	let opts = {
		jwtFromRequest :ExtractJwt.fromAuthHeader(),
		secretOrKey :config.secret
	}
	
 	passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
		shopsaccount.findOne({id: jwt_payload.sub}, (err, acc) =>{

			if(err){
				return done(err,false);
			}

			if(acc){
				return done(null, acc);

			}else{
				return done(null, false);

			}
		});
	}));
}