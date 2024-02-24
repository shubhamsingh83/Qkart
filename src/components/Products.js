import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import ProductCard from "./ProductCard";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import Cart,{generateCartItemsFrom} from "./Cart";


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */


const Products = () => {
     const[products,setProduts]  = useState([]);
     const[loading,setLoading] = useState(false);
     const { enqueueSnackbar } = useSnackbar();
     const[filteredProduct,setFilteredproduct] =useState([]);
     const[timer,setTimer] = useState(null);
     const[items,setItems] = useState([])

      // cart items for a user
      const [cartItem, setCartItem]= useState([]);

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
    //  const [token,setToken] = useState(null)
    let token = localStorage.getItem("token");
  let username = localStorage.getItem("username");
     //to call FetchCart fucntion in useEffect when "", henec use the below state in dependency array:
      const [cartLoad, setcartLoad]= useState(false);

    


  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    setLoading(true);
    try{
      let res = await axios.get(`${config.endpoint}/products`)
      // console.log(res);
      setProduts(res.data)  
      setFilteredproduct(res.data);
      setcartLoad(true);
     }

     catch(e){
      if(e.response.status === 400){
        enqueueSnackbar(
          e.response.data.message,
         { variant:"error"}
        )

     }
     }
  
      setLoading(false);
     
    
  };

  useEffect(()=>{
    performAPICall()
  },[])

  // useEffect(()=>{
  //   const onLoadHandler = async()=>{
  //     const productsData = await performAPICall();
  //     setToken(localStorage.getItem('token'))
  //     const cartData = await fetchCart(localStorage.getItem('token'));
  //     const cartDetails = await generateCartItemsFrom(cartData,productsData);
  //     setItems(cartDetails);
  //   };
  //   onLoadHandler();
  // },[]);

  // -----use this simple approach here:
//get req to fetch cart items for a logged in user
useEffect(()=>{
  fetchCart(token)
},[cartLoad]);

 


  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {

     try{
      let res  =  await axios.get(`${config.endpoint}/products/search?value=${text}`)
      console.log(res);
      setFilteredproduct(res.data);
     }
      
     catch(e){
      if(e.response){

        if(e.response.status === 404){
           setFilteredproduct([]) ; 
           }
         if(e.response.status===500){
          enqueueSnackbar(
            e.response.data.message,
           { variant:"error"}
          )
          setFilteredproduct(products)  
        }
      } else{
        enqueueSnackbar(
         "Could not Fetch Produts .Check the backend is running , reachable and  returns valid JSON",
         { variant:"error"}
        )

      }

      }
      

  };

  // useEffect(()=>{
  //   performSearch()
  // },[])

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
   if(debounceTimeout){
    clearTimeout(debounceTimeout)
   }

   let timerId  = setTimeout(() => {
    performSearch(event.target.value)
   }, 500);
   setTimer(timerId)
  };


  //------need to include this into the return function itself-----------
// const getGridItems = (filteredProduct)  => {
//    return  ( filteredProduct.length ?  filteredProduct.map((product) => (
//     <Grid item xs={6} md={3} key={product._id} >
//         <ProductCard
//           product={product} 
//           handleAddToCart={async()=>{
//             await addToCart(
//              token,
//               items,
//               products,
//               product._id,
//               1,
//               { 
//                 preventDuplicate: true,
//               }

//             )
//           }}

//           />
//         </Grid> )): <Box className = "loading">
//        < SentimentDissatisfied color="action"/>
//        <h4>No products found </h4>
//         </Box>)
      
// }





  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      const response = await axios.get(`${config.endpoint}/cart`,{
           headers: {
            Authorization : `Bearer ${token}`
           },
      });
      // console.log(response);
      if (response.status === 200) {
      // return response.data;
      setCartItem(generateCartItemsFrom(response.data,products));

      }
    
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

 
// ----------no need to use it externally, can be implemented in one line----
//  const updateCartItems = (cartData,products) => {
//      const cartItems  = generateCartItemsFrom(cartData,products);
//      setItems(cartItems)
//   };

  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    // ----------return statement is not required like this-------
    // if(items){
    //   // return items.findIndex((item)=>item.productId === productId) !== -1;
    //   const isExists = items.find((item)=> item.productId === productId);
    //   return !!isExists; 
    // }
    for(let i=0;i<items.length;i++){
      if(items[i].productId===productId){
        return true;
      }
    }
    return false;
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty=1,
    options = { preventDuplicate: false }
  ) => {
   //check if user is logged in

   if(token){
    //now check if item is already in the cart or 
     if(isItemInCart(items, productId)){
       enqueueSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item.",
        {
          variant: "error",
        }
      );
     }
     else{
       //make post req with product id and qty
        addInCart(productId,qty);
     }
   
   }
  else{
    // 
    enqueueSnackbar(
      "Login to add an item to the Cart",
      {
        variant: "error",
      }
    );

  }
  };

 //helper function for addToCart (addition to the cart logic here)
 const addInCart=async(productId,qty)=>{
  // console.log("qty passed in addInCart:",qty);
   try{
    let response= await axios.post(
      `${config.endpoint}/cart` ,
      {
        productId:productId,
        qty:qty
       },
       {
        headers: {
          Authorization: `Bearer ${token}`,
        }

       }

    );
    //update the cart items again setCartItems
    setCartItem(generateCartItemsFrom(response.data,products)); 
   }
   catch(e){
    if (e.response && e.response.status === 400) {
      enqueueSnackbar(e.response.data.message, { variant: "error" });
    } else {
      enqueueSnackbar(
        "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
        {
          variant: "error",
        }
      );
    }
    return null;

   }
}

