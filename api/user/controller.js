
const pool = require('../../dbconnection');
const joiSchema = require('../../utils/user.validation');
let redis = require('redis');
const client = redis.createClient({
    host : 'localhost', 
    port : 6379
});
 
client.on("error", function(error) {
  console.error(error);
});

/**
 * Get users Api
 */
exports.getUsers = async (request, handler) =>{
    try{
        let result = await pool.query('SELECT * FROM users');
            if(!result){
                return {message: 'users not found'};
            }
            return {status: "success",result: result.rows}
    }catch(err){
        throw err;
    }
}


/**
 * Create User Api..
 */
exports.createUser = async (request, handler) =>{
    try{
        console.log('request: ',request.payload);
        const {name, phone, address, email, age, interests} = request.payload;
        let result = await pool.query(`INSERT INTO users (name, phone, address, email, age, interests)
            VALUES ($1, $2, $3, $4, $5, $6)`,[name, phone, address, email, age, interests]);// =>{
                // if(err){
                //     throw err;
                // }
                // return {status: "success", result: result.rows};

            //})
            console.log('result:',result);
            if(result)
                return {status: "success", message: "User Created successfully"};
            else
                return {message: "User not Created"};

    }catch(err){
        throw err;
    }
}

/**
 * User Update Api..
 */
exports.updateUser = async (request, handler) =>{
    try{
    let id = parseInt(request.params.id);
    console.log('id:',id);
    const {name, phone, address, email, age, interests} = request.payload;
    var updateQuery = "UPDATE users SET name = ($1), phone = ($2), address = ($3), email = ($4), age = ($5), interests = ($6) WHERE id =($7)";
    let result = await pool.query(updateQuery,[name, phone, address, email, age, interests, id]);//, (err, result) =>{
    //     if(err){
    //         throw err;
    //     }
    //     return {status: "success", result:'User updated successfully'};
    // })
    if(result)
        return {status : "success", message: "User Successfully updated"};
    else
        return {message: "User not updated successfully"};    
    }catch(err){
        throw err;
    }
}

/**
 * Delete User Api
 */

 exports.removeUser = async (request, handler) =>{
     try{
        const id = parseInt(request.params.id);
        let result = await pool.query('DELETE FROM users WHERE id = $1', [id]);//,(err, result) =>{
        //     if(err){
        //         throw err;
        //     }
        //     return {status: "success", message: "User Deleted successfully"}
        // })
        // console.log('result:',result.rowCount);
        if(result.rowCount)
        return {status: "success", message: "User Removed successfully"};
        else
        return {message: 'User not removed successfully'};

     }catch(err){
         throw err;
     }
 }

 exports.testRedis = async (request, handler) =>{
     try{
         let obj =  [{
             name: "venkat",
             age: 24,
             phone: '8121210425',
             email: 'venkat@gmail.com',
             interests: ['culture','sports','cinemas']
         },{
            name: "venkat1",
             age: 25,
             phone: '8121210425',
             email: 'venkataramana@gmail.com',
             interests: ['culture','sports','cinemas'] 
         }]
         console.log('TESTING');
        client.set("userObject",JSON.stringify(obj));
        client.get("userObject", function(err, key){
            if(!key){
                console.log('key not exist');
            }else{
                console.log(key);
                key = JSON.parse(key);
                // console.log('name',key.name);
            }
            
        } );
        // console.log(JSON.parse(JSON.stringify(userOb)));
        return "working";
     }catch(err){
         throw err;
     }
 }

 exports.usersBasedOnInterests = async (request, handler) => {
     try{
        let interests = request.payload.interests;
        // console.log('request;', interests);
        interests = interests.map(ele => `'${ele.toString()}'`);
        let users = await pool.query(`SELECT id, name, age, email FROM users WHERE interests @> ARRAY[${interests}]`);
        client.set("users",JSON.stringify(users.rows));
        client.set("usersCount", users.rowCount);
        client.get("users", function(err, key){
            if(!key){
                console.log('key not exist');
            }else{
                key = JSON.parse(key);
                console.log(key);
            }
        } );
        if(users){
            return { status: "success", result: users.rows , usersCount: users.rowCount};
        }else{
            return { status: 'success', message: 'users not found' };
        }
     }catch(err){
         throw err;
     }
 }