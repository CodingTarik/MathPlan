const path = require('path');
const readAndFilterData = require(path.join(path.dirname,'../utils/moduleDescriptionParser.js'));


const uploadPdf = (req, res) => {
    if (!req.body.id) {
        res.status(400).send({
        message: 'Content can not be empty!'
        });
        return;
    }
    
    readAndFilterData(req.body.id)
        .then(data => {
        res.send(data);
        })
        .catch(err => {
        res.status(500).send({
            message:
                err.message || 'Error adding module!'
        });
        });

};



modul.exports = {
    uploadPdf
};