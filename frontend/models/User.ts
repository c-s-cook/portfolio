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
});


// fire a function after doc is daved to db
userSchema.post('save', function (doc, next) {
    console.log('new user was created and saved', doc)
    next();
});

// fire before doc saved to db
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt)
    next();
});

//  static method to log in a user
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
        throw Error('incorrect password');
    }

    throw Error('incorrect email');
}

export const User = models.user || model('user', userSchema);
// export default User

// module.exports = User;
