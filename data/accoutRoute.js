const express = require('express');

const db = require('./accounts-model');

const router = express.Router();
const validator = require('../utls/validateRoutes');


router.get("/", (req,res)=>
{
    db.find()
    .then(result => res.status(200).json(result))
    .catch(err => res.status(500).json({error: err, message: "could not find db"}));
})

router.get("/:id", validator.validateAccountId, (req,res) => res.status(200).json(req.data));

router.post("/", validator.validateAccount, (req,res,next) => 
    {
        db.add(req.data)
        .then(result => {
            req.params.id = result.id;
            next();
        })
        .catch(err=> res.status(400).json({error: err, message: "failed to add your data to the db"}))
    }, 
    validator.validateAccountId,
    (req,res) => res.status(200).json(req.data)
);

router.put("/:id", validator.validateAccountId, validator.validateAccount, (req,res,next) =>
    {
       db.update(req.params.id, req.data)
       .then(result => next())
       .catch(err=> res.status(400).json({error: err, message: "failed to update item from the db"}));
    },
    validator.validateAccountId,
    (req,res) => res.status(201).json(req.data)
);

router.delete("/:id", validator.validateAccountId, (req,res) => db.remove(req.params.id).then(()=> res.send("item was deleted")).catch(err=> res.status(400).json({error: err, message: "failed to remove item from the db"})));

module.exports = router;