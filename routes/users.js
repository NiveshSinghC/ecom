const express = require('express');
// const mongoose = require('mongoose');
const publicIp = require('public-ip');
const router = express.Router();
const config = require('../config/database');

// required modules
const url = require('url');
const nodeID = require('node-machine-id');
const uuid = require('machine-uuid');
const emailExists = require('email-exists');
const validator = require('validator');
const emailCheck = require('email-check');
const expressValidator = require('express-validator');
const multer = require('multer');

//Models
const User = require('../models/user');
const Update = require('../models/update');
const Category = require('../models/category');
const Customer = require('../models/customer');




const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, 'public/assets/');
        },
        filename: function(req, file, cb) {
            cb(null, Date.now() + '.jpg');
        }
    })
    //file destination
var upload = multer({ storage: storage });

// Register
router.get('/category', (req, res, next) => {
    Category.category((err, category) => {
        if (err) {
            console.log(err)
        }
        if (category) {
            console.log(category);
            res.json({
                category: category
            });
        }
    });
});

// Unique Indentity of the client computer or device
router.get('/UniqueIdentifier', (req, res) => {

    res.json({
        UniqueId: nodeID.machineIdSync({ original: true })
    });

});

//email existence check route
router.post('/emailExist', (req, res) => {
    let email = req.body.email;
    let name = req.body.name;
    let review = req.body.review;

    console.log(email);

    let validate = validator.isEmail(email);

    console.log(validate);

    if (validate) {
        //     emailExistance.check(email, (err, existene) => {

        //         if (err) {
        //             res.json({
        //                 success: false,
        //                 msg: err
        //             });
        //         } else {

        let data = {
            $push: {
                review: {
                    custreview: review,
                    custemail: email,
                    custname: name
                }
            }
        }

        let query = { _id: req.body.id }

        User.update(query, data, (err, set) => {
            if (err) {
                res.json({
                    success: false,
                    msg: err
                });
            }
            if (set) {
                res.json({
                    success: true,
                    msg: true
                });
            }
        });


        //         }
        //     });
    } else {
        res.json({
            msg: 'invalid email format'
        })
    }

});

// all product
router.get('/product', (req, res, next) => {

    User.product((err, product) => {
        if (err) throw err;
        if (product) {
            res.json({
                success: true,
                product: product
            });
        }
    });

});

router.get('/customer', (req, res, next) => {

    let custname = req.body.custname;
    User.cust(custname, (err, customer) => {
        if (err) throw err;
        if (customer) {
            res.json({
                success: true,
                product: customer
            });
        }
    });

});

// Profile
router.post('/item', (req, res, next) => {

    let name = req.body.name;
    User.item(name, (err, item) => {
        if (err) throw err;
        if (item) {
            res.json({
                success: true,
                product: item
            });
        }
    });
});

// cms main route
router.get('/cms', (req, res, next) => {
    res.render('cms');
});


// Content Management System/product adding route
router.get('/cms/product_add', (req, res, next) => {

    Category.category((err, category) => {
        if (err) {
            throw err;
        } else {
            res.render('product_add', {
                errors: false,
                cat: category
            });
        }
    });

});

//Product add route (POST)
router.post('/cms/product_add', upload.any(), (req, res) => {
    req.checkBody('prname', 'Name is required').notEmpty();
    req.checkBody('prsdesc', 'Short Dscription is required').notEmpty();
    req.checkBody('prfdesc', 'Full Description is required').notEmpty();
    req.checkBody('prft', 'Profit is required').notEmpty();
    req.checkBody('prctg', 'Category is required').notEmpty();
    req.checkBody('prsubctg', 'Sub Category Price is required').notEmpty();
    req.checkBody('prprice', 'Price is required').notEmpty();
    req.checkBody('prslprice', 'Sale Price is required').notEmpty();
    req.checkBody('prstock', 'Stock is required').notEmpty();

    if (req.files[0] == undefined) {
        req.checkBody('primage', 'Image is required').notEmpty();
    }


    let errors = req.validationErrors();

    if (errors) {
        res.render('product_add', {
            errors: errors
        });
    } else {
        let item = new User({
            name: req.body.prname,
            imageName: req.files[0].filename,
            shortDescription: req.body.prsdesc,
            fullDescription: req.body.prfdesc,
            features: req.body.prft,
            category: req.body.prctg,
            subcategory: req.body.prsubctg,
            price: req.body.prprice,
            salePrice: req.body.prslprice,
            stock: req.body.prstock,
            review: []

        });

        User.addProduct(item, (err, item) => {
            if (err) {
                res.json({
                    success: false,
                    msg: err
                });
            }
            if (item) {
                req.flash("success", "Product added successfully")
                res.redirect('/cms/product_add');
            }
        });
        console.log("submit");
    }
});

