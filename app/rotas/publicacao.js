const Publicacao = require('../models/publicacao')
const moment = require('moment')
var knox = require('knox');
var client = knox.createClient({
    key: 'key',
    secret: 'secret',
    bucket: 'bucket'
})

exports.ExibirPublicacao = (req, res) => {
      let id = req.params.id
      ConsultarPorId(id, (retorno) => {
          res.json(retorno)
      })
}


exports.ListarPublicacoes = (req, res) => {
    TodasPublicacoes((retorno) => {
        console.log(retorno)
        res.json({ publicacoes: retorno })
    })
}

exports.ListarPublicacoesCategoria = (req, res) => {
    TodasPublicacoesFiltro(req.params.categoria, (retorno) => {
        res.json({ status: 200, result: retorno })
    })
}

exports.Publicar = (req, res) => {
    console.log('nome', req.body.nome)
    let nome = req.body.nome.replace(/[^\w\s]/gi, '').replace(/ /g, '-').toLowerCase()
    let nPub = new Publicacao({
        nome_original: req.body.nome,
        nome_url: nome,
        imagem: '',
        legenda: req.body.legenda,
        data: moment().format('DD-MM-YYYY HH:mm:ss')
    })

    Publicar(nPub, req, (sucesso) => {
        if (sucesso) return res.json({ status: 200, result: 'ok.' })

        return res.json({ status: 500, result: 'Ocorreu um erro.' })
    })
}


var TodasPublicacoesFiltro = (filtro, callback) => {
    Publicacao.find({ 'categoria': filtro }, (err, publicacao) => {
        callback(publicacao)
    })
}

var TodasPublicacoes = (callback) => {
    Publicacao.find({}, (err, publicacoes) => {
        if (err) callback(err)

        callback(publicacoes)
    })
}

var ConsultarPorId = (id, callback) => {
    Publicacao.find({ 'nome_url': id }, (err, publicacao) => {
        if (err) return callback({ status: 400, result: err })

        console.log(publicacao)
        callback({ status: 200, result: publicacao })
    })
}

var Publicar = (obj, req, callback) => {
    UploadAmazon(req.file, (url) => {
        obj.imagem = url

        obj.save((err, result) => {

            if (err) return callback(false)


            callback(true)
        })
    })
}

var UploadAmazon = (arquivo, callback) => {
    console.log('Arquivo', arquivo)
    client.putFile(arquivo.path, arquivo.filename, { 'x-amz-acl': 'public-read' }, (err, response) => {
        if (err) console.log('Erro', err)

        callback(response.req.url)
    })
}
