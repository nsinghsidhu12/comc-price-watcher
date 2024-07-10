import { DataTypes } from 'sequelize';
import sequelize from '../utils/database.js';

const Card = sequelize.define(
    'card',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        pageUrl: {
            type: DataTypes.STRING,
            unique: true,
            field: 'page_url'
        },
        imageUrl: {
            type: DataTypes.STRING,
            field: 'image_url'
        },
        name: {
            type: DataTypes.STRING,
        },
        price: {
            type: DataTypes.INTEGER,
        },
        notifyFlag: {
            type: DataTypes.BOOLEAN,
            field: 'notify_flag',
        },
        lastNotified: {
            type: DataTypes.DATE,
            field: 'last_notified',
        },
    },
    {
        createdAt: false,
        updatedAt: false,
    }
);

export default Card;
