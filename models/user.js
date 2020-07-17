const { Sequelize , DataTypes} = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('user',{
    first_name : {
        type : DataTypes.STRING,
        allowNull : false
    },
    middle_name : {
        type : DataTypes.STRING,
        allowNull : true
    },
    last_name : {
        type : DataTypes.STRING,
        allowNull : false
    },
    email : {
        type : DataTypes.STRING,
        allowNull : false
    },
    password : {
        type : DataTypes.STRING,
        allowNull : false
    },
    dob : {
        type : DataTypes.STRING,
        allowNull : false
    },
    user_name : {
        type : DataTypes.STRING,
        allowNull : false
    },
    phone_num : {
        type : DataTypes.STRING,
        allowNull : false
    },
    address : {
        type : DataTypes.STRING,
        allowNull : false
    }
});

module.exports = User;