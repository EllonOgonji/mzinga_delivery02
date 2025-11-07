import { ProductFilters, Product } from "@/types";
import { mockProducts } from "./mockData";

export const getAllProducts = function (filters: ProductFilters): Product[] {
    const parameters = new URLSearchParams();

    if (filters) {
        if (filters.category) {
            parameters.append("category", filters.category.join(","));
        }
        if (filters.rating) {
            parameters.append("rating", filters.rating.toString());
        }
        if (filters.priceRange) {
            parameters.append("minPrice", filters.priceRange.min.toString());
            parameters.append("maxPrice", filters.priceRange.max.toString());
        }
        if (filters.inStock !== undefined) {
            parameters.append("inStock", filters.inStock.toString());
        }
        if (filters.featured !== undefined) {
            parameters.append("featured", filters.featured.toString());
        }
        if (filters.searchQuery) {
            parameters.append("searchQuery", filters.searchQuery);
        }
        if (filters.id){
            parameters.append("id", filters.id.toString());
            return mockProducts.filter((product) => product.id === filters.id);
        }
        if (filters.shopId){
            parameters.append("shopId", filters.shopId.toString());
            return mockProducts.filter((product) => product.shopId === filters.shopId);
        }
    }

    const queryString = parameters.toString();

    try{
        fetch(`${process.env.BASE_URL}/products?${queryString}`)
            .then((response) => response.json())
            .then((data) => {
                console.log("Fetched product data:", data);
                return data as Product[];
            })
            .catch((error) => {
                console.error("Error fetching product data:", error);
                return [];
            });
    }catch(err){
        console.error("Error in productData function:", err);
        return mockProducts
    }
};
