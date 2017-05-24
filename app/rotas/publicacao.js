const Publicacao = require('../models/publicacao')
const moment = require('moment')
const knox = require('knox');
const client = knox.createClient({
    key: '__key',
    secret: '__secret',
    bucket: '__bucket'
})

exports.ExibirPublicacao = (req, res) => {
    let id = req.params.id
    ConsultarPorId(id, (retorno) => {
        res.json(retorno)
    })
}


exports.ListarPublicacoes = (req, res) => {
    TodasPublicacoes((retorno) => {
        res.json({ publicacoes: retorno })
    })
}

exports.ListarPublicacoesCategoria = (req, res) => {
    TodasPublicacoesFiltro(req.params.categoria, (retorno) => {
        res.json({ status: 200, result: retorno })
    })
}

exports.Publicar = (req, res) => {
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

exports.Curtir = (req, res) => {
    let id = req.body.id
    Curtir(id, req.body.usuario, (retorno) => {
        res.json(retorno)
    })
}
var Curtir = (id, usuario, callback) => {
    console.log(id, usuario)
    Publicacao.findById(id, (err, publicacao) => {
        if (publicacao.curtidores.indexOf(usuario) == -1) {
            publicacao.curtidores.push(usuario)
            publicacao.curtidas += 1

            publicacao.save((err) => {
                if (err) callback(err)

                callback({ success: true, message: 'Curtido.' })
            })

        } else callback({ success: false, message: 'Você já curtiu essa memória! :)' })
    })
    /* Publicacao.findByIdAndUpdate(id, { $inc: { curtidas: 1 } }, (err, data) => {
         
         callback(data)
     })*/
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
    console.log('Arquivo', req.body.memoria)
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
