"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { collection, getDocs, addDoc, query } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Product, APIProduct } from "@/types/product"

interface ProductsContextType {
  products: Product[]
  loading: boolean
  error: string | null
  categories: string[]
  refetch: () => Promise<void>
  addProduct: (product: Omit<Product, "id">) => Promise<void>
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

const API_URL = "https://kolzsticks.github.io/Free-Ecommerce-Products-Api/main/products.json"

function transformProduct(apiProduct: APIProduct): Product {
  // Generate random discount (10-40%)
  const discount = Math.floor(Math.random() * 31) + 10
  // Randomly mark some products as featured
  const isFeatured = Math.random() > 0.7

  return {
    id: apiProduct.id,
    title: apiProduct.name,
    price: apiProduct.priceCents / 100,
    image: apiProduct.image,
    rating: apiProduct.rating.stars,
    ratingCount: apiProduct.rating.count,
    category: apiProduct.category,
    subCategory: apiProduct.subCategory,
    description: apiProduct.description,
    keywords: apiProduct.keywords,
    discount,
    isFeatured,
  }
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>([])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(API_URL)
      
      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }
      
      const data: APIProduct[] = await response.json()
      const transformedProducts = data.map(transformProduct)
      
      // Fetch products from Firestore
      const vendorProductsRef = collection(db, "products")
      const vendorProductsSnapshot = await getDocs(vendorProductsRef)
      const vendorProducts: Product[] = vendorProductsSnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          title: data.title,
          price: data.price,
          image: data.image,
          rating: data.rating || 0,
          ratingCount: data.ratingCount || 0,
          category: data.category || "Uncategorized",
          subCategory: data.subCategory || "Uncategorized",
          description: data.description || "",
          keywords: data.keywords || [],
          discount: data.discount || 0,
          isFeatured: data.isFeatured || false,
          vendorId: data.vendorId,
        } as Product
      })

      const allProducts = [...transformedProducts, ...vendorProducts]
      setProducts(allProducts)
      
      // Extract unique categories
      const uniqueCategories = [...new Set(allProducts.map((p) => p.category))]
      setCategories(uniqueCategories)
    } catch (err) {
      console.error("Error fetching products:", err)
      setError("Failed to fetch products. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const addProduct = async (productData: Omit<Product, "id">) => {
    try {
      const vendorProductsRef = collection(db, "products")
      await addDoc(vendorProductsRef, productData)
      await fetchProducts()
    } catch (err) {
      console.error("Error adding product:", err)
      throw err
    }
  }

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        error,
        categories,
        refetch: fetchProducts,
        addProduct,
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductsContext)
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider")
  }
  return context
}
