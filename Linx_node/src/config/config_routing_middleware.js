const routingMatching = require('./routingMatching');
const routingSearchmedia = require('./routingSearchmedia');
const routingAccount = require('./routingAccount');

module.exports = function(serverExpress){
    serverExpress.use('/api/Matching', routingMatching);
    serverExpress.use('/api/SearchMedia', routingSearchmedia);
    serverExpress.use('/api/Account', routingAccount);
}