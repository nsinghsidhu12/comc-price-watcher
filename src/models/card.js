import { DataTypes } from 'sequelize';
import sequelize from '../utils/database.js';

const Card = sequelize.define('card', {
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
    last_notified: {
        type: DataTypes.DATE,
    },
});

export default Card;
