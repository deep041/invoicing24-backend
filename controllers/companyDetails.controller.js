const companyDetails = require('../modals').companyDetails;
const sendResponse = require('../utils/response');

const getCompanyDetails = async (req, res, next) => {
    await companyDetails.findOne({ 'userId': req.user.id }).then((result, err) => {
        if (result) {
            sendResponse(res, 200, 200, true, 'Data retrieved successfully', result);
        } else {
            sendResponse(res, 200, 404, true, 'Failed', result);
        }
    });
}

const addCompanyDetails = async (req, res, next) => {
    let companyDetailsData = {
        name: req.body.name,
        contactNo: req.body.contactNo,
        address: req.body.address,
        stateCode: req.body.stateCode,
        gstNo: req.body.gstNo,
        userId: req.user.id
    }

    await companyDetails.findOne({ 'userId': req.user.id }).then(async (result, err) => {
        if (result) {
            await companyDetails.updateOne({ _id: result._id }, companyDetailsData).then((result2, err) => {
                if (result2) {
                    sendResponse(res, 200, 200, true, 'Customer updated successfully!', result2);
                } else {
                    sendResponse(res, 200, 403, false, 'Customer update failed', result2);
                }
            });
        } else {
            await companyDetails.create(companyDetailsData).then((result2, err) => {
                if (result2) {
                    sendResponse(res, 200, 200, true, 'Customer created successfully!', result2);
                } else {
                    sendResponse(res, 200, 403, false, 'Customer creation failed', result2);
                }
            });
        }
    });
}

module.exports = { getCompanyDetails, addCompanyDetails }