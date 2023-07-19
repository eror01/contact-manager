const asyncHandler = require('express-async-handler');
const Contact = require('../models/contactModel');

//@desc get All Contacts
//@route GET /api/contacts/
//@access private
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({user_id: req.user.id});
  res.status(200).json(contacts);
});

//@desc Create new Contact
//@route POST /api/contacts/
//@access private
const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;
  const mandatoryFields = !name || !email || !phone;
  if(mandatoryFields) {
    res.status(400);
    throw new Error('All fields are mandatory');
  }

  const contact = await Contact.create({
    name,
    email,
    phone,
    user_id: req.user.id
  });

  res.status(201).json(contact);
});

//@desc Get single Contact
//@route GET /api/contacts/:id
//@access private
const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if(!contact) {
    res.status(404);
    throw new Error('Contact not found');
  }
  res.status(200).json(contact);
});

//@desc Update contact
//@route PUT /api/contacts/:id
//@access private
const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if(!contact) {
    res.status(400);
    throw new Error('Contact not found')
  }

  const checkUser = contact.user_id.toString() !== req.user.id;
  
  if(checkUser) {
    res.status(403);
    throw new Error("User don't have permission to update other use contacts")
  }

  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  )

  res.status(200).json(updatedContact);
});

//@desc Delete contact
//@route DELETE /api/contacts/:id
//@access private
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndRemove(req.params.id);
  if(!contact) {
    res.status(400);
    throw new Error('Contact not found')
  }

  const checkUser = contact.user_id.toString() !== req.user.id;

  if(checkUser) {
    res.status(403);
    throw new Error("User don't have permission to update other user contacts")
  }

  const deletedContact = await Contact.deleteOne({_id: req.params.id});
  res.status(200).json(deletedContact);
});

module.exports = { getContacts, createContact, getContact, updateContact, deleteContact }