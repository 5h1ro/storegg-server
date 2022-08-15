const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const HASH_ROUND = 10

let playerSchema = mongoose.Schema({
    email: {
        type: String,
        require: [true, 'Email harus diisi']
    },

    name: {
        type: String,
        require: [true, 'Nama harus diisi'],
        maxLength: [255, 'Panjang nama harus antara 3-255 karakter'],
        minLength: [3, 'Panjang nama harus antara 3-255 karakter']
    },

    username: {
        type: String,
        require: [true, 'Nama harus diisi'],
        maxLength: [255, 'Panjang nama harus antara 3-255 karakter'],
        minLength: [3, 'Panjang nama harus antara 3-255 karakter']
    },

    password: {
        type: String,
        require: [true, 'Kata sandi harus diisi'],
        maxLength: [255, 'Panjang sandi maksimal 255 karakter'],
    },

    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },

    phoneNumber: {
        type: String,
        require: [true, 'Nomor telepon harus diisi'],
        maxLength: [13, 'Panjang Nomor telepon harus antara 9-13 karakter'],
        minLength: [9, 'Panjang Nomor telepon harus antara 9-13 karakter']
    },

    avatar: {
        type: String
    },

    fileName: {
        type: String
    },

    status: {
        type: String,
        enum: ['Y', 'N'],
        default: 'Y'
    },

    favorite: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }
}, { timestamp: true })

playerSchema.path('email').validate(async function (value) {
    try {
        const count = await this.model('Player').countDocuments({ email: value })

        return !count
    } catch (error) {
        throw error
    }
}, attr => `${attr.value} sudah terdaftar`)

playerSchema.pre('save', function (next) {
    this.password = bcrypt.hashSync(this.password, HASH_ROUND)
    next()
})

module.exports = mongoose.model('Player', playerSchema)