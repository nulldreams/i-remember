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

        // caso não seja nenhum desses, redirecione para a rota '/'
        .otherwise({ redirectTo: '/' });
});

app.controller('PublicacoesCtrl', function ($rootScope, $location, $http, $scope) {

    $http({
        method: 'GET',
        url: '/publicacoes'
    }).then((success) => {
        $scope.publicacoes = success.data.publicacoes
    }, (fail) => {
        console.log(fail)
    })
});

app.controller('PublicacaoCtrl', function ($rootScope, $location, $routeParams, $http, $scope) {
    console.log('Param ' + $routeParams.id)
    var id = $routeParams.id
    $http({
        method: 'GET',
        url: '/publicacao/' + id
    }).then((success) => {
        $scope.publicacao = success.data.result[0]
    }, (fail) => {
        console.log(fail)
    })

});

app.controller('ContatoCtrl', function ($rootScope, $location) {
    $rootScope.activetab = $location.path();
});