//another helper function to be passed as a prop to ProductCard, and we are taking productId form travesing filteredItems array.
let handleCart=(productId)=>{
  addToCart(
    token,
    cartItem,
    products,
    productId
    // 1
  );
}

//helper function to handle the quantity of products ie + and - buttons will use this function(to add or remove quantity) and ultimately this function will call addInCart
const handleQuantity=(productId,qty)=>{
// console.log("productId and qty in handleQuantity: "+productId+" "+qty);
addInCart(productId,qty);
}
return (
<div>
  <Header>
    {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
    <TextField
      className="search-desktop"
      size="small"
      fullWidth
      // sx={{ m: 1, width: '50ch' }}
      
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Search color="primary" />
          </InputAdornment>
        ),
      }}
      placeholder="Search for items/categories"
      name="search"
     
      // value={searchValue} ,since passing event from here, hence on need to give value
       //here debounceTime is a state we have declared
      onChange={(e) => {debounceSearch(e, timer)}}
    />
    </Header>
    {/* The main way is with an "InputAdornment", This can be used to add a prefix, a suffix, or an action to an input. For instance, you can use an icon button to hide or reveal the password. */}
  
  

  {/* Search view for desktop, we are passing this <TextField/> code from here, and access this textField in header with the "chidren" keyword */}
  {/* also we need to show this search bar only when we are on the product page + "hasHiddenAuthButtons" is not passed from here to header, 
  hence that will be undefined when used in header.js, 
  but if we do this: {hasHiddenAuthButtons} ,  then it will be harmless, bcz undefined is inside {}*/}

  <TextField
    className="search-mobile"
    size="small"
    fullWidth
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <Search color="primary" />
        </InputAdornment>
      ),
    }}
    placeholder="Search for items/categories"
    name="search"
    onChange={(e) => debounceSearch(e, timer)}
  />
  {/* here our main container grid starts */}
  <Grid container>
    {/* below is the first item in main grid containing: a grid of hero section and another grid having products(70% of screen is taken)*/}
    <Grid
      item
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      xs
      md
      // OR: md={token && productDetails.length>0 ? 9 : 12}
    >
    <Grid item className="product-grid" >
      <Box className="hero">
        <p className="hero-heading">
          India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
          to your door step
        </p>
      </Box>
    </Grid>
    {/* used a loading condition here to show loading during api call else show products */}
    {loading ? (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{margin:"auto"}}
        py={10}
      >
        <CircularProgress size={30} />
        <h4> Loading Products... </h4>
      </Box>
    ) : (
      // now show filtered products OR products using another grid...2nd item in item container grid
        //also check if filtered product array is not empty 

        
      <Grid
        container
        item
        spacing={2}
        direction="row"
        justifyContent="center"
        alignItems="center"
        my={3}
      >
      {
        filteredProduct.length ? (
        filteredProduct.map((product) => (
          // a particular card in a grid
          <Grid item key={product["_id"]} xs={6} md={3}>
            <ProductCard 
            product={product} 
            //taking _id from above
            handleAddToCart={(event)=>handleCart(product["_id"])}
            />
          </Grid>
        ))
      ):(
        <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              py={10}
              sx={{margin: "auto"}}
            >
              <SentimentDissatisfied size={40} />
              <h4>No products found</h4>
            </Box>

      )}
      {/* product grid end here */}
  </Grid>
  )}
  {/* 1st grid item of main conatiner ends here */}
  </Grid>
  {/* below is the second grid item of main conatiner grid for showing cart(covering around 30% of width on right)...show only when there is a user logged in */}
  {username && (
  <Grid
    container
    item
    xs={12}
    md={3} //bcz after log out we want our main grid to take whole width
    style={{ backgroundColor: "#E9F5E1", height: "100vh" }}
    justifyContent="center"
    alignItems="stretch"
    >
    {/* cart component */}
        <Cart 
      
      products={products}
      items={cartItem}
      handleQuantity={handleQuantity}
      />
    
    </Grid>
    )}
    {/* main container grid ends below */}
  </Grid>

  <Footer/>
</div>
);
};

export default Products;
