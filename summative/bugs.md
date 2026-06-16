FIXED:
- before showing the homeview, show a basepage. Basically a page that has an enter button (which takes you to home view) and showcases a few movies (make it look good and fit the theme), this page is shown on the first ever visit to the website.
- make "TV Shows" just be "TV"
- when adding stuff to favourites or adding stuff to cart, in the favourites view and cart view and when purchasing, show all items by default but sort by movies/tv shows (possible filters)
- when you are not signed in, ensure you cannot view ANY route except the basepage and a redirect to sign into the site

NEEDS FIXING:
- when you click on the user, i want there to be a drop down so it doesn't abruptly sign you outt (talking about btn elemtn <button class="ml-2 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition" title="Sign out"><img alt="Avatar" class="w-8 h-8 rounded-full object-cover" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka"><span class="hidden lg:inline">jamaler</span><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M497 273L329 441c-15 15-41 4.5-41-17v-96H152c-13.3 0-24-10.7-24-24v-96c0-13.3 10.7-24 24-24h136V88c0-21.4 25.9-32 41-17l168 168c9.3 9.4 9.3 24.6 0 34zM192 436v-40c0-6.6-5.4-12-12-12H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h84c6.6 0 12-5.4 12-12V76c0-6.6-5.4-12-12-12H96c-53 0-96 43-96 96v192c0 53 43 96 96 96h84c6.6 0 12-5.4 12-12z"></path></svg></button>)
- when you go to purchase and click confirm purchase, gives a missing/insufficent permissions error. This may have to deal with db writing to db there is insufficient perms? how to fix and fix in code if possible
- add a delete account feature that will delete their account from the site after a confirmation 
- make genre preferences save in firestore. it must be saved on firestore. it must save and get from there for persistence.
- make also purchases and previous purchase data saved on firestore. make it possible to purchase things first so insufficent perms must be fixed. 
- when you sign in its fine but when registering, make sure you have one more box for a prefered display name and also another for a prefered avatar or just a default avatar so this is for the REGISTER (google oauth is unaffected) - basically a username
