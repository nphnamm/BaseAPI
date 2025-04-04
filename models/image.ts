import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import db from '../models';

export interface ImageAttributes {
    id: string;
    url: string;
    publicId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

interface ImageCreationAttributes extends Optional<ImageAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

export class Image extends Model<ImageAttributes, ImageCreationAttributes> implements ImageAttributes {
    public id!: string;
    public url!: string;
    public publicId!: string;
    public userId!: string;
    public createdAt!: Date;
    public updatedAt!: Date;

    public static associate(models: { [key: string]: any }) {
        Image.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
}

Image.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        publicId: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
            references: { model: 'Users', key: 'id' }
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    },
    {
        sequelize: db.sequelize,
        modelName: 'Image',
    }
);

// Add the model to db
db.Image = Image;

export default Image; 