export interface VendorNotification {
  id: string
  vendorId: string
  productId: string
  productName: string
  userId: string
  userName: string
  type: "added_to_cart" | "purchased"
  read: boolean
  createdAt: number // timestamp
}
