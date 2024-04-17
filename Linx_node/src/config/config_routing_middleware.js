const routingMatching = require('./routingMatching');
const routingSearchmedia = require('./routingSearchmedia');
const routingAccount = require('./routingAccount');
const routingProfile = require('./routingProfile');

module.exports = function(serverExpress){
    serverExpress.use('/api/Matching', routingMatching);
    serverExpress.use('/api/SearchMedia', routingSearchmedia);
    serverExpress.use('/api/Account', routingAccount);
    serverExpress.use('/api/Profile', routingProfile);
}