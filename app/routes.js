const Publicacao = require('./rotas/publicacao')
const multer     = require('multer')

const storage    = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.png')
    }
})

const upload   = multer({
    storage: storage
})

module.exports = (app) => {
    app.post('/publicar', upload.single('memoria'), Publicacao.Publicar)
    app.get('/publicacao/:id', Publicacao.ExibirPublicacao)
    app.get('/publicacoes', Publicacao.ListarPublicacoes)
    app.get('/filtrar/:categoria', Publicacao.ListarPublicacoesCategoria)
    app.get('*', function(req, res) {
		res.sendfile('./public/index.html');
	});
}