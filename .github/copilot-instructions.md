# NextAdmin Dashboard - AI Coding Guidelines

## Architecture Overview
- **Next.js 16 App Router** with route groups: `(auth)` for login/signup, `(main)` for dashboard pages
- **Shared Providers**: ThemeProvider (next-themes) and SidebarProvider in `src/app/(main)/providers.tsx`
- **Layout Structure**: Auth pages use minimal layout; main pages include Sidebar and Header
- **Data Flow**: API calls via `axiosExtended` with auth interceptors; currently uses fake data in services
- **State Management**: Redux setup in progress (store/slices/authSlice referenced but not implemented)

## Key Patterns & Conventions
- **Component Organization**: Features in `src/components/` with `index.tsx` exports; page-specific components in `_components/`
- **Icons**: Centralized in `src/assets/icons.tsx` as React components
- **Forms**: Use `InputGroup` from `FormElements/` for consistent styling
- **Charts**: ApexCharts integration in `src/components/Charts/` with timeFrame props
- **Time Frames**: Parsed from URL search params using `createTimeFrameExtractor` in `src/utils/timeframe-extractor.ts`
- **API Routes**: Defined in `src/utils/network/routes.ts` with `api/v1` prefix
- **Auth Handling**: Cookies (`cookies-next`) for persistence, Redux for state; login redirects via `getRedirect`

## Developer Workflows
- **Build/Run**: `yarn dev` for development, `yarn build` for production
- **Linting**: `yarn lint` with ESLint; formatting via Prettier with Tailwind plugin
- **Dependencies**: Use Yarn; recently added axios, react-redux, socket.io-client, redis (integration pending)
- **Environment**: Set `NEXT_PUBLIC_API_URL` for API base URL

## Integration Points
- **Authentication**: Email/password login via `routes.adminLoginEmail`; stores token/user in cookies and Redux
- **External APIs**: Axios interceptors add Bearer token from Redux store state
- **Real-time**: Socket.io-client added but not yet integrated
- **Caching**: Redis dependency added but unused
- **Charts/Maps**: ApexCharts and jsvectormap for visualizations

## Code Examples
- **Auth Component**: See `src/components/Auth/SigninWithPassword.tsx` for login flow with form handling and API call
- **Chart Usage**: `src/app/(main)/(home)/page.tsx` shows Suspense-wrapped charts with timeFrame keys
- **API Call**: `axiosExtended.post(routes.adminLoginEmail, payload)` in auth components
- **Layout**: Route group layouts share providers but differ in sidebar/header inclusion

## Notes
- Data services currently return fake data with artificial delays for demo purposes
- Redux store and authSlice imports exist but implementation is incomplete
- Focus on UI components and layout patterns for new features</content>
<parameter name="filePath">/Users/user/Documents/Cardic/nextjs-admin-dashboard/.github/copilot-instructions.md