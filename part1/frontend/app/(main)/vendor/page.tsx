"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { collection, query, where, onSnapshot, orderBy, updateDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/context/auth-context"
import { useProducts } from "@/context/products-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Store, Bell, Package, Plus, CheckCircle } from "lucide-react"
import type { VendorNotification } from "@/types/notification"

export default function VendorDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const { products, addProduct } = useProducts()
  
  const [notifications, setNotifications] = useState<VendorNotification[]>([])
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  
  // Product Form State
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [image, setImage] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if not logged in
  useEffect(() => {
    if (user === null) {
      router.push("/login")
    }
  }, [user, router])

  // Fetch Vendor Notifications
  useEffect(() => {
    if (!user) return

    const notificationsRef = collection(db, "notifications")
    const q = query(
      notificationsRef,
      where("vendorId", "==", user.uid),
      // Firebase requires index for multiple filters, so sorting by doc ID if createdAt lacks index initially.
      // Assuming createdAt works without index due to only one equality filter.
      orderBy("createdAt", "desc")
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const notifs: VendorNotification[] = []
        snapshot.forEach((doc) => {
          notifs.push({ id: doc.id, ...doc.data() } as VendorNotification)
        })
        setNotifications(notifs)
      },
      (error) => {
        console.error("Error fetching notifications:", error)
        // Fallback for missing index error
        if (error.message.includes("index")) {
           const fallbackQ = query(notificationsRef, where("vendorId", "==", user.uid))
           onSnapshot(fallbackQ, (snap) => {
             const notifs: VendorNotification[] = []
             snap.forEach((doc) => {
               notifs.push({ id: doc.id, ...doc.data() } as VendorNotification)
             })
             setNotifications(notifs.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)))
           })
        }
      }
    )

    return () => unsubscribe()
  }, [user])

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !title || !price || !image || !category) return

    try {
      setIsSubmitting(true)
      await addProduct({
        title,
        price: parseFloat(price),
        image,
        category,
        subCategory: category,
        description,
        rating: 0,
        ratingCount: 0,
        keywords: title.toLowerCase().split(" "),
        discount: 0,
        isFeatured: false,
        vendorId: user.uid,
      })
      
      // Reset Form
      setTitle("")
      setPrice("")
      setImage("")
      setCategory("")
      setDescription("")
      setIsAddingProduct(false)
    } catch (error) {
      console.error("Error adding product", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await updateDoc(doc(db, "notifications", notificationId), {
        read: true
      })
    } catch (error) {
      console.error("Error updating notification", error)
    }
  }

  if (!user) return null

  const myProducts = products.filter(p => p.vendorId === user.uid)
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vendor Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage your products and view notifications.</p>
        </div>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            My Products
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
            {unreadCount > 0 && (
              <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Product Catalog</h2>
            <Button onClick={() => setIsAddingProduct(!isAddingProduct)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {isAddingProduct ? "Cancel" : "Add New Product"}
            </Button>
          </div>

          {isAddingProduct && (
            <Card className="mb-8 border-primary/20 shadow-sm">
              <CardHeader>
                <CardTitle>Create New Product</CardTitle>
                <CardDescription>Enter the details of the product you want to sell.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Product Title</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Wireless Headphones"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="e.g. 99.99"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="e.g. Electronics"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="image">Image URL</Label>
                      <Input
                        id="image"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief description of the product"
                    />
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                    {isSubmitting ? "Adding..." : "Save Product"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {myProducts.length === 0 && !isAddingProduct ? (
            <div className="text-center py-12 border rounded-lg border-dashed bg-secondary/20">
              <Store className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No Products Yet</h3>
              <p className="text-muted-foreground mb-4">You haven't listed any products for sale.</p>
              <Button onClick={() => setIsAddingProduct(true)}>Add Your First Product</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {myProducts.map(product => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="aspect-square relative flex items-center justify-center p-4 bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image}
                      alt={product.title}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="text-sm text-primary font-medium mb-1">{product.category}</div>
                    <h3 className="font-semibold text-lg truncate mb-2">{product.title}</h3>
                    <p className="text-muted-foreground font-medium">${product.price.toFixed(2)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Stay updated on when users interact with your products.</CardDescription>
            </CardHeader>
            <CardContent>
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No notifications yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start justify-between p-4 rounded-lg border ${
                        notification.read ? "bg-background" : "bg-primary/5 border-primary/20"
                      }`}
                    >
                      <div className="flex gap-4">
                        <div className="mt-1">
                          <ShoppingCartIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">
                            <span className="text-primary">{notification.userName}</span> added {" "}
                            <span className="font-bold">"{notification.productName}"</span> to their cart.
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.createdAt ? new Date(notification.createdAt.toMillis ? notification.createdAt.toMillis() : notification.createdAt).toLocaleString() : "Just now"}
                          </p>
                        </div>
                      </div>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs flex items-center gap-1"
                        >
                          <CheckCircle className="h-3 w-3" />
                          Mark as read
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ShoppingCartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  )
}
