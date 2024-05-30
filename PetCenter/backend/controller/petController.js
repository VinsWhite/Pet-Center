const Pet = require('../model/petModel');

exports.getAllPet = async (req, res) => {

    try {
        const pet = await Pet.find();
        res.status(200).json({
            status: 'success',
            data: {
                pet
            }
        });
    } catch (err) {
        res.status(404).json ({
            status: 'fail',
            message: err.message
        })
    }

}

exports.createAPet = async (req, res) => {
    try {
        const { name, description, species } = req.body;

        const imagePath = req.file ? req.file.path : '';

        const pet = await Pet.create({ name, description, species, imagePath });

        res.status(201).json({
            status: 'success',
            data: {
                pet
            }
        })

    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
}


exports.deleteAPet = async (req, res) => {
    try {

        const pet = await Pet.findByIdAndDelete (req.params.id);
        
        if (!pet) {
            return res.status(404).json({
                status: 'fail',
                message: 'Pet not found'
            });
        }

        res.status(201).json ({
            status: 'success'
        })

    } catch (err) {
        res.status(404).json ({
            status: 'fail',
            message: err.message
        })
    }
}

exports.editAPet = async (req, res) => {
    try {
        const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        
        if (!pet) {
            return res.status(404).json({
                status: 'fail',
                message: 'Pet not found'
            });
        }

        res.status(201).json ({
            status: 'success',
            data: {
                pet
            }
        })
    } catch (err) {
        res.status(404).json ({
            status: 'fail',
            message: err.message
        })
    }
}