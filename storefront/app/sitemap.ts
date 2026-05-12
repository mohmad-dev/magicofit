import { MetadataRoute } from 'next'
import { getProducts, getCategories } from '@/lib/store-api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://magicofit.com'
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/ar`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ar/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  try {
    // Fetch products
    const productsData = await getProducts({ limit: 100 })
    const productPages: MetadataRoute.Sitemap = productsData.products.map((product) => ({
      url: `${baseUrl}/ar/products/${product.handle}`,
      lastModified: new Date(product.updated_at || Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // Fetch categories
    const categoriesData = await getCategories()
    const categoryPages: MetadataRoute.Sitemap = categoriesData.map((category) => ({
      url: `${baseUrl}/ar/shop/${category.handle}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    return [...staticPages, ...productPages, ...categoryPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticPages
  }
}
