import { validate } from "../validation/validation.js"
import { prismaClient } from "../application/database.js"
import { getContactValidation } from "../validation/contact-validation.js"
import { ResponseError } from "../error/response-error.js"
import {
  createAddressValidaton,
  getAddressValidation,
  removeAddressValidation,
  updateAddressValidaton,
} from "../validation/address-validation.js"

const checkContactMustExist = async (user, contactId) => {
  contactId = validate(getContactValidation, contactId)
  const totalContactInDatabase = await prismaClient.contact.count({
    where: {
      username: user.username,
      id: contactId,
    },
  })
  if (totalContactInDatabase !== 1) {
    throw new ResponseError(404, "Contact is not found")
  }
  return contactId
}
const create = async (user, contactId, request) => {
  contactId = await checkContactMustExist(user, contactId)
  const address = validate(createAddressValidaton, request)
  address.contact_id = contactId
  return prismaClient.address.create({
    data: address,
    select: {
      id: true,
      street: true,
      city: true,
      province: true,
      country: true,
      postal_code: true,
    },
  })
}

const get = async (user, contactId, addressId) => {
  contactId = await checkContactMustExist(user, contactId)
  addressId = validate(getAddressValidation, addressId)
  const address = await prismaClient.address.findFirst({
    where: { contact_id: contactId, id: addressId },
    select: {
      id: true,
      street: true,
      city: true,
      province: true,
      country: true,
      postal_code: true,
    },
  })
  if (!address) {
    throw new ResponseError(404, "Address Is Not Found")
  }
  return address
}
const update = async (user, contactId, request) => {
  contactId = await checkContactMustExist(user, contactId)
  const address = validate(updateAddressValidaton, request)
  const totalAddressInDatabase = await prismaClient.address.count({
    where: { contact_id: contactId, id: address.id },
  })
  if (totalAddressInDatabase !== 1) {
    throw new ResponseError(404, "Address Is Not Found")
  }
  address.contact_id = contactId
  return prismaClient.address.update({
    where: {
      id: address.id,
    },
    data: {
      street: address.street,
      city: address.city,
      province: address.province,
      country: address.country,
      postal_code: address.postal_code,
    },
    select: {
      id: true,
      street: true,
      city: true,
      province: true,
      country: true,
      postal_code: true,
    },
  })
}
const remove = async (user, contactId, addressId) => {
  contactId = await checkContactMustExist(user, contactId)
  addressId = validate(removeAddressValidation, addressId)
  const totalAddressInDatabase = await prismaClient.address.count({
    where: { contact_id: contactId, id: addressId },
  })
  if (totalAddressInDatabase !== 1) {
    throw new ResponseError(404, "Address Is Not Found")
  }
  return prismaClient.address.delete({
    where: {
      id: addressId,
    },
  })
}

const list = async (user, contactId) => {
  contactId = await checkContactMustExist(user, contactId)
  return prismaClient.address.findMany({
    where: { contact_id: contactId },
    select: {
      id: true,
      street: true,
      city: true,
      province: true,
      country: true,
      postal_code: true,
    },
  })
}
export default {
  create,
  get,
  update,
  remove,
  list,
}
