import { Schema, model, models } from 'mongoose';
import { isEmail } from 'validator'
import bcrypt from 'bcrypt'

//  defining the schema for a user
const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email.'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email.']
    },
    password: {
        type: String,
        required: [true, 'Please enter an password.'],
        minlength: [6, 'Minimum password length is 6 characters.']
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
        // required: [true, 'Still missing a verification token'],
        default: ''
    }
});


// random verification token generation
const generateRandomString = (length) => {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };



// fire a function after doc is daved to db
userSchema.post('save', function (doc, next) {
    console.log('new user was created and saved', doc)
    next();
});

// fire before doc saved to db
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt)
    this.verificationToken = generateRandomString(64)
    console.log('generated this veriToken: ', this.verificationToken)
    next();
});

//  static method to log in a user
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            if(user.isVerified){
                return user;
            }
            throw Error('not verified')
        }
        throw Error('incorrect password');
    }

    throw Error('incorrect email');
}



//  static method to verify a user
userSchema.statics.verify = async function(id, token) {
    let user = await this.findById( id ).lean();
    if(user){
        console.log('user trying to verify is: ', user)

        if(user.isVerified){
            console.log(user.email, " is already verified")
            throw Error('User already verified')
        } else if (token == user.verificationToken) {
            console.log("tokens match. attempting to update...")
            user = await this.findByIdAndUpdate(id, {
                isVerified: true,
                verificationToken: ''
            },
            {
                new: true
            }).lean();
            if(user){
                console.log('user after update is: ', user)
                return user
            }

        } else {
            console.log(token, ' -- was in URL');
            console.log(user.verificationToken, ' -- was in DB');
            throw Error('Incorrect verification token.')
        }
    }

    throw Error('User id not found');
}


//  static method to reverify user (generate a new verificationToken)
userSchema.statics.reverify = async function(email){
    let newToken = generateRandomString(64)
    let user = await this.findOneAndUpdate({ email }, {
        isVerified: false,
        verificationToken: newToken
    },
    {
        new: true
    }).lean();
    if(user){
        console.log('user after regened veriToken is: ', user)
        return user
    } else {
        throw Error('Issue updating with new veriToken.')
    }
}



export const User = models.user || model('user', userSchema);
// export default User

// module.exports = User;
