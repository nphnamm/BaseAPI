import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import db from '../models';

// Define Role attributes
export interface RoleAttributes {
  id: string;
  name: string;
  description: string;
}

interface RoleCreationAttributes extends Optional<RoleAttributes, 'id'> {}

// Define Role class
export class Role
  extends Model<RoleAttributes, RoleCreationAttributes>
  implements RoleAttributes {
  public id!: string;
  public name!: string;
  public description!: string;

  // Associations
  public static associate(models: { [key: string]: any }) {
    Role.hasMany(models.User, { foreignKey: 'roleId', as: 'users' });
  }
}

Role.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: db.sequelize,
    modelName: "Role",
  }
);

// Add the model to db
db.Role = Role;

export default Role; 