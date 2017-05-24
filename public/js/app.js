var app = angular.module('app', ['ngRoute']);

app.config(function ($routeProvider, $locationProvider) {
    // remove o # da url
    $locationProvider.html5Mode(true);

    $routeProvider

        // para a rota '/', carregaremos o template home.html e o controller 'HomeCtrl'
        .when('/', {
            templateUrl: 'views/publicacoes.html',
            controller: 'PublicacoesCtrl',
        })

        // para a rota '/sobre', carregaremos o template sobre.html e o controller 'SobreCtrl'
        .when('/memoria/:id', {
            templateUrl: 'views/publicacao.html',
            controller: 'PublicacaoCtrl',
        })

        .when('/nova-publicacao', {
            templateUrl: 'views/publicar.html',
            controller: 'PublicarCtrl'
        })

        .when('/logar', {
            templateUrl: 'views/login.html',
            controller: 'LoginCtrl'
        })


        // caso não seja nenhum desses, redirecione para a rota '/'
        .otherwise({ redirectTo: '/' });
});

app.controller('PublicacoesCtrl', function ($rootScope, $location, $http, $scope, $window) {
    $http({
        method: 'GET',
        url: '/publicacoes'
    }).then((success) => {
        $scope.publicacoes = success.data.publicacoes
    }, (fail) => {
        console.log(fail)
    })
});

app.controller('PublicacaoCtrl', function ($rootScope, $location, $routeParams, $http, $scope, $window, $timeout) {
    /*$window.localStorage.removeItem('usuario')
    $window.localStorage.removeItem('token')*/
    var id = $routeParams.id
    $scope.mensagem_curtida = 'Curtido.'
    $http({
        method: 'GET',
        url: '/publicacao/' + id
    }).then((success) => {
        $scope.publicacao = success.data.result[0]
        $scope.pubId = $scope.publicacao._id
        console.log($scope.publicacao)
        if ($scope.publicacao.curtidores.indexOf(JSON.parse($window.localStorage.getItem('usuario'))._id) > -1) {
            $scope.heart = true
        }
    }, (fail) => {
        console.log(fail)
    })

    $scope.Curtir = () => {
        $http({
            method: 'POST',
            url: '/curtir',
            data: {
                id: $scope.pubId,
                usuario: JSON.parse($window.localStorage.getItem('usuario'))._id
            },
        }).then((success) => {
            console.log(success)
            $scope.mensagem_curtida = success.data.message
                $timeout(() => {
                    $scope.mensagem_curtida = 'Curtido.'
                }, 3000)
        }, (fail) => {
            console.log(fail)
        })
    }

});

app.controller('PublicarCtrl', function ($rootScope, $location, $scope, $http) {
    $scope.upload = () => {
        $http({
            method: 'POST',
            url: '/publicar',
            data: {
                nome: 'Minha bicicleta',
                legenda: 'Muitas lembranças dessa bicicleta.',
                memoria: JSON.stringify($scope.arquivo),
                categoria: 'bicicleta'
            },
        }).then((success) => {
            console.log(success)
        }, (fail) => {
            console.log(fail)
        })
    }
});

app.controller('LoginCtrl', function ($rootScope, $location, $scope, $http, $timeout, $window) {
    $scope.mensagem_erro = ''

    $scope.Logar = () => {
        $http({
            method: 'POST',
            url: '/api/autenticar',
            data: {
                usuario: $scope.usuario,
                senha: $scope.senha
            },
        }).then((success) => {
            if (success.data.success) {
                $window.localStorage && $window.localStorage.setItem('token', success.data.token)
                $window.localStorage && $window.localStorage.setItem('usuario', JSON.stringify(success.data.usuario))

                $location.path('/')
            } else {
                $scope.mensagem_erro = success.data.message
                $timeout(() => {
                    $scope.mensagem_erro = ''
                }, 3000)
            }

        }, (fail) => {
            console.log(fail)
        })
    }

});

app.controller('LogoutCtrl', function ($rootScope, $location, $scope, $http, $window, $timeout) {
    //$location.path('/')
});