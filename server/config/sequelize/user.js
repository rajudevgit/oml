//user model
module.exports = function (sequelize, DataTypes) {
	const User = sequelize.define('User', {
        id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
		email: DataTypes.STRING,
		pwd: DataTypes.STRING,
		cnt_no: DataTypes.STRING,
		address: DataTypes.STRING,
		city: DataTypes.STRING,
		state: DataTypes.STRING,
		country: DataTypes.STRING,
		pin: DataTypes.STRING,
		otp: DataTypes.STRING,
		token: DataTypes.STRING,
		user_type: DataTypes.ENUM('A', 'N', 'S'), // A-> Admin, N-> Normal User, S->Staff
		is_activated: DataTypes.ENUM('Y','N'),
		created_at: {
			type: 'TIMESTAMP',
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			allowNull: false
		},
		permission: DataTypes.STRING
	}, {
		timestamps: false,
		underscored: true,
		freezeTableName: true,
		tableName: 'oml_users',
		classMethods: {
			associate: function (models) {
				//relations
				//User.hasMany(models.Booking, { foreignKey: 'user_id' });
			}
		}
	});
	return User;
};