import { Link } from 'react-router';
import { FaShoppingCart } from 'react-icons/fa';

const EmptyCartPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <FaShoppingCart className="text-6xl text-secondary mb-4 animate-bounce" />
      <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-2">Your cart is empty</h2>
      <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
      <Link
        to="/shop-page"
        className="btn-lg btn btn-primary text-white rounded-lg  transition"
      >
        Go to Shop
      </Link>
    </div>
  );
};

export default EmptyCartPage;
