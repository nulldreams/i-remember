const Publicacao = require('./rotas/publicacao')
const Autenticacao = require('./rotas/autenticacao')
const Usuario = require('./models/usuario')
const jwt = require('jsonwebtoken')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.png')
    }
})

const upload = multer({
    storage: storage
})

module.exports = (app, apiRoutes) => {

    app.post('/cadastrar', Autenticacao.CriarConta)

    app.post('/publicar', upload.single('memoria'), Publicacao.Publicar)
    app.get('/publicacao/:id', Publicacao.ExibirPublicacao)
    app.get('/publicacoes', Publicacao.ListarPublicacoes)
    app.post('/curtir', Publicacao.Curtir)
    app.get('/filtrar/:categoria', Publicacao.ListarPublicacoesCategoria)
    app.get('*', function (req, res) {
        res.sendfile('./public/index.html');
    });

    app.use(function (req, res, next) { //allow cross origin requests
        res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
        res.header("Access-Control-Allow-Origin", "http://localhost");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    /* Não ficará assim */
    apiRoutes.post('/autenticar', (req, res) => {
        let usuario = {
            usuario: req.body.usuario,
            senha: req.body.senha
        }

        Autenticar(usuario, (resultado) => {
            res.json(resultado)
        })
    })

    var Autenticar = (_usuario, callback) => {
        let usuario = _usuario
        
        Usuario.find({
            usuario: usuario.usuario
        }, (err, _user) => {
            let user = _user[0]
            
            if (typeof user !== 'undefined') {
                if (err) callback({ success: false })

                if (user.senha !== usuario.senha) callback({ success: false, message: 'Senha incorreta :(' })
                else {
                    let token = jwt.sign(user, app.get('superSecret'), { expiresIn: '1440m' })

                    callback({ success: true, usuario: user, message: 'Enjoy', token: token })
                }
            } else callback({ success: false, message: 'Usuário não encontrado :(' })

        })
    }

    apiRoutes.use((req, res, next) => {
        let token = req.body.token || req.query.token || req.headers['x-access-token']

        if (token) {
            jwt.verify(token, app.get('superSecret'), (err, decoded) => {
                if (err) {
                    return res.json({ success: false, message: 'Sessão expirada.' })
                } else {
                    req.decoded = decoded
                    next()
                }
            })
        } else {
            return res.status(403).send({
                success: false,
                message: 'Nenhum token informado.'
            })
        }
    })

    /**/
    app.use('/api', apiRoutes)
}