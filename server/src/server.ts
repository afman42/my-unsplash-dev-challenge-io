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
          const res = await prisma.photos.findMany()
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
            label: z.string({ required_error: "The Label is required"}).min(1,{ message: "Must be at least 1 character"}),
            photoUrl: z.string({ required_error: "The Photo URL is required "}).min(1,{ message: "Must be at least 1 character"})
          })
          const resError = photoSchema.safeParse({ label, photoUrl })
          if(!resError.success ) {
            const formatted = resError.error.format();
            return reply.code(422).send(formatted)
          }

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
            passwordInput: z.string({ required_error: "The Password Input is required"}).min(1,{ message: "Must be at least 1 character"}),
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