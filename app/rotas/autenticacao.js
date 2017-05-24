const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario')

exports.CriarConta = (req, res) => {
    let dados = {
        nome: req.body.nome,
        usuario: req.body.usuario,
        senha: req.body.senha
    }

    CriarConta(dados, (resultado) => {
        res.json(resultado)
    })
}
var CriarConta = (objeto, callback) => {
    let dados = objeto
    let novoUsuario = new Usuario({
        nome: dados.nome,
        usuario: dados.usuario,
        senha: dados.senha
    })

    novoUsuario.save((err) => {
        if (err) {
            console.log(err)
            callback({ success: false })
        }

        callback({ success: true })
    })
}