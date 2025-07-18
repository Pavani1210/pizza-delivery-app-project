const validator = require("validator");
const { Schema, model } = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
        unique: true
    },
    email: {
        type: String,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new error("Invalid E-mail");
            }
        },
        unique: true,
        required: true,
    },
    phone: {
        type: String,
        validate(value) {
            if (!validator.isMobilePhone(value)) {
                throw new error('Invalid Phone Number');
            }
        },
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    admin: {
        type: Boolean,
        default: false
    },
    orders: [
        {
            date: {
                type: String,
                default: Date(),
            },
            paymentStatus: {
                type: String,
                require: true,
            },
            orderId: {
                type: String,
                require: true,
            }
        },
    ],
    cart: [
        {
            ingredients: {
                type: Object,
                require: true,
            },
            price: {
                type: Number,
                require: true,
            },
        },
    ]
});

const ingredSchema = Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    description: {
        type: String,
        default: "No Description",
    }
});

const adminSchema = Schema({
    order: {
        type: Array,
        default: [],
    },
    name: {
        type: String,
        require: true,
    },
    phone: {
        type: String,
        require: true,
    },
    price: {
        type: Number,
        require: true,
    },
    address: {
        type: String,
        require: true,
    },
    date: {
        type: String,
        default: Date(),
    },
    orderStatus: {
        type: String,
        default: "Ordered",
    },
    paymentStatus: {
        type: String,
        require: true,
    },
    orderId: {
        type: String,
        require: true,
    }
});

const otpSchema = Schema({
    email: {
        type: String,
        unique: true,
        require: true,
    },
    otp: {
        type: String,
        require: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 5,//automatic deletes document after 5 minutes.
    },
});

userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) {
        next();
    }
    try {
        const saltLength = await bcrypt.genSalt(5);
        const hash_password = await bcrypt.hash(user.password, saltLength);
        user.password = hash_password;
    } catch (error) {
        next(error);
    }
});

userSchema.methods.generateToken = function () {
    try {
        return jwt.sign({
            userId: this._id.toString(),
            email: this.email.toString(),
            admin: this.admin
        },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: '30d'
            });
    } catch (error) {
        console.error(error);
    }
}

userSchema.methods.verifyPassword = async function (password) {
    try {
        const user = await bcrypt.compare(password, this.password);
        return user;
    } catch (error) {
        console.error(error);
    }
}

const User = new model("User", userSchema);
const Ingredient = new model("Ingredient", ingredSchema);
const Otp = new model("Otp", otpSchema)
const Admin = new model("Admin", adminSchema);

module.exports = [User, Ingredient, Otp, Admin];