const orgsRouter = require('express').Router()
const jwt = require('jsonwebtoken')

const Org = require('../models/org')
const User = require('../models/user')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

orgsRouter.get('/', async (request, response) => {
  const orgs = await Org
    .find({})
    .populate('user', { username: 1, firstname: 1, lastname: 1 })

  response.json(orgs)
})

orgsRouter.get('/:id', async (request, response) => {
  const org = await Org.findById(request.params.id)

  if (org) {
    response.json(org.toJSON())
  } else {
    response.status(404).end()
  }
})

orgsRouter.post('/', async (request, response) => {
  const { orgName, tiers } = request.body

  const org = new Org({
    orgName,
    tiers,
  })

  const savedOrg = await org.save()

  response.status(201).json(savedOrg)
})

orgsRouter.delete('/:id', async (request, response) => {
  await Org.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

orgsRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const org = {
    orgName: body.orgName,
    tiers: body.tiers,
  }

  Org.findByIdAndUpdate(request.params.id, org, { new: true })
    .then(updatedOrg => {
      response.json(updatedOrg)
    })
    .catch(error => next(error))
})

module.exports = orgsRouter