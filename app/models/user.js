'use strict';
module.exports = (Sequelize, DataTypes) => {
    var User = Sequelize.define('user', {
        id: {
            type: DataTypes.UUID,
            validate: {
                isUUID: 4
            },
            allowNull: false,
            primaryKey: true
        },
        uid: {
            type: DataTypes.STRING(18),
            allowNull: true,
            validate: {
                len: [14, 18]
            }
        },
        nickname: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                len: [1, 50]
            }
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        salt: {
            type: DataTypes.STRING(60),
            allowNull: false
        },
        hash: {
            type: DataTypes.STRING(60),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('active', 'pending', 'suspended', 'deleted'),
            defaultValue: 'pending',
            allowNull: false
        },
        firstName: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: 'first_name'
        },
        lastName: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: 'last_name'
        },
        cvFile: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: 'cv_file'
        },
        rememberToken: {
            type: DataTypes.UUID,
            allowNull: true,
            validate: {
                isUUID: 4
            },
            field: 'remember_token'
        },
        passwordResetToken: {
            type: DataTypes.UUID,
            allowNull: true,
            validate: {
                isUUID: 4
            },
            field: 'password_reset_token'
        },
        activationToken: {
            type: DataTypes.UUID,
            allowNull: true,
            validate: {
                isUUID: 4
            },
            field: 'activation_token'
        },
        god: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: 'god'
        }
    }, {
            timestamps: true,
            updatedAt: 'updated_at',
            createdAt: 'created_at',
            indexes: [
                {
                    unique: true,
                    fields: ['email']
                }
            ]
        });
    User.associate = models => {
        User.belongsToMany(models.role, { through: 'user_roles', as: 'roles' });
        User.belongsToMany(models.skill, { through: 'user_skills', as: 'skills' });
        User.belongsToMany(models.value, { through: 'user_values', as: 'values' });
        User.hasOne(models.profile, { as: 'profile', foreignKey: 'user_id' });
        User.hasMany(models.company, { as: 'ownedCompanies', foreignKey: 'user_id' });
        User.hasMany(models.article, { as: 'featuredArticles', foreignKey: 'user_id', scope: { is_featured: true } } );
        User.hasMany(models.article, { as: 'aboutMeArticles', foreignKey: 'user_id', scope: { is_about_me: true } });
        User.hasMany(models.article, { as: 'articles', foreignKey: 'user_id' });
        User.hasMany(models.experience, { as: 'experience', foreignKey: 'user_id' });
        User.hasMany(models.project, { as: 'projects', foreignKey: 'user_id' });
        User.hasMany(models.education, { as: 'educations', foreignKey: 'user_id' });
        User.hasMany(models.hobby, { as: 'hobbies', foreignKey: 'user_id' });
        User.hasOne(models.contact, { as: 'contact', foreignKey: 'user_id' });
        User.hasOne(models.experience, { as: 'currentExperience', foreignKey: 'user_id', scope: { is_current: true } });
        User.hasOne(models.project, { as: 'currentProject', foreignKey: 'user_id', scope: { is_current: true } });
        User.hasOne(models.education, { as: 'currentEducation', foreignKey: 'user_id', scope: { is_current: true } });
        User.hasOne(models.hobby, { as: 'currentHobby', foreignKey: 'user_id', scope: { is_current: true } });
        User.hasOne(models.story, { as: 'story', foreignKey: 'user_id' });
        User.belongsToMany(models.user, { through: 'user_followers', as: 'followers', foreignKey: 'user_id' });
        User.belongsToMany(models.user, { through: 'user_followers', as: 'followees', foreignKey: 'follower_id' });
        User.belongsToMany(models.company, { through: 'company_followers', as: 'followingCompanies', foreignKey: 'follower_id' });
        User.belongsToMany(models.team, { through: 'team_followers', as: 'followingTeams', foreignKey: 'follower_id' });
        User.belongsToMany(models.job, { through: 'job_followers', as: 'followingJobs', foreignKey: 'follower_id' });
        User.belongsToMany(models.job, { through: 'job_applicants', as: 'appliedJobs', foreignKey: 'applicant_id' });
        User.belongsToMany(models.articleArticleTag, { as: 'articleTags', through: 'article_article_tag_users', foreignKey: 'user_id' });
    }
    return User;
};