import { useEffect } from "react";
import CategoryItem from "../components/categoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";

const categories = [
	{ href: "/esp module", name: "esp module", imageUrl: "/esp.jpeg" },
	{ href: "/casing", name: "casing", imageUrl: "/casing.jpeg" },
	{ href: "/laptop", name: "laptop", imageUrl: "/laptop.jpg" },
	{ href: "/power supply", name: "power supply", imageUrl: "/power.jpeg" },
	{ href: "/sd card", name: "sd card", imageUrl: "/sd.jpeg" },
	{ href: "/switch", name: "switch", imageUrl: "/switch.jpeg" },
	{ href: "/wifi module", name: "wifi module ", imageUrl: "/wifi.jpeg" },

];

function HomePage() {
	const { fetchFeaturedProducts, products, isLoading } = useProductStore();

	useEffect(() => {
		fetchFeaturedProducts();
	}, [fetchFeaturedProducts]);

  return (
    <div className='relative min-h-screen text-white overflow-hidden'>
			<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<h1 className='text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4'>
					Explore Our Categories
				</h1>
				<p className='text-center text-xl text-gray-300 mb-12'>
					Discover the latest trends in eco-friendly components
				</p>

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{categories.map((category) => (
						<CategoryItem category={category} key={category.name} />
					))}
				</div>
				{!isLoading && products.length > 0 && <FeaturedProducts featuredProducts={products} />}
			</div>
		</div>
   
  )
}

export default HomePage
