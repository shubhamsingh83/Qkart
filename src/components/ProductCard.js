import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
  Box
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

// ---------dummy data---------
// let product={
//   "name":"Tan Leatherette Weekender Duffle",
//   "category":"Fashion",
//   "cost":150,
//   "rating":4,
//   "image":"https://crio-directus-assets.s3.ap-south-1.amazonaws.com/ff071a1c-1099-48f9-9b03-f858ccc53832.png",
//   "_id":"PmInA797xJhMIPti"
//   }
const ProductCard = ({ product, handleAddToCart }) => {
  
  // console.log("product img:");
  // // console.log(product);
  // console.log(product.image);
  return (
    // refer notes below
    <Card className="card">
    <CardMedia
        component="img"
        image={product.image}
        alt="product"
      />      
   <CardContent>
        <Typography gutterBottom variant="body2" component="div">
          {product.name}
        </Typography>
        <Typography
          variant="h6"
          color="textPrimary"
          sx={{ fontWeight: "bold" }}
          mb={1}
        >
          ${product.cost}
        </Typography>
        <Box display="flex">
          <Rating
            name="read-only"
            value={product.rating}
            readOnly
            size="small"
          />
          <Box sx={{ ml: 1 }}>({product.rating})</Box>
        </Box>
      </CardContent>
      <CardActions className="card-actions">
        <Button
          color="primary"
          variant="contained"
          fullWidth
          onClick={(e)=>handleAddToCart()}
          className="card-button"
        >
          <AddShoppingCartOutlined /> &nbsp; ADD TO CART
        </Button>
      </CardActions>
    </Card> 
  );
};

export default ProductCard;
