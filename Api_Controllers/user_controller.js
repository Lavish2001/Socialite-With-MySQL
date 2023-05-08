const User = require('../Table_Models/user');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');


// Get All Users

exports.allUsers = async (req, res) => {
    try {
        const allUsers = await User.findAll({
            where: {
                id: { [Op.ne]: req.user.id },
                [Op.or]: [{ userName: { [Op.like]: `%${(req.query.name).trim()}%` } }, { email: { [Op.like]: `%${(req.query.name).trim()}%` } }]
            },
            attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
        })
        if (allUsers.length) {
            return res.status(200).json(allUsers)
        } else {
            return res.status(400).json('no user found')
        }
    } catch (err) {
        return res.status(500).json({
            'status': 'Failed',
            'message': err.message
        })
    }
};



// Update User

exports.updateUser = async (req, res) => {
    try {
        await User.update({
            userName: req.body.userName,
            gender: req.body.gender,
            college: req.body.college,
            school: req.body.school
        },
            {
                where: { id: req.user.id }
            });
        return res.status(200).json({
            'status': 'success',
            'message': 'user data updated successfully'
        })
    } catch (err) {
        return res.status(500).json({
            'status': 'failed',
            'message': err.message
        })
    }
};




// Get Selected User

exports.singleUser = async (req, res) => {
    try {
        if (req.user.id == req.query.id) {
            return res.status(400).json('no user found')
        };
        const user = await User.findOne({
            where: { id: req.query.id }
        });
        if (user) {
            return res.status(200).json(user)
        } else {
            return res.status(400).json('no user found')
        }
    } catch (err) {
        return res.status(500).json({
            'status': 'failed',
            'message': err.message
        })
    }
}



// Change Password

exports.changePassword = async (req, res) => {
    try {
        const { currPassword, changePassword } = req.body;
        if (currPassword && changePassword) {
            const user = await User.findOne({
                where: { id: req.user.id }
            });
            if (user) {
                const validatePassword = await bcrypt.compare(currPassword, req.user.password);
                if (validatePassword) {
                    const salt = await bcrypt.genSalt(10);
                    const hashPassword = await bcrypt.hash(changePassword, salt);
                    await User.update(
                        { password: hashPassword },
                        { where: { id: req.user.id } }
                    );
                    return res.status(200).json({
                        'status': 'success',
                        'message': 'password changed successfulluy'
                    })
                } else {
                    return res.status(400).json({
                        'status': 'failed',
                        'message': 'wrong password'
                    })
                }
            }
        } else {
            return res.status(400).json({
                'status': 'failed',
                'message': 'please enter current password and change password'
            })
        }
    } catch (err) {
        return res.status(500).json({
            'status': 'failed',
            'message': err.message
        })
    }
};



