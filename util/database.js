const Sequelize = require('sequelize').Sequelize;


const sequelize = new Sequelize(process.env.MYSQL_DATABASE || 'trainreservation',process.env.MYSQL_USER || 'root',process.env.MYSQL_PASSWORD || 'password',
{dialect : 'mysql',
 host : process.env.MYSQL_HOST || '172.17.0.2'
});


module.exports = sequelize;


// const mysql = require('mysql2');

// const db = mysql.createPool({
//     user : 'root',
//     password : '953810392427',
//     database : 'trainreservation',
//     host : 'localhost'
// })

// module.exports = db;
