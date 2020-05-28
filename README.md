# CShop
<h1>CSHOP</h1>
<p>This is a simulated e-store where users can buy items.</p>

//To delete an item by id.
app.delete('/deleteItem/:id', (req, res))

//Deletes a user given an email address.
app.delete('/user/:email', (req, res))

//Updates the price of an item given an id.
app.patch('/changePrice/:id', jsonParser, async(req, res))

//Deletes all items from a cart.
app.patch('/deleteCart/:email', jsonParser, async(req, res))

//Deletes a user's purchase history.
app.patch('/deleteHistory/:email', jsonParser, async(req, res))

//Deletes an item from a user's cart.
app.patch('/deleteFromCart/:email', jsonParser, async(req, res))

//Moves the cart items to purchase history.
app.patch('/cartToHistory/:email', jsonParser, async(req, res)
