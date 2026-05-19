write whats on your paper here explaining the steps to the project till now 


now i have a stable frontend foundation:
react
+vite
+typescript
+tailwind
+shadcn/ui
+react router

next step is building the first real feature:
THE PLANT MEMORY FORM 
this is where the application becomes interactive instead of static pages
The form should collect:
-memory title 
-description/story
-emotion
-date
Then later we will connect it to:
GARDEN PAGE; 
->visual memory cards
->emotional plants

What we're building architecturally:(real data flow)
User Input
   ↓
React State
   ↓
Memory Object
   ↓
Memory Array
   ↓
Garden Rendering

what happens technically when user submits form:
Input fields
→ state updates
→ memory object created
→ stored in array/state
→ displayed visually

we're understanding here the use of:
state
forms
controlled inputs
event handling
rendering lists
data flow in React
!These are core React concepts.!

now after modifying and testing plantMemory:
->routing works
->forms work
->state works
->file upload works
->previews work
->project architecture works

Right now, PlantMemory logs the memory only in the console.
But we need this flow:
PlantMemory form
→ create memory object
→ save it in App state
→ show it in Garden
→ show it in Timeline

So next we should update:
App.tsx
PlantMemory.tsx
Garden.tsx
Timeline.tsx
(to share the same memories)

logic flow
PlantMemory → App state → Garden + Timeline

Next: add localStorage so memories don’t disappear when you refresh the page.
in app.tsx

and add delete memory features in app.tsx that are passes in garden and timeline
now the app supports:
-Create memory
-Read memory
-Delete memory
-Persist memory

my architecture is gonna change to a more professional one:
Frontend React app
  ├── Public routes
  │   ├── Login
  │   └── Signup
  │
  ├── Protected routes
  │   ├── Dashboard
  │   ├── Plant Memory
  │   ├── Garden
  │   ├── Timeline
  │   ├── Profile
  │   └── Settings
  │
  ├── API layer
  │   ├── axios instance
  │   ├── token interceptor
  │   └── global error handler
  │
  ├── Auth context
  │   ├── user
  │   ├── token
  │   ├── login
  │   ├── logout
  │   └── protected route guard
  │
  └── Dashboard
      ├── AG Grid memory table
      ├── stats cards
      └── management tools

our routes change to:
/login        public
/signup       public

/dashboard    protected
/plant        protected
/garden       protected
/timeline     protected
/profile      protected
/settings     protected

we need to build in this order now:
1. API client with interceptors
   Every API request automatically sends token
   If token is invalid/expired → logout user → redirect to login (from file apiClient.ts)
2. AuthContext
   this will control:
   login
   signup
   logout
   current user
   token
   authentication state
   seperated the functions 
   context/
  AuthContext.tsx
      → provider/state

   hooks/
  useAuth.ts
      → reusable hook

         ADDED THIS PART OF CODE: 
import { AuthProvider } from "@/context/AuthContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
NOW EVERY PAGE/COMPONENT CAN ACCESS:
   user
   token
   login
   signup
   logout
   isAuthenticated

   THROUGH: useAuth()
3. ProtectedRoute
   WHAT THIS DOES:
   If user NOT logged in
    → redirect to /login

   If logged in
    → allow access
4. AuthLayout + MainLayout
5. Login/Signup pages
6. Logout
7. Toast notifications
8. Dashboard with AG Grid

   NOW MY APP HAS :
   Public routes
   Protected routes
   Authentication guard
   Dashboard
   Login
   Signup
   Memory system
   Persistent storage
   Logout foundation

   cuurently frontend architecture is real but backend is not
   my frontend expects POST /auth/login, POST /auth/signup
   but backend doesnt exist yet
   now i build express backend with:
   node.js
   express
   MongoDB or MySQL
   JWT auth
   bycryprt passwords
   auth middleware
   real databse

   created a new folder called memory-garden-backend with a new structure 
   memory-garden-backend/
  src/
    server.js
    routes/
      authRoutes.js
    controllers/
      authController.js
    middleware/
      authMiddleware.js
    data/
      users.js
  .env
  package.json

  