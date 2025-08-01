import z from "zod";
import { protectedProcedure, t } from "../init";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";

export const clerkRouter = t.router({
  setRole: protectedProcedure.input(z.object({
    role: z.enum(['hr', 'employee'])
  })).mutation(async (opts) => {
    const { ctx, input } = opts
    const client = await clerkClient()
    try {

      const res = await client.users.updateUserMetadata(ctx.auth.userId, {
        publicMetadata: { role: input.role },
      })
      return { message: res.publicMetadata }
    } catch (e) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: e instanceof Error ? e.message : 'Unknown error',
      });
    }
  }),
  removeRole: protectedProcedure.mutation(async ({ ctx }) => {
    const client = await clerkClient()
    try {
      const res = await client.users.updateUserMetadata(ctx.auth.userId, {
        publicMetadata: {
          role: null
        }
      })

      return { message: res.publicMetadata }

    } catch (e) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: e instanceof Error ? e.message : 'Unknown error'
      })

    }

  })
})
