2. Paste your firebaseConfig data from Firebase Console into the firebase `index.js` file
3. use whatever needed to this
4. Create a SignInView that allows users to register or login by email and/or Google OAuth
5. **Only** The following information should be saved on local storage:
   - Favorites
   - Cart
6. The following information **must** be saved on Firestore:
   - Genre Preferences
   - Purchases
7. Users should be able to view the following options in SettingsView:
   - Display name (updates user's Google Auth profile)
   - Avatar (updates user's Google Auth profile)
   - Password (only available for users logged in via email)
   - Genre preferences (saves to Firestore when the Save button is pressed)
   - Purchases (shows past purchases)
8. When the user presses the Purchase button in CartView:
   - They should see the `Dialog` component to confirm or reject their purchase
   - If the purchase is confirmed, they should be redirected to SuccessView
9. Implement a route guard so that only authorized users can access private routes
10. Ensure that the website does not lose any data when the browser is refreshed

original paths:
├── README.md
├── backend
├── biome.json
├── cspell.json
├── index.html
├── package-lock.json
├── package.json
├── src
│   ├── App.tsx
│   ├── components
│   │   ├── controls
│   │   │   ├── Pagination.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── buttons
│   │   │   │   ├── Button.tsx
│   │   │   │   └── ButtonGroup.tsx
│   │   │   ├── images
│   │   │   │   ├── AvatarSelector.tsx
│   │   │   │   ├── ImageGrid.tsx
│   │   │   │   └── ImageOverlay.tsx
│   │   │   └── links
│   │   │       ├── Link.tsx
│   │   │       └── LinkGroup.tsx
│   │   ├── index.ts
│   │   └── site
│   │       ├── DetailItem.tsx
│   │       ├── Dialog.tsx
│   │       ├── Header.tsx
│   │       ├── Modal.tsx
│   │       └── ProtectedRoute.tsx
│   ├── context
│   │   ├── FirebaseContext.ts
│   │   ├── FirebaseProvider.tsx
│   │   └── index.ts
│   ├── core
│   │   ├── constants
│   │   │   ├── components.ts
│   │   │   ├── data.ts
│   │   │   ├── endpoints.ts
│   │   │   ├── images.ts
│   │   │   └── storage.ts
│   │   ├── index.ts
│   │   ├── types
│   │   │   ├── components.ts
│   │   │   ├── context.ts
│   │   │   └── firebase.ts
│   │   └── utils
│   │       ├── getBackdropUrl.ts
│   │       ├── getImageUrl.ts
│   │       ├── getPrice.ts
│   │       └── imageActions.tsx
│   ├── firebase
│   │   └── index.ts
│   ├── hooks
│   │   ├── index.ts
│   │   ├── useDebounce.ts
│   │   ├── useFirebaseContext.ts
│   │   ├── useLocalStorage.ts
│   │   └── useTmdb.ts
│   ├── index.css
│   ├── layouts
│   │   ├── MainLayout.tsx
│   │   └── index.ts
│   ├── main.tsx
│   └── views
│       ├── index.ts
│       └── site
│           ├── BrowseView.tsx
│           ├── CartView.tsx
│           ├── DetailView.tsx
│           ├── ErrorView.tsx
│           ├── FavoritesView.tsx
│           ├── HomeView.tsx
│           ├── SettingsView.tsx
│           ├── SignInView.tsx
│           └── SuccessView.tsx
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts

19 directories, 62 files


NEEDED FIXES:
- fix the selection of genres - it is selecting correctly in the users page but is not updating when visiting the genres page (it should be able to select multiple genres and when prefered generes selected in settings it will show those genres)
- add a back button when visiting http://localhost:5174/movies/* or http://localhost:5174/tv/* so that you can easily navigate back to the last page