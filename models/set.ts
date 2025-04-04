import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import db from '../models';

// Import Op from Sequelize
const { Op }:any = Sequelize;

export interface SetAttributes {
    id: string;
    title: string;
    description?: string;
    userId: string;
    folderId?: string;
    isPublic: boolean;
    isDraft: boolean;
    cardCount: number;
    statusId: number;
    createdAt: Date;
    updatedAt: Date;
}

interface SetCreationAttributes extends Optional<SetAttributes, 'id' | 'description' | 'folderId' | 'cardCount' | 'createdAt' | 'updatedAt'> { }

export class Set extends Model<SetAttributes, SetCreationAttributes> implements SetAttributes {
    public id!: string;
    public title!: string;
    public description?: string;
    public userId!: string;
    public folderId?: string;
    public isPublic!: boolean;
    public cardCount!: number;
    public statusId!: number;
    public isDraft!: boolean;
    public createdAt!: Date;
    public updatedAt!: Date;

    public static associate(models: { [key: string]: any }) {
        Set.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        Set.belongsTo(models.Folder, { foreignKey: 'folderId', as: 'folder' });
        Set.hasMany(models.Card, { foreignKey: 'setId', as: 'cards' });
    }

    public async updateCardCount(): Promise<void> {
        this.cardCount = await this.sequelize!.models.Card.count({
            where: {
                setId: this.id,
                statusId: { [Op.ne]: 3 } // Exclude soft-deleted cards
            }
        });
        await this.save();
    }


    public static async softDelete(setId: number): Promise<void> {
        const set = await Set.findByPk(setId);
        if (set) {
            set.statusId = 3; // Mark as deleted
            await set.save();
        }
    }
}

Set.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: { notEmpty: true }
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE'
    },
    folderId: { 
        type: DataTypes.STRING,
        allowNull: true,
        references: { model: 'Folders', key: 'id' },
        onDelete: 'SET NULL'
    },
    isPublic: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    cardCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    statusId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1 // Active by default
    },
    isDraft: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true // Active by default
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize: db.sequelize,
    modelName: 'Set',
});

// Add the model to db
db.Set = Set;

export default Set;