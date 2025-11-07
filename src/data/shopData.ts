import { Shop, ShopFilters } from "@/types";
import { mockShops } from "./mockData";

export const getAllShops = function (filters: ShopFilters): Shop[] {
    const parameters = new URLSearchParams();

    if (filters) {
        if (filters.category) {
            parameters.append("category", filters.category.join(","));
        }
        if (filters.rating) {
            parameters.append("rating", filters.rating.toString());
        }
        if (filters.isOpenNow !== undefined) {
            parameters.append("isOpenNow", filters.isOpenNow.toString());
        }
        if (filters.featured !== undefined) {
            parameters.append("featured", filters.featured.toString());
        }
        if (filters.searchQuery) {
            parameters.append("searchQuery", filters.searchQuery);
        }
        if (filters.id){
            parameters.append("id", filters.id.toString());
            return mockShops.filter((shop) => shop.id === filters.id);
        }
    }

    const queryString = parameters.toString();

    try{
        fetch(`${process.env.BASE_URL}/shops?${queryString}`)
            .then((response) => response.json())
            .then((data) => {
                console.log("Fetched shop data:", data);
                return data as Shop[];
            })
            .catch((error) => {
                console.error("Error fetching shop data:", error);
                return [];
            });
    }catch(err){
        console.error("Error in shopData function:", err);
        return mockShops
    }
};
