export type ProductDimensions = {
  width: string;
  height: string;
  depth: string;
};

export type ProductCustomField = {
  name: string;
  value: string;
};

export type ProductModifier = {
  name: string;
  type: string;
  value: string;
  required: boolean;
};

export type ProductData = {
  modifiers: boolean;
  giftWrappingOption: string;
  productName: string;
  sku: string;
  defaultPrice: string;
  productType: string;
  brand: string;
  weight: string;
  visibleOnStorefront: boolean;
  categories: string[];
  description: string;
  imageUrl?: string;
  mpn: string;
  upc: string;
  gtin: string;
  bpn: string;
  taxClass: string;
  trackInventory: boolean;
  featuredProduct: boolean;
  searchKeywords: string;
  sortOrder: string;
  warrantyInfo: string;
  availabilityText: string;
  condition: string;
  showConditionOnStorefront: boolean;
  customFields: ProductCustomField[];
  showRelatedProducts: boolean;
  dimensions: ProductDimensions;
  fixedShippingPrice: string;
  freeShipping: boolean;
  purchasability: number;
  minPurchaseQty: string;
  maxPurchaseQty: string;
  giftWrapping: number;
  manageCustomsInfo: boolean;
  pageTitle: string;
  productUrl: string;
  metaDescription: string;
  objectType: string;
  useProductName: boolean;
  useMetaDescription: boolean;
  useThumbnailImage: boolean;
  imageName?: string;
};
