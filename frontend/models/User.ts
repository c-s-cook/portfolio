import { Schema, model, models } from 'mongoose';
import { isEmail } from 'validator'
import bcrypt from 'bcrypt'


interface IUser {
    _id: string;
    email: string;
    password: string;
    isVerified: boolean;
    verificationToken: string;
    resetToken: string;
    resetTime: Date | null;
    admin: boolean;
}
interface IUserModel extends IUser {
    create(userData: any): Promise<IUser>; // just creating a type of the built-in mongoose 8 .create()
    login(email: string, password: string): Promise<IUser>;
    verify(id: string, token: string): Promise<IUser>;
    reverify(email: string): Promise<IUser>;
    resetRequest(email: string): Promise<IUser>;
    resetCheck(userId: string, resetToken: string): Promise<IUser>;
    resetPassword(email: string, newPassword: string, token: string): Promise<IUser>;
}








//  defining the schema for a user
const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email.'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email. ']
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
    },
    resetToken: {
        type: String,
        // required: [true, 'Still missing a password reset token'],
        default: ''
    },
    resetTime: {
        type: Date,
        // required: [true, 'Still missing a password reset token'],
        default: null
    },
    admin: {
        type: Boolean,
        default: false
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
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            if (user.isVerified) {
                return user;
            }
            throw Error('not verified')
        }
        throw Error('incorrect password');
    }

    throw Error('incorrect email');
}



//  static method to verify a user
userSchema.statics.verify = async function (id, token) {
    let user = await this.findById(id).lean();
    if (user) {
        console.log('user trying to verify is: ', user)

        if (user.isVerified) {
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
            if (user) {
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
userSchema.statics.reverify = async function (email) {
    let newToken = generateRandomString(64)
    let user = await this.findOneAndUpdate({ email }, {
        isVerified: false,
        verificationToken: newToken
    },
        {
            new: true
        }).lean();
    if (user) {
        console.log('user after regened veriToken is: ', user)
        return user
    } else {
        throw Error('Issue updating with new veriToken.')
    }
}


//  static method for user to request password reset (generate a new reset token)
userSchema.statics.resetRequest = async function (email) {
    let resetToken = generateRandomString(64)
    let resetTime = new Date(Date.now() + 10 * 60 * 1000);  // setting experation for 10 min in future
    let user = await this.findOneAndUpdate({ email }, {
        resetToken: resetToken,
        resetTime: resetTime
    },
        {
            new: true
        }).lean();
    if (user) {
        console.log('user after new password reset token is: ', user)
        return user
    } else {
        throw Error('Email / User not found.')
    }
}


//  static method for validating a reset token
userSchema.statics.resetCheck = async function(userId: string, resetToken: string) {
  const user = await this.findOne({ _id: userId, resetToken });
  if (!user) {
    throw new Error('Invalid reset token or user.');
  }
  return user;
};


//  static method for user to request password reset (generate a new reset token)
userSchema.statics.resetPassword = async function (email, newPassword, token) {

    let user = await this.findOne({ email });
    if (user) {
        if (token != user.resetToken) throw Error('Incorect reset token.');
        else {
            const salt = await bcrypt.genSalt();
            newPassword = await bcrypt.hash(newPassword, salt);

            user = await this.findOneAndUpdate({ email }, {
                password: newPassword,
                resetToken: '',
                resetTime: null
            }, {
                new: true
            }).lean();

            if (user) return user;
            else throw Error('Issue updating password. Password remains unchanged. (...I hope.)');
            

        }
    }



    // let resetToken = generateRandomString(64)
    // let user = await this.findOneAndUpdate({ email }, {
    //     isVerified: false,
    //     resetToken: resetToken
    // },
    // {
    //     new: true
    // }).lean();
    // if(user){
    //     console.log('user after new password reset token is: ', user)
    //     return user
    // } else {
    //     throw Error('Issue updating with new password reset token.')
    // }
}



// export const User = models.user || model<IUser, IUserModel>('user', userSchema);
export const User = model<IUser, IUserModel>('User', userSchema);
// export default User

// module.exports = User;
