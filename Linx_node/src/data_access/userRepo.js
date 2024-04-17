let User = require('../schemas/User');

class UserRepository{
    
    async createUser(user, session) {
        try {
            await User.create([user],session);        
            return true;
        } catch (error) {
            console.log('ERROR al crear USER ', error)
            return false;
        }
        

    }
    async updateUser(userid){
        throw new Error('Method not implemented.');
    }
    async deleteUser(userid) {
        throw new Error('Method not implemented.');
    }


}

module.exports = UserRepository;