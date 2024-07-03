import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
    define: {
        freezeTableName: true,
    },
});

export default sequelize;
