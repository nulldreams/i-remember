// Vamos adicionar nosso pacote do mongoose e criar um objeto com schema do nosso usuário que será salvo no banco.
var mongoose = require('mongoose')

var usuarioSchema = new mongoose.Schema({
  nome: String,
  usuario: String,
  senha: String
})

// Agora aqui vamos devolver o Schema do usuário para quer acessar este arquivo
module.exports = mongoose.model('Usuario', usuarioSchema)