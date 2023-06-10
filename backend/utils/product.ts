var upload = require("../utils/upload");
var product = require("../model/product.js");
var fs = require('fs');

/* Api to add Product */
function addProduct(req, res) {
    try {
        if (req.files && req.body && req.body.name && req.body.desc && req.body.price &&
            req.body.discount) {
            // if (req.body && req.body.name && req.body.desc && req.body.price &&
            //     req.body.discount) {
            console.log(req.files[0])
            let new_product = new product();
            new_product.name = req.body.name;
            new_product.desc = req.body.desc;
            new_product.price = req.body.price;
            new_product.image = req.files[0].filename;
            new_product.discount = req.body.discount;
            new_product.user_id = req.user.id;
            new_product.save((err, data) => {
                if (err) {
                    console.log(err)
                    res.status(400).json({
                        errorMessage: err,
                        status: false
                    });
                } else {
                    res.status(200).json({
                        status: true,
                        title: 'Product Added successfully.'
                    });
                }
            });

        } else {
            res.status(400).json({
                errorMessage: 'Add proper parameter first!',
                status: false
            });
        }
    } catch (e) {
        console.log(e)
        res.status(400).json({
            errorMessage: 'Something went wrong!',
            status: false
        });
    }
};

function updateProduct(req, res) {
    try {
        if (req.files && req.body && req.body.name && req.body.desc && req.body.price &&
            req.body.id && req.body.discount) {

            product.findById(req.body.id, (err, new_product) => {

                // if file already exist than remove it
                if (req.files && req.files[0] && req.files[0].filename && new_product.image) {
                    var path = `./uploads/${new_product.image}`;
                    fs.unlinkSync(path);
                }

                if (req.files && req.files[0] && req.files[0].filename) {
                    new_product.image = req.files[0].filename;
                }
                if (req.body.name) {
                    new_product.name = req.body.name;
                }
                if (req.body.desc) {
                    new_product.desc = req.body.desc;
                }
                if (req.body.price) {
                    new_product.price = req.body.price;
                }
                if (req.body.discount) {
                    new_product.discount = req.body.discount;
                }

                new_product.save((err, data) => {
                    if (err) {
                        res.status(400).json({
                            errorMessage: err,
                            status: false
                        });
                    } else {
                        res.status(200).json({
                            status: true,
                            title: 'Product updated.'
                        });
                    }
                });

            });

        } else {
            res.status(400).json({
                errorMessage: 'Add proper parameter first!',
                status: false
            });
        }
    } catch (e) {
        res.status(400).json({
            errorMessage: 'Something went wrong!',
            status: false
        });
    }
};

/* Api to delete Product */
function deleteProduct(req, res) {
    try {
        if (req.body && req.body.id) {
            product.findByIdAndUpdate(req.body.id, { is_delete: true }, { new: true }, (err, data) => {
                if (data.is_delete) {
                    res.status(200).json({
                        status: true,
                        title: 'Product deleted.'
                    });
                } else {
                    res.status(400).json({
                        errorMessage: err,
                        status: false
                    });
                }
            });
        } else {
            res.status(400).json({
                errorMessage: 'Add proper parameter first!',
                status: false
            });
        }
    } catch (e) {
        res.status(400).json({
            errorMessage: 'Something went wrong!',
            status: false
        });
    }
};


function getProduct(req, res) {
    try {
        var query = {};
        query["$and"] = [];
        query["$and"].push({
            is_delete: false,
            user_id: req.user.id
        });
        if (req.query && req.query.search) {
            query["$and"].push({
                name: { $regex: req.query.search }
            });
        }
        var perPage = 5;
        var page = req.query.page || 1;
        product.find(query, { date: 1, name: 1, id: 1, desc: 1, price: 1, discount: 1, image: 1 })
            .skip((perPage * page) - perPage).limit(perPage)
            .then((data) => {
                product.find(query).count()
                    .then((count) => {

                        if (data && data.length > 0) {
                            res.status(200).json({
                                status: true,
                                title: 'Product retrived.',
                                products: data,
                                current_page: page,
                                total: count,
                                pages: Math.ceil(count / perPage),
                            });
                        } else {
                            res.status(400).json({
                                errorMessage: 'There is no product!',
                                status: false
                            });
                        }

                    });

            }).catch(err => {
                res.status(400).json({
                    errorMessage: err.message || err,
                    status: false
                });
            });
    } catch (e) {
        res.status(400).json({
            errorMessage: 'Something went wrong!',
            status: false
        });
    }

};

export { addProduct, updateProduct, deleteProduct, getProduct };