//product update route
router.get('/cms/product_update', (req, res) => {
    let name = req.query.name;

    User.item(name, (err, item) => {
        if (err) throw err;
        if (item) {

            Category.category((err, category) => {
                if (err) {
                    console.log(err)
                }
                if (category) {
                    console.log(category);
                    res.render('product_update', {
                        id: item._id,
                        name: name,
                        slPrice: item.salePrice,
                        price: item.price,
                        ctg: item.category,
                        subctg: item.subcategory,
                        srdesc: item.shortDescription,
                        fldesc: item.fullDescription,
                        stock: item.stock,
                        features: item.features,
                        imageName: item.imageName,
                        cat: category

                    });
                }
            });

        }
    });
});

//product update post route
router.post('/cms/product_update/:id', upload.any(), (req, res) => {

    let update = {
        name: req.body.prname,
        shortDescription: req.body.prsdesc,
        fullDescription: req.body.prfdesc,
        features: req.body.prft,
        category: req.body.prctg,
        subcategory: req.body.prsubctg,
        price: req.body.prprice,
        salePrice: req.body.prslprice,
        stock: req.body.prstock,
    }
    let query = { _id: req.params.id }

    Update.update(query, update, (err) => {
        if (err) {
            console.log(err);
            return;
        } else {
            req.flash('success', 'Product Modified Successfully');
            res.redirect('/cms/all_products')
        }
    });

});

//product delete post route
router.get('/cms/product_delete/:id', (req, res) => {

    let query = { _id: req.params.id }

    Update.remove(query, (err) => {
        if (err) {
            console.log(err);
            return;
        } else {
            req.flash('success', 'Product deleted Successfully');
            res.redirect('/cms/all_products')
        }
    });


});

//view item route
router.get('/cms/item_view', (req, res) => {

    User.view(req.query.id, (err, item) => {
        if (err) throw err;
        if (item) {
            res.render('item_view', {
                item: item
            });
        }
    });

});

//show all categories route
router.get('/cms/all_categories', (req, res) => {

    Category.category((err, category) => {
        if (err) {
            console.log(err)
        }
        if (category) {
            console.log(category);
            res.render('all_categories', {
                category: category
            });
        }
    });

})

//category route (GET)
router.get('/cms/category_add', (req, res, next) => {

    res.render('category_add');
});

//category route (post)
router.post('/cms/category_add', (req, res, next) => {
    let category = new Category({
        name: req.body.ctg
    });

    Category.addCategory(category, (err, cat) => {
        if (err) {
            console.log(err)
            req.flash("danger", "Problem Occured in Addig category")
            res.redirect('/cms/category_add');
        }
        if (cat) {
            req.flash("success", "Category added successfully")
            res.redirect('/cms/category_add');
        }
    });
});

//Sub category route (GET)
router.get('/cms/subcategory_add/:id', (req, res, next) => {


    res.render('add_subcategory', {
        id: req.params.id
    });
});

//Sub category route (post)
router.post('/cms/subcategory_add/:id', (req, res, next) => {
    let addsubcat = {
        $push: {
            subcat: { name: req.body.subctg }
        }
    }
    let query = { _id: req.params.id }

    Category.addSubCategory(query, addsubcat, (err) => {
        if (err) {
            console.log(err);
            return;
        } else {
            req.flash('success', 'Sub Category Added Successfully');
            res.redirect('/cms/all_categories')
        }
    });
});

//show given category route
router.post('/cms/catdet', (req, res) => {
    Category.GiveCatDet(req.body.name, (err, category) => {
        if (err) throw err;
        if (category) {
            res.json({
                success: true,
                cat: category
            });
        }
    });
});

//show all products route
router.get('/cms/all_products', (req, res) => {
    User.product((err, product) => {
        if (err) throw err;
        if (product) {
            res.render('all_products', {
                success: true,
                product: product
            });
        }
    });

});

//search route
router.post('/search', (req, res) => {
    query = req.body.name

    User.search(query, (err, searchResult) => {
        if (err) throw err;
        if (searchResult) {
            res.json({
                success: true,
                product: searchResult
            });
        }
    });
});

module.exports = router;
