import { DataTypes } from 'sequelize';
import sequelize from '../utils/database.js';

const WatchList = sequelize.define('watch_list', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    url: {
        type: DataTypes.STRING,
        unique: true,
    },
    price: {
        type: DataTypes.INTEGER,
    },
    notify_flag: {
        type: DataTypes.BOOLEAN,
    },
    last_notification: {
        type: DataTypes.DATE,
    },
});

export default WatchList;
