import { Strategy as LocalStrategyObject } from 'passport-local'
import bcrypt from 'bcrypt';

const LocalStrategy = LocalStrategyObject.Strategy;

const initialize = (passport, getUserByEmail, getUserById) => {
    console.log('initilize');
    
    const authenticateUser = async (email, password, done) => {
        
        console.log('authenticateUser');
        
        const user = getUserByEmail(email);
        if(user == null) {
            console.log('No user with that email');
            return done(null, false, { message:'No user with that email' });
        } 

        try {
            if(await bcrypt.compare(password, user.password)) {
                console.log('Password correct');
                return done(null, user);
            }else{
                console.log('Password incorrect');
                return done(null, false, { message:'Password incorrect' });
            }
        } catch (e) {
            console.log('Some other error');
            return done(e);
        }
    };
    
    passport.use(new LocalStrategy({ usernameField:'email' }, authenticateUser));        
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => done(null, getUserById(id)));
}


export { initialize };