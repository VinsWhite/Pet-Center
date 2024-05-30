const express = require('express');
const petController = require('../controller/petController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({ storage: storage });

const petRouter = express.Router();

petRouter.route('/')
    .get(petController.getAllPet)
    .post(upload.single('image'), petController.createAPet);

petRouter.route('/:id')
    .patch(petController.editAPet)
    .delete(petController.deleteAPet);

module.exports = petRouter;
