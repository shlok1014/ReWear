// Unsplash image URLs for different clothing categories
const unsplashImages = {
  tops: [
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=600&fit=crop'
  ],
  bottoms: [
    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=600&fit=crop'
  ],
  dresses: [
    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&h=600&fit=crop'
  ],
  outerwear: [
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=600&fit=crop'
  ],
  shoes: [
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=600&fit=crop'
  ],
  accessories: [
    'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500&h=600&fit=crop'
  ],
  bags: [
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=600&fit=crop'
  ],
  jewelry: [
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=600&fit=crop',
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=600&fit=crop'
  ]
};

// Get random image for a category
export const getRandomImage = (category) => {
  const images = unsplashImages[category] || unsplashImages.tops;
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
};

// Get multiple images for a category
export const getMultipleImages = (category, count = 3) => {
  const images = unsplashImages[category] || unsplashImages.tops;
  const selectedImages = [];
  
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * images.length);
    selectedImages.push({
      url: images[randomIndex],
      alt: `${category} item`,
      isPrimary: i === 0
    });
  }
  
  return selectedImages;
};

// Generate sample items with Unsplash images
export const generateSampleItems = () => {
  const categories = ['tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'accessories', 'other'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size', 'Other'];
  const conditions = ['new', 'like-new', 'good', 'fair', 'poor'];
  const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Pink', 'Purple', 'Brown', 'Gray'];
  const brands = ['Nike', 'Adidas', 'Levi\'s', 'H&M', 'Zara', 'Uniqlo', 'Gap', 'Old Navy', 'Target', 'Walmart'];
  const materials = ['Cotton', 'Polyester', 'Denim', 'Wool', 'Silk', 'Linen', 'Rayon', 'Spandex'];

  const sampleItems = [
    {
      title: "Vintage Denim Jacket",
      description: "Classic blue denim jacket in excellent condition. Perfect for layering and adds a timeless touch to any outfit.",
      category: "outerwear",
      size: "M",
      condition: "good",
      brand: "Levi's",
      color: "Blue",
      material: "Denim",
      location: "New York, NY",
      estimatedValue: 45,
      tags: ["vintage", "denim", "classic"],
      images: [
        "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop"
      ]
    },
    {
      title: "Sustainable Cotton T-Shirt",
      description: "Soft, breathable cotton t-shirt made from organic materials. Comfortable fit and perfect for everyday wear.",
      category: "tops",
      size: "L",
      condition: "like-new",
      brand: "H&M",
      color: "White",
      material: "Cotton",
      location: "San Francisco, CA",
      estimatedValue: 15,
      tags: ["sustainable", "organic", "comfortable"],
      images: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop"
      ]
    },
    {
      title: "High-Waisted Skinny Jeans",
      description: "Trendy high-waisted jeans with a flattering fit. Great for both casual and dressy occasions.",
      category: "bottoms",
      size: "M",
      condition: "good",
      brand: "Zara",
      color: "Black",
      material: "Denim",
      location: "Austin, TX",
      estimatedValue: 35,
      tags: ["trendy", "high-waisted", "versatile"],
      images: [
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop"
      ]
    },
    {
      title: "Floral Summer Dress",
      description: "Beautiful floral print dress perfect for summer days. Lightweight and comfortable with a flattering silhouette.",
      category: "dresses",
      size: "S",
      condition: "new",
      brand: "Target",
      color: "Pink",
      material: "Polyester",
      location: "Miami, FL",
      estimatedValue: 25,
      tags: ["floral", "summer", "feminine"],
      images: [
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop"
      ]
    },
    {
      title: "Running Sneakers",
      description: "Comfortable running shoes with excellent cushioning. Perfect for workouts or casual wear.",
      category: "shoes",
      size: "L",
      condition: "good",
      brand: "Nike",
      color: "Gray",
      material: "Mesh",
      location: "New York, NY",
      estimatedValue: 60,
      tags: ["running", "comfortable", "athletic"],
      images: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop"
      ]
    },
    {
      title: "Leather Crossbody Bag",
      description: "Stylish leather crossbody bag with adjustable strap. Perfect size for essentials and adds a chic touch.",
      category: "accessories",
      size: "One Size",
      condition: "like-new",
      brand: "Gap",
      color: "Brown",
      material: "Leather",
      location: "San Francisco, CA",
      estimatedValue: 40,
      tags: ["leather", "crossbody", "stylish"],
      images: [
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop"
      ]
    },
    {
      title: "Wool Sweater",
      description: "Cozy wool sweater perfect for cold weather. Soft texture and classic design that never goes out of style.",
      category: "tops",
      size: "M",
      condition: "good",
      brand: "Uniqlo",
      color: "Gray",
      material: "Wool",
      location: "Austin, TX",
      estimatedValue: 30,
      tags: ["wool", "cozy", "winter"],
      images: [
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop"
      ]
    },
    {
      title: "Silk Blouse",
      description: "Elegant silk blouse with a sophisticated design. Perfect for professional settings or special occasions.",
      category: "tops",
      size: "S",
      condition: "new",
      brand: "Zara",
      color: "White",
      material: "Silk",
      location: "Miami, FL",
      estimatedValue: 50,
      tags: ["silk", "elegant", "professional"],
      images: [
        "https://images.unsplash.com/photo-1564257631407-3deb25e91aa3?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1564257631407-3deb25e91aa3?w=400&h=400&fit=crop"
      ]
    },
    {
      title: "Cargo Pants",
      description: "Comfortable cargo pants with multiple pockets. Great for outdoor activities or casual wear.",
      category: "bottoms",
      size: "L",
      condition: "good",
      brand: "Old Navy",
      color: "Green",
      material: "Cotton",
      location: "New York, NY",
      estimatedValue: 20,
      tags: ["cargo", "comfortable", "outdoor"],
      images: [
        "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop"
      ]
    },
    {
      title: "Statement Necklace",
      description: "Bold statement necklace that adds personality to any outfit. Perfect for dressing up a simple look.",
      category: "accessories",
      size: "One Size",
      condition: "new",
      brand: "Target",
      color: "Gold",
      material: "Metal",
      location: "San Francisco, CA",
      estimatedValue: 15,
      tags: ["statement", "bold", "accessorize"],
      images: [
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop"
      ]
    }
  ];

  return sampleItems;
};

export default {
  getRandomImage,
  getMultipleImages,
  generateSampleItems
}; 