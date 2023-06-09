import Fastify, { FastifyReply, FastifyRequest }   from "fastify";
import { prisma } from "./utils";
import cors from '@fastify/cors'
import { z } from "zod";


function buildServer() {
  const server = Fastify();

  server.register(cors,{ origin: true })
  
  server.route({
    method: "GET",
    url: "/all",
    schema: {
      response: {
        "200": {
          type: "array",
          properties: {
            id: { type: "number" },
            label: { type: "string" },
            photoUrl: { type: "string" }
          }
        },
        "500": {
          type: "object",
          properties: {
            data: { type: "string" }
          }
        },
      }
    },
    handler: async function(_: FastifyRequest, reply: FastifyReply){   
      try {
          const res = await prisma.photos.findMany({
            orderBy: [
              {
                id: "desc"
              }
            ]
          })
          return reply.code(200).send(res)
        } catch (error) {
          reply.code(500).send({ data: "Something Went Wrong"})
          console.log(error)
        }
    }
  })

  server.route({
    method: "GET",
    url: "/search",
    schema: {
      response: {
        "200": {
          type: "array",
          properties: {
            id: { type: "number" },
            label: { type: "string" },
            photoUrl: { type: "string" }
          }
        },
        "404": {
          type: "array",
          properties: {
            id: { type: "number" },
            label: { type: "string" },
            photoUrl: { type: "string" }
          }
        },
        "500": {
          type: "object",
          properties: {
            data: { type: "string" }
          }
        },
      }
    },
    handler: async function(request: FastifyRequest<{
      Querystring: {
        nameLabel: string
      }
    }>, reply: FastifyReply){   
      try {
          const {nameLabel } = request.query

          if(!nameLabel) reply.code(404).send({ message: "Not Found", data: [] })
          
          const res = await prisma.photos.findMany({
            where: { 
              label: {
                contains: nameLabel
              }
            }
          })

          if(!res) reply.code(404).send({ message: "Not Found", data: res })

          return reply.code(200).send(res)
        } catch (error) {
          reply.code(500).send({ data: "Something Went Wrong"})
          console.log(error)
        }
    }
  })

  server.route({
    method: "POST",
    url: "/create",
    schema: {
      response: {
        "200": {
          type: "object",
          properties: {
            id: { type: "number" },
            label: { type: "string" },
            photoUrl: { type: "string" }
          }
        },
        "500": {
          type: "object",
          properties: {
            data: { type: "string" }
          }
        },
        "400": {
          type: "object",
          properties: {
            data: { type: "string" }
          }
        },
        "422": {
          type: "object",
          properties: {
            _errors: { type: "object" },
            label: { _errors: { type: "array" } },
            photoUrl: { _errors: { type: "array" } },
          }
        }
      }
    },
    handler: async function(request: FastifyRequest<{
        Body: {
            label: string,
            photoUrl: string,
        }
    }>, reply: FastifyReply){   
      try {
          const { label, photoUrl } = request.body
          const photoSchema = z.object({
            label: z
              .string({ required_error: "The Label is required"})
              .min(1,{ message: "The Label Must be at least 1 character"})
              .max(12,{ message: "The Label Max 12 character" }),
            photoUrl: z
              .string({ required_error: "The Photo URL is required "})
              .min(1,{ message: "The Photo URL Must be at least 1 character"})
              .refine((text) => text.includes("https://"),"The Photo Url must https")
              .refine((text) => text.includes(".jpeg") || text.includes(".webp") || text.includes(".jpg") || text.includes(".png"),"The Photo Url end with must .jpg, .jpeg, .png and .webp")
          })
          const resError = photoSchema.safeParse({ label, photoUrl })
          if(!resError.success ) {
            const formatted = resError.error.format();
            return reply.code(422).send(formatted)
          }

          const resFindFirst = await prisma.photos.findFirst({
            where: { photoUrl }
          })

          if(resFindFirst) reply.code(400).send({ data: "The Photo Url must be unique" })

          const res = await prisma.photos.create({
              data: {
                    label,
                    photoUrl
              }
          })

          return reply.code(200).send(res)
        } catch (error) {
          reply.code(500).send({ data: "Something Went Wrong"})
          console.log(error)
        }
    }
  })

  server.route({
    method: "DELETE",
    url: "/delete/:id",
    schema: {
      response: {
        "200": {
          type: "object",
          properties: {
            data: { type: "string" }
          }
        },
        "404": {
          type: "object",
          properties: {
            data: { type: "string" }
          }
        },
        "500": {
          type: "object",
          properties: {
            data: { type: "string" }
          }
        },
      }
    },
    handler: async function(request: FastifyRequest<{
      Body: {
        passwordInput: string
      }
    }>, reply: FastifyReply){
        try {
          const paramID = (request.params as any).id as string
          const { passwordInput } = request.body
          const photoSchema = z.object({
            passwordInput: z.string({ required_error: "The Password Input is required"}).min(1,{ message: "The Password Input Must be at least 1 character"}),
          })
          const resError = photoSchema.safeParse({ passwordInput })
          if(!resError.success ) {
            const formatted = resError.error.format();
            return reply.code(422).send(formatted)
          }

          if(passwordInput !== process.env.PASSWORD_DELETE) {
            return reply.code(400).send({ data: "Wrong Password"})
          }

          const resFirst = await prisma.photos.findFirst({
            where: { id: parseInt(paramID) }
          })

          if (!resFirst) reply.code(404).send({ data: "Not Found"})

          await prisma.photos.delete({
            where: { id: parseInt(paramID) }
          })

          return reply.code(200).send({ data: "Succeffully delete image"})
        } catch (error) {
          reply.code(500).send({ data: "Something Went Wrong"})
          console.log(error)
        }
    }
  })

  return server;
}

export default buildServer;