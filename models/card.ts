import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import db from '../models';

// Import Op from Sequelize (not used yet, but included for consistency)
const { Op }:any = Sequelize;

export interface CardAttributes {
    id: number;
    term: string;
    definition: string;
    setId: number;
    position: number;
    statusId: number;
    createdAt: Date;
    updatedAt: Date;
    imageUrl: string;
}

interface CardCreationAttributes extends Optional<CardAttributes, 'id' | 'position' | 'createdAt' | 'updatedAt'> { }

export class Card extends Model<CardAttributes, CardCreationAttributes> implements CardAttributes {
    public id!: number;
    public term!: string;
    public definition!: string;
    public setId!: number;
    public position!: number;
    public statusId!: number;
    public createdAt!: Date;
    public updatedAt!: Date;
    public imageUrl!: string;

    public static associate(models: { [key: string]: any }) {
        Card.belongsTo(models.Set, { foreignKey: 'setId', as: 'set' });
    }

    public async setPosition(newPosition: number): Promise<void> {
        this.position = newPosition;
        await this.save();
    }

    public async duplicate(): Promise<Card> {
        return await Card.create({
            term: this.term,
            definition: this.definition,
            setId: this.setId,
            position: this.position + 1,
            statusId: this.statusId,
            imageUrl: this.imageUrl
        });
    }

    public static async softDelete(cardId: number): Promise<void> {
        const card = await Card.findByPk(cardId);
        if (card) {
            card.statusId = 3; // Mark as deleted
            await card.save();
        }
    }
}

Card.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    term: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: { notEmpty: true }
    },
    definition: {
        type: DataTypes.STRING(500),
        allowNull: false,
        validate: { notEmpty: true }
    },
    setId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Sets', key: 'id' },
        onDelete: 'CASCADE'
    },
    position: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    statusId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1 // Active by default
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    imageUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
    }
}, {
    sequelize: db.sequelize,
    modelName: 'Card',
});

// Add the model to db
db.Card = Card;

export default Card;