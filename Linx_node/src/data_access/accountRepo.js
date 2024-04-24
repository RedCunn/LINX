let Account = require('../schemas/Account');

class AccountRepository {

    async createAccount(account, session){
        //comprobar linxname no repetido
        try {
            await Account.create([account],session);        
            return true;
        } catch (error) {
            console.log('ERROR al crear CUENTA ', error)
            return false;
        }
    }

    async findUserAccount(userid){
        const useraccount = await Account.findOne({ userid: userid });        
        return useraccount;
    }

    async updateAccount(userid, accountid, updates){
        throw new Error('Method not implemented.');
    }

    async activateAccount(userid){
        throw new Error('Method not implemented.');
    }

    async deactivateAccount(userid){
        throw new Error('Method not implemented.');
    }

    async deleteAccount(accountid){
        throw new Error('Method not implemented.');
    }

}

module.exports = AccountRepository;