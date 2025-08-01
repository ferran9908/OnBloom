import { createTRPCRouter } from '../init';
import { clerkRouter } from './clerk';
import { employeeRouter } from './employee';
import { relationshipsRouter } from './relationships';
import { onboardingRouter } from './onboarding';

export const appRouter = createTRPCRouter({
  clerk: clerkRouter,
  employee: employeeRouter,
  relationships: relationshipsRouter,
  onboarding: onboardingRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
