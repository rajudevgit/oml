'use strict';

var env = require(__base + 'config/env'),
    jwt = require('jsonwebtoken'),
    expressJwt = require('express-jwt'),
    compose = require('composable-middleware'),
    models = require(__base + 'config/sequelize'),
    validateJwt = expressJwt({
        secret: env.secret_key
    });

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated() {
    return compose()
        // Validate jwt
        .use(function(req, res, next) {
            // allow access_token to be passed through query parameter as well
            if (req.query && req.query.hasOwnProperty('access_token')) {
                req.headers.authorization = 'Bearer ' + req.query.access_token;
            }
            validateJwt(req, res, next);
        })
        // Attach user to request
        .use(function(req, res, next) {
            models.main.employee.findById(req.user._id, {
                attributes: ['id', 'first_name', 'last_name', 'email', 'employee_role_id'],
                where: {
                    active: true
                },
                raw: true
            }).then(function(rows) {
                if (!!rows && 'id' in rows) {
                    req.user = rows;
                    return next();
                } else {
                    return res.send(401);
                }
            }, function(err) {
                return res.send(401);
            });
        });
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
function hasRole(roleRequired) {
    if (!roleRequired) throw new Error('Required role needs to be set');

    return compose()
        .use(isAuthenticated())
        .use(function meetsRequirements(req, res, next) {
            if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
                next();
            } else {
                res.send(403);
            }
        });
}

/**
 * Returns a jwt token signed by the app secret
 */
function signToken(id) {
    return jwt.sign({
        _id: id
    }, env.secret_key, {
        expiresIn: "2 days"
    });
}


exports.isAuthenticated = isAuthenticated;
exports.hasRole = hasRole;
exports.signToken = signToken;
