// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var publicacaoSchema = mongoose.Schema({
    nome_original: String,
    nome_url: String,
    imagem: String,
    legenda: String,
    curtidas: { type: Number, default: 0 },
    comentarios: [{
        usuario: String,
        mensagem: String,
        data: String,
        curtidas: { type: Number, default: 0 }
    }],
    data: String
});

// generating a hash
publicacaoSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
publicacaoSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('Publicacao', publicacaoSchema);