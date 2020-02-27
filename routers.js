'use strict';
const userController = require('./api/user/controller');
const notificationController = require('./api/notifications/controller');
const Joi = require('@hapi/joi');

module.exports = [
    {
        method: 'GET',
        path: '/getAllUsers',
        handler: userController.getUsers
    },

    {
        method: 'POST',
        path: '/create/user',
        handler: (request, handler) => {
            return userController.createUser(request, handler);
        },
        config: {
            validate: {
                payload: {
                    name: Joi.string().required(),
                    phone: Joi.number().required(),
                    address: Joi.string().required(),
                    age: Joi.number().required(),
                    email: Joi.string().email().required(),
                    interests: Joi.array().optional()
                }
            }
        }
    },
    {
        method: 'PUT',
        path: '/updateUser/{id}',
        handler: (request, handler) => {
            return userController.updateUser(request, handler);
        },
        config: {
            validate: {
                params: {
                    id: Joi.string().required()
                },
                payload: {
                    name: Joi.string().required(),
                    phone: Joi.number().required(),
                    address: Joi.string().required(),
                    age: Joi.number().required(),
                    email: Joi.string().email().required(),
                    interests: Joi.array().optional()
                }
            }
        }
    },
    {
        method: 'DELETE',
        path: '/removeUser/{id}',
        handler: (request, handler) => {
            return userController.removeUser(request, handler);
        },
        config: {
            validate: {
                params: {
                    id: Joi.number().required()
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/notify/user',
        config:{
            validate:{
                payload: {
                    message: Joi.string().required(),
                    subject: Joi.string().required(),
                    user_id: Joi.number().required(),
                }
            }
        },
        handler: (request, handler) =>{
            return notificationController.notifyUser(request, handler);
        }
    },
    {
        method: 'GET',
        path: '/user/notifications/{user_id}',
        config:{
            validate:{
                params: {
                    user_id: Joi.number().required()
                }
            }
        },
        handler: (request, handler) =>{
            return notificationController.getNotificationsByUserId(request, handler);
        }
    },
    {
        method: 'GET',
        path: '/notifications/users/{notification_id}',
        config:{
            validate:{
                params:{
                    notification_id: Joi.number().required()
                }
            }
        },
        handler: (request, handler) =>{
            return notificationController.getNotificattionsById(request, handler);
        }
    },
    {
        method: 'GET',
        path:'/users/redis',
        handler: (request, handler) =>{
            return userController.testRedis(request, handler);
        }
    },
    {
        method: 'POST',
        path:'/users/basedoninterests',
        config: {
            validate:{
                payload: {
                    interests: Joi.array().required()
                }
            }
        },
        handler: (request, handler) =>{
            return userController.usersBasedOnInterests(request, handler);
        }
    }
]

