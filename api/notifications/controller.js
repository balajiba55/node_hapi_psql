const pool = require('../../dbconnection');
var amqp = require('amqplib/callback_api');


/**
 * Create Notification Api..
 */
exports.notifyUser = async (request, handler) =>{
    try{
        const {message, subject, user_id} = request.payload;
        
        await amqp.connect('amqp://localhost', async function(error0, connection) {
            if (error0) {
                throw error0;
            }
            await connection.createChannel(async function(error1, channel) {
                if (error1) {
                    throw error1;
                }
                var msg = process.argv.slice(2).join(' ') || message;

                await channel.assertQueue(queue, {
                    durable: true
                });
                console.log('test1');
                await channel.sendToQueue(queue, Buffer.from(msg), {
                    persistent: true
                });
                console.log('test2');
                console.log(" [x] Sent '%s'", msg);
                await pool.query(`INSERT INTO notifications (message, subject, user_id)
                    VALUES ($1, $2, $3)`,[message, subject,user_id]); 

                console.log('Notification inserted in database');    
            });
                setTimeout(function() {
                    connection.close();
                    process.exit(0)
                }, 500);
            });
            return {status: "success", message: 'Notification inserted in database successfully'};
            // if(result)
            //         return {status: "success", message: "Notification Created successfully"};
            //     else
            //         return {message: "Notification not Created in Database"};
            
        
    }catch(err){
        throw err;
    }

}


exports.getNotificationsByUserId = async (request, handler) =>{
    try{
        let userId = parseInt(request.params.user_id);
        let result = await pool.query(`SELECT * FROM notifications WHERE user_id = ${userId}`);
        if(result){
            return { status: 'SUCCESS', result: result.rows };   
        }else{
            return {status: 'success', message: 'There are no notificaitons found for this user'};
        }
    }catch(err){
        throw err;
    }
}

exports.getNotificattionsById = async (request, handler) =>{
    try{
        let notificationId = parseInt(request.params.notification_id);
        let result = await pool.query(`SELECT * FROM notifications WHERE notification_id = ${notificationId}`);
        if(result)
            return {status: 'success', result: result.rows};
        else
            return {status: 'success', result: "No rows found"};    
    }catch(err){
        throw err;
    }
